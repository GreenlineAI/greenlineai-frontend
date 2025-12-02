import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendMeetingBookedEmail } from '@/lib/services/email';
import type { Database } from '@/lib/database.types';

/**
 * Calendly Webhook Handler
 * 
 * Receives notifications when someone books a meeting via Calendly
 * 
 * To set up:
 * 1. Go to Calendly → Account → Integrations → Webhooks
 * 2. Add webhook URL: https://your-domain.com/api/calendly/webhook
 * 3. Subscribe to event: invitee.created
 * 4. Add signing key to CALENDLY_WEBHOOK_SECRET env variable
 */

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

export async function POST(request: NextRequest) {
  try {
    const body: CalendlyWebhookPayload = await request.json();

    // Verify webhook signature if secret is set
    const signature = request.headers.get('calendly-webhook-signature');
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    
    // TODO: Implement signature verification for production
    // if (webhookSecret && signature) {
    //   // Verify HMAC signature
    // }

    // Only process booking events
    if (body.event !== 'invitee.created') {
      return NextResponse.json({ message: 'Event type not handled' });
    }

    const { payload } = body;
    const supabase = await createClient();

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
      const { data: leads } = await supabase
        .from('leads')
        .select('id, user_id, business_name')
        .eq('email', inviteeEmail)
        .limit(1);
      
      if (leads && leads.length > 0) {
        lead = leads[0] as { id: string; user_id: string; business_name: string };
        userId = lead?.user_id ?? null;
      }
    }

    if (!lead && inviteePhone) {
      const { data: leads } = await supabase
        .from('leads')
        .select('id, user_id, business_name')
        .eq('phone', inviteePhone)
        .limit(1);
      
      if (leads && leads.length > 0) {
        lead = leads[0] as { id: string; user_id: string; business_name: string };
        userId = lead?.user_id ?? null;
      }
    }

    // If no lead found, create a new one for the default user
    if (!lead) {
      // Get the first user (or specific user by email)
      const { data: users } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (users && users.length > 0) {
        userId = (users[0] as { id: string }).id;

        // Create new lead
        const leadData: Database['public']['Tables']['leads']['Insert'] = {
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
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newLead, error: leadError } = await (supabase as any)
          .from('leads')
          .insert(leadData)
          .select()
          .single();

        if (!leadError && newLead) {
          lead = newLead;
        }
      }
    }

    if (!userId || !lead) {
      return NextResponse.json(
        { error: 'Could not find or create lead' },
        { status: 400 }
      );
    }

    // Create meeting record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: meeting, error: meetingError } = await (supabase as any)
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
      return NextResponse.json(
        { error: 'Failed to create meeting', details: meetingError.message },
        { status: 500 }
      );
    }

    // Update lead status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('leads')
      .update({ status: 'meeting_scheduled' })
      .eq('id', lead.id);

    // Send email notification
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        await sendMeetingBookedEmail({
          userName: profile?.name || 'there',
          businessName: businessName,
          contactName: inviteeName,
          scheduledAt,
          duration,
          phone: inviteePhone,
          email: inviteeEmail
        });
        console.log('✅ Email notification sent to:', profile.email);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return NextResponse.json({
      success: true,
      meeting_id: meeting?.id,
      lead_id: lead.id,
      message: 'Calendly booking processed successfully'
    });

  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
