/**
 * Cloudflare Worker Function - Meetings Webhook
 * Path: /api/meetings/webhook
 *
 * Webhook endpoint for AI voice platforms (Retell, Stammer) to notify us when a meeting is booked
 *
 * Expected payload:
 * {
 *   "event": "meeting_booked",
 *   "call_id": "external_call_id",
 *   "lead_phone": "+1234567890",
 *   "scheduled_at": "2025-12-05T14:00:00Z",
 *   "duration": 15,
 *   "notes": "Customer wants to discuss lead generation"
 * }
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const {
      event,
      call_id: external_call_id,
      lead_phone,
      lead_email,
      scheduled_at,
      duration = 15,
      notes
    } = body;

    // Validate event type
    if (event !== 'meeting_booked') {
      return new Response(
        JSON.stringify({ error: 'Invalid event type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!scheduled_at || (!lead_phone && !lead_email)) {
      return new Response(
        JSON.stringify({ error: 'scheduled_at and (lead_phone or lead_email) are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Find the lead by phone or email
    let leadQuery = `${supabaseUrl}/rest/v1/leads?select=id,user_id,business_name,contact_name,email,phone&limit=1`;
    if (lead_phone) {
      leadQuery += `&phone=eq.${encodeURIComponent(lead_phone)}`;
    } else if (lead_email) {
      leadQuery += `&email=eq.${encodeURIComponent(lead_email)}`;
    }

    const leadResponse = await fetch(leadQuery, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!leadResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to query leads' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const leads = await leadResponse.json();

    if (!leads || leads.length === 0) {
      console.error('Lead not found:', { lead_phone, lead_email });
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = leads[0];

    // Find the associated outreach call if external_call_id is provided
    let call_id = null;
    if (external_call_id) {
      const callResponse = await fetch(
        `${supabaseUrl}/rest/v1/outreach_calls?vapi_call_id=eq.${encodeURIComponent(external_call_id)}&select=id&limit=1`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (callResponse.ok) {
        const calls = await callResponse.json();
        if (calls && calls.length > 0) {
          call_id = calls[0].id;
        }
      }
    }

    // Create the meeting
    const meetingResponse = await fetch(
      `${supabaseUrl}/rest/v1/meetings`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          user_id: lead.user_id,
          lead_id: lead.id,
          call_id,
          scheduled_at,
          duration,
          meeting_type: 'strategy_call',
          notes,
          status: 'scheduled'
        }),
      }
    );

    if (!meetingResponse.ok) {
      const error = await meetingResponse.text();
      console.error('Failed to create meeting:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create meeting', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meetings = await meetingResponse.json();
    const meeting = meetings && meetings.length > 0 ? meetings[0] : null;

    // Update lead status
    await fetch(
      `${supabaseUrl}/rest/v1/leads?id=eq.${lead.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ status: 'meeting_scheduled' }),
      }
    );

    // Mark call as having booked meeting
    if (call_id) {
      await fetch(
        `${supabaseUrl}/rest/v1/outreach_calls?id=eq.${call_id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ meeting_booked: true }),
        }
      );
    }

    // Send email notification if Resend is configured
    if (env.RESEND_API_KEY) {
      try {
        const profileResponse = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${lead.user_id}&select=email,name`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profiles = await profileResponse.json();
          if (profiles && profiles.length > 0 && profiles[0].email) {
            const profile = profiles[0];

            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'GreenLine AI <notifications@greenlineai.com>',
                to: profile.email,
                subject: `Meeting Booked: ${lead.business_name}`,
                html: `
                  <h2>Meeting Booked!</h2>
                  <p><strong>Business:</strong> ${lead.business_name}</p>
                  <p><strong>Contact:</strong> ${lead.contact_name || 'N/A'}</p>
                  <p><strong>Phone:</strong> ${lead.phone}</p>
                  <p><strong>Email:</strong> ${lead.email || 'N/A'}</p>
                  <p><strong>Scheduled:</strong> ${new Date(scheduled_at).toLocaleString()}</p>
                  <p><strong>Duration:</strong> ${duration} minutes</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                `
              }),
            });
            console.log('✅ Email notification sent to:', profile.email);
          }
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        meeting_id: meeting?.id,
        message: 'Meeting booked successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
