/**
 * Next.js API Route - Meetings Webhook
 * Path: /api/meetings/webhook
 *
 * Webhook for AI voice platforms (Retell) to notify when a meeting is booked during a call
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface MeetingBookedPayload {
  event: string;
  call_id?: string;
  lead_phone?: string;
  lead_email?: string;
  scheduled_at: string;
  duration?: number;
  notes?: string;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    const body: MeetingBookedPayload = await request.json();
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
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    // Validate required fields
    if (!scheduled_at || (!lead_phone && !lead_email)) {
      return NextResponse.json(
        { error: 'scheduled_at and (lead_phone or lead_email) are required' },
        { status: 400 }
      );
    }

    // Find the lead
    let lead: { id: string; user_id: string; business_name: string; contact_name: string; email: string; phone: string } | null = null;

    if (lead_phone) {
      const { data } = await supabase
        .from('leads')
        .select('id, user_id, business_name, contact_name, email, phone')
        .eq('phone', lead_phone)
        .limit(1)
        .single();
      lead = data;
    }

    if (!lead && lead_email) {
      const { data } = await supabase
        .from('leads')
        .select('id, user_id, business_name, contact_name, email, phone')
        .eq('email', lead_email)
        .limit(1)
        .single();
      lead = data;
    }

    if (!lead) {
      console.error('[Meetings Webhook] Lead not found:', { lead_phone, lead_email });
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Find associated outreach call
    let callId: string | null = null;
    if (external_call_id) {
      const { data: calls } = await supabase
        .from('outreach_calls')
        .select('id')
        .eq('vapi_call_id', external_call_id)
        .limit(1);

      if (calls && calls.length > 0) {
        callId = calls[0].id;
      }
    }

    // Create the meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        user_id: lead.user_id,
        lead_id: lead.id,
        call_id: callId,
        scheduled_at,
        duration,
        meeting_type: 'strategy_call',
        notes,
        status: 'scheduled'
      })
      .select()
      .single();

    if (meetingError) {
      console.error('[Meetings Webhook] Failed to create meeting:', meetingError);
      return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'meeting_scheduled' })
      .eq('id', lead.id);

    // Mark call as having booked meeting
    if (callId) {
      await supabase
        .from('outreach_calls')
        .update({ meeting_booked: true })
        .eq('id', callId);
    }

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, name')
          .eq('id', lead.user_id)
          .single();

        if (profile?.email) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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
                <p><strong>Scheduled:</strong> ${new Date(scheduled_at).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              `
            }),
          });
        }
      } catch (emailError) {
        console.error('[Meetings Webhook] Email failed:', emailError);
      }
    }

    console.log(`[Meetings Webhook] Created meeting ${meeting?.id} for lead ${lead.id}`);

    return NextResponse.json({
      success: true,
      meeting_id: meeting?.id,
      message: 'Meeting booked successfully'
    });

  } catch (error) {
    console.error('[Meetings Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/meetings/webhook',
    description: 'POST meeting_booked events here'
  });
}
