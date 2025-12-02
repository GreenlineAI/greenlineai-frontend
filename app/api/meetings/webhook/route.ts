import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendMeetingBookedEmail } from '@/lib/services/email';

/**
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
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Invalid event type' }, 
        { status: 400 }
      );
    }

    // Validate required fields
    if (!scheduled_at || (!lead_phone && !lead_email)) {
      return NextResponse.json(
        { error: 'scheduled_at and (lead_phone or lead_email) are required' }, 
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find the lead by phone or email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('leads')
      .select('id, user_id, business_name, contact_name, email, phone');
    
    if (lead_phone) {
      query = query.eq('phone', lead_phone);
    } else if (lead_email) {
      query = query.eq('email', lead_email);
    }

    const { data: leads, error: leadError } = await query.limit(1);

    if (leadError || !leads || leads.length === 0) {
      console.error('Lead not found:', { lead_phone, lead_email });
      return NextResponse.json(
        { error: 'Lead not found' }, 
        { status: 404 }
      );
    }

    const lead = leads[0];

    // Find the associated outreach call if external_call_id is provided
    let call_id = null;
    if (external_call_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: calls } = await (supabase as any)
        .from('outreach_calls')
        .select('id')
        .eq('vapi_call_id', external_call_id)
        .limit(1);
      
      if (calls && calls.length > 0) {
        call_id = calls[0].id;
      }
    }

    // Create the meeting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: meeting, error: meetingError } = await (supabase as any)
      .from('meetings')
      .insert({
        user_id: lead.user_id,
        lead_id: lead.id,
        call_id,
        scheduled_at,
        duration,
        meeting_type: 'strategy_call',
        notes,
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

    // Mark call as having booked meeting
    if (call_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('outreach_calls')
        .update({ meeting_booked: true })
        .eq('id', call_id);
    }

    // Send email notification to user
    try {
      // Get user email
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('email, name')
        .eq('id', lead.user_id)
        .single();

      if (profile?.email) {
        await sendMeetingBookedEmail({
          userName: profile?.name || 'there',
          businessName: lead.business_name,
          contactName: lead.contact_name || undefined,
          scheduledAt: scheduled_at,
          duration,
          phone: lead.phone,
          email: lead.email || undefined
        });
        console.log('✅ Email notification sent to:', profile?.email);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      meeting_id: meeting?.id,
      message: 'Meeting booked successfully'
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
