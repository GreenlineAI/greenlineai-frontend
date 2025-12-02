/**
 * Cloudflare Worker Function - Calendly Webhook
 * Path: /api/calendly/webhook
 *
 * Receives notifications when someone books a meeting via Calendly
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY?: string;
}

interface CalendlyWebhookPayload {
  event: string;
  payload: {
    event_type: {
      name: string;
      duration: number;
    };
    invitee: {
      name: string;
      email: string;
      text_reminder_number?: string;
    };
    scheduled_event: {
      start_time: string;
      end_time: string;
      location?: {
        type: string;
        join_url?: string;
      };
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body: CalendlyWebhookPayload = await request.json();

    // Only process booking events
    if (body.event !== 'invitee.created') {
      return new Response(
        JSON.stringify({ message: 'Event type not handled' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { payload } = body;
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Extract meeting details
    const inviteeName = payload.invitee.name;
    const inviteeEmail = payload.invitee.email;
    const inviteePhone = payload.invitee.text_reminder_number;
    const scheduledAt = payload.scheduled_event.start_time;
    const duration = payload.event_type.duration;
    const meetingType = payload.event_type.name;
    const location = payload.scheduled_event.location?.join_url ||
                     payload.scheduled_event.location?.type ||
                     'Calendly';

    // Extract business info from Q&A if available
    let businessName = inviteeName;
    let notes = '';

    if (payload.questions_and_answers) {
      payload.questions_and_answers.forEach(qa => {
        if (qa.question.toLowerCase().includes('business') ||
            qa.question.toLowerCase().includes('company')) {
          businessName = qa.answer;
        }
        notes += `${qa.question}: ${qa.answer}\n`;
      });
    }

    // Try to find existing lead by email or phone
    let lead: { id: string; user_id: string; business_name: string } | null = null;
    let userId: string | null = null;

    if (inviteeEmail) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/leads?email=eq.${encodeURIComponent(inviteeEmail)}&select=id,user_id,business_name&limit=1`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const leads = await response.json();
        if (leads && leads.length > 0) {
          lead = leads[0];
          userId = lead?.user_id ?? null;
        }
      }
    }

    if (!lead && inviteePhone) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/leads?phone=eq.${encodeURIComponent(inviteePhone)}&select=id,user_id,business_name&limit=1`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const leads = await response.json();
        if (leads && leads.length > 0) {
          lead = leads[0];
          userId = lead?.user_id ?? null;
        }
      }
    }

    // If no lead found, create a new one for the default user
    if (!lead) {
      // Get the first user
      const usersResponse = await fetch(
        `${supabaseUrl}/rest/v1/profiles?select=id&limit=1`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        if (users && users.length > 0) {
          userId = users[0].id;

          // Create new lead
          const createLeadResponse = await fetch(
            `${supabaseUrl}/rest/v1/leads`,
            {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              body: JSON.stringify({
                user_id: userId,
                business_name: businessName,
                contact_name: inviteeName,
                email: inviteeEmail,
                phone: inviteePhone || 'N/A',
                city: 'N/A',
                state: 'N/A',
                industry: 'Unknown',
                status: 'meeting_scheduled',
                score: 'hot',
                notes: `Calendly booking: ${notes}`
              }),
            }
          );

          if (createLeadResponse.ok) {
            const newLeads = await createLeadResponse.json();
            if (newLeads && newLeads.length > 0) {
              lead = newLeads[0];
            }
          }
        }
      }
    }

    if (!userId || !lead) {
      return new Response(
        JSON.stringify({ error: 'Could not find or create lead' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create meeting record
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
          user_id: userId,
          lead_id: lead.id,
          scheduled_at: scheduledAt,
          duration,
          meeting_type: meetingType,
          location,
          notes: notes.trim(),
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

    // Send email notification if Resend is configured
    if (env.RESEND_API_KEY) {
      try {
        // Get user profile
        const profileResponse = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=email,name`,
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
                subject: `New Meeting Booked: ${businessName}`,
                html: `
                  <h2>New Meeting Booked via Calendly!</h2>
                  <p><strong>Business:</strong> ${businessName}</p>
                  <p><strong>Contact:</strong> ${inviteeName}</p>
                  <p><strong>Email:</strong> ${inviteeEmail}</p>
                  <p><strong>Phone:</strong> ${inviteePhone || 'N/A'}</p>
                  <p><strong>Scheduled:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
                  <p><strong>Duration:</strong> ${duration} minutes</p>
                  <p><strong>Type:</strong> ${meetingType}</p>
                  ${notes ? `<p><strong>Notes:</strong><br/>${notes.replace(/\n/g, '<br/>')}</p>` : ''}
                `
              }),
            });
            console.log('✅ Email notification sent to:', profile.email);
          }
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        meeting_id: meeting?.id,
        lead_id: lead.id,
        message: 'Calendly booking processed successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Calendly webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
