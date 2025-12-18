/**
 * Next.js API Route - Calendly/Cal.com Webhook
 * Path: /api/calendly/webhook
 *
 * Receives notifications when someone books a meeting via Calendly or Cal.com
 * Works with both platforms - auto-detects payload format
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface CalendlyPayload {
  event: string;
  payload: {
    event_type: { name: string; duration: number };
    invitee: { name: string; email: string; text_reminder_number?: string };
    scheduled_event: {
      start_time: string;
      end_time: string;
      location?: { type: string; join_url?: string };
    };
    questions_and_answers?: Array<{ question: string; answer: string }>;
  };
}

interface CalComPayload {
  triggerEvent: string;
  payload: {
    title: string;
    startTime: string;
    endTime: string;
    attendees: Array<{ name: string; email: string; timeZone: string }>;
    organizer: { name: string; email: string };
    location?: string;
    metadata?: Record<string, string>;
    responses?: Record<string, { value: string }>;
  };
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
    const body = await request.json();

    // Detect if Calendly or Cal.com
    const isCalCom = 'triggerEvent' in body;
    const isCalendly = 'event' in body && 'payload' in body && 'invitee' in (body.payload || {});

    let inviteeName: string;
    let inviteeEmail: string;
    let inviteePhone: string | undefined;
    let scheduledAt: string;
    let duration: number;
    let meetingType: string;
    let location: string;
    let notes = '';
    let businessName: string;

    if (isCalCom) {
      const calcom = body as CalComPayload;

      // Only process booking created events
      if (calcom.triggerEvent !== 'BOOKING_CREATED') {
        return NextResponse.json({ message: 'Event type not handled' });
      }

      const attendee = calcom.payload.attendees[0];
      inviteeName = attendee?.name || 'Unknown';
      inviteeEmail = attendee?.email || '';
      inviteePhone = undefined; // Cal.com doesn't include phone by default
      scheduledAt = calcom.payload.startTime;
      duration = Math.floor(
        (new Date(calcom.payload.endTime).getTime() - new Date(calcom.payload.startTime).getTime()) / 60000
      );
      meetingType = calcom.payload.title;
      location = calcom.payload.location || 'Cal.com';
      businessName = inviteeName;

      // Extract from responses/metadata
      if (calcom.payload.responses) {
        Object.entries(calcom.payload.responses).forEach(([key, val]) => {
          notes += `${key}: ${val.value}\n`;
          if (key.toLowerCase().includes('business') || key.toLowerCase().includes('company')) {
            businessName = val.value;
          }
        });
      }
    } else if (isCalendly) {
      const calendly = body as CalendlyPayload;

      // Only process booking events
      if (calendly.event !== 'invitee.created') {
        return NextResponse.json({ message: 'Event type not handled' });
      }

      const { payload } = calendly;
      inviteeName = payload.invitee.name;
      inviteeEmail = payload.invitee.email;
      inviteePhone = payload.invitee.text_reminder_number;
      scheduledAt = payload.scheduled_event.start_time;
      duration = payload.event_type.duration;
      meetingType = payload.event_type.name;
      location = payload.scheduled_event.location?.join_url ||
                 payload.scheduled_event.location?.type || 'Calendly';
      businessName = inviteeName;

      if (payload.questions_and_answers) {
        payload.questions_and_answers.forEach(qa => {
          notes += `${qa.question}: ${qa.answer}\n`;
          if (qa.question.toLowerCase().includes('business') || qa.question.toLowerCase().includes('company')) {
            businessName = qa.answer;
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Unknown webhook format' }, { status: 400 });
    }

    // Find existing lead by email or phone
    let lead: { id: string; user_id: string; business_name: string } | null = null;
    let userId: string | null = null;

    if (inviteeEmail) {
      const { data } = await supabase
        .from('leads')
        .select('id, user_id, business_name')
        .eq('email', inviteeEmail)
        .limit(1)
        .single();
      if (data) {
        lead = data;
        userId = data.user_id;
      }
    }

    if (!lead && inviteePhone) {
      const { data } = await supabase
        .from('leads')
        .select('id, user_id, business_name')
        .eq('phone', inviteePhone)
        .limit(1)
        .single();
      if (data) {
        lead = data;
        userId = data.user_id;
      }
    }

    // If no lead found, create one for the first user
    if (!lead) {
      const { data: users } = await supabase.from('profiles').select('id').limit(1);

      if (users && users.length > 0) {
        userId = users[0].id;

        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            user_id: userId,
            business_name: businessName,
            contact_name: inviteeName,
            email: inviteeEmail,
            phone: inviteePhone || 'N/A',
            city: 'Unknown',
            state: 'Unknown',
            industry: 'Other',
            status: 'meeting_scheduled',
            score: 'hot',
            notes: `Booking webhook: ${notes}`
          })
          .select()
          .single();

        if (newLead) {
          lead = newLead;
        }
      }
    }

    if (!userId || !lead) {
      return NextResponse.json({ error: 'Could not find or create lead' }, { status: 400 });
    }

    // Create meeting record
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        user_id: userId,
        lead_id: lead.id,
        scheduled_at: scheduledAt,
        duration,
        meeting_type: meetingType,
        location,
        notes: notes.trim(),
        status: 'scheduled'
      })
      .select()
      .single();

    if (meetingError) {
      console.error('Failed to create meeting:', meetingError);
      return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'meeting_scheduled' })
      .eq('id', lead.id);

    // Send email notification if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, name')
          .eq('id', userId)
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
              subject: `New Meeting Booked: ${businessName}`,
              html: `
                <h2>New Meeting Booked!</h2>
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
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      meeting_id: meeting?.id,
      lead_id: lead.id,
      message: 'Booking processed successfully'
    });

  } catch (error) {
    console.error('Booking webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/calendly/webhook',
    supports: ['Calendly', 'Cal.com'],
    description: 'POST booking webhooks here'
  });
}
