/**
 * POST /api/calendar/create-booking
 *
 * Creates a booking in Cal.com.
 * Called by the Retell AI agent during phone calls after the caller
 * confirms their appointment time.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  decryptApiKey,
  createCalComBooking,
  formatSlotForDisplay,
} from '@/lib/cal-com';

// Initialize Supabase client with service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract parameters - could come from Retell function call or direct API call
    const agentId = body.agent_id || body.args?.agent_id;
    const attendeeName = body.attendee_name || body.args?.attendee_name || body.args?.caller_name;
    const attendeePhone = body.attendee_phone || body.args?.attendee_phone || body.args?.caller_phone;
    const attendeeEmail = body.attendee_email || body.args?.attendee_email || body.args?.caller_email;
    const startTime = body.start_time || body.args?.start_time || body.args?.datetime;
    const serviceType = body.service_type || body.args?.service_type;
    const notes = body.notes || body.args?.notes;
    const timeZone = body.time_zone || body.args?.time_zone || 'America/New_York';

    // Validate required fields
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'agent_id is required' },
        { status: 400 }
      );
    }

    if (!attendeeName) {
      return NextResponse.json(
        { success: false, error: 'attendee_name is required' },
        { status: 400 }
      );
    }

    if (!startTime) {
      return NextResponse.json(
        { success: false, error: 'start_time is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the business by agent_id
    const { data: business, error: lookupError } = await supabase
      .from('business_onboarding')
      .select('id, user_id, cal_com_api_key_encrypted, cal_com_event_type_id, business_name, email')
      .eq('retell_agent_id', agentId)
      .single();

    if (lookupError || !business) {
      console.error('[Create Booking] Business lookup error:', lookupError);
      return NextResponse.json(
        {
          success: false,
          error: 'Business not found for this agent',
          fallback_message: "I'm sorry, I'm having trouble creating the booking. Let me take your information and have someone call you back to confirm.",
        },
        { status: 404 }
      );
    }

    // Check if Cal.com is configured
    if (!business.cal_com_api_key_encrypted || !business.cal_com_event_type_id) {
      console.log('[Create Booking] Cal.com not configured for business:', business.business_name);
      return NextResponse.json({
        success: false,
        calendar_configured: false,
        fallback_message: "I've noted your preferred time. Someone will call you back shortly to confirm the appointment.",
      });
    }

    // Decrypt the API key
    let apiKey: string;
    try {
      apiKey = decryptApiKey(business.cal_com_api_key_encrypted);
    } catch (decryptError) {
      console.error('[Create Booking] Decryption error:', decryptError);
      return NextResponse.json({
        success: false,
        error: 'Calendar configuration error',
        fallback_message: "I'm having trouble with the booking system. Let me note this down and have someone confirm your appointment shortly.",
      });
    }

    // Generate a placeholder email if none provided (Cal.com requires email)
    const bookingEmail = attendeeEmail || `${attendeePhone?.replace(/\D/g, '')}@placeholder.greenline-ai.com`;

    // Build notes for the booking
    const bookingNotes = [
      serviceType ? `Service: ${serviceType}` : null,
      attendeePhone ? `Phone: ${attendeePhone}` : null,
      notes ? `Notes: ${notes}` : null,
      'Booked via GreenLine AI phone agent',
    ]
      .filter(Boolean)
      .join('\n');

    // Create the booking in Cal.com
    const booking = await createCalComBooking(
      apiKey,
      business.cal_com_event_type_id,
      {
        start: startTime,
        name: attendeeName,
        email: bookingEmail,
        phone: attendeePhone,
        notes: bookingNotes,
        timeZone,
        metadata: {
          source: 'greenline_ai_phone',
          agent_id: agentId,
          service_type: serviceType,
        },
      }
    );

    // Also create a record in the meetings table if user_id is available
    if (business.user_id) {
      try {
        // First, try to find or create a lead for this caller
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('user_id', business.user_id)
          .eq('phone', attendeePhone || '')
          .single();

        let leadId = existingLead?.id;

        // If no existing lead, create one
        if (!leadId && attendeeName) {
          const { data: newLead } = await supabase
            .from('leads')
            .insert({
              user_id: business.user_id,
              business_name: attendeeName,
              phone: attendeePhone || '',
              city: '',
              state: '',
              industry: serviceType || 'service_request',
              status: 'meeting_scheduled',
              notes: `Booked via phone call. Service: ${serviceType || 'Not specified'}`,
            })
            .select('id')
            .single();
          leadId = newLead?.id;
        }

        // Create meeting record
        if (leadId) {
          await supabase.from('meetings').insert({
            user_id: business.user_id,
            lead_id: leadId,
            scheduled_at: startTime,
            duration: 30, // Default duration
            meeting_type: serviceType || 'service_appointment',
            notes: bookingNotes,
            status: 'scheduled',
          });
        }
      } catch (meetingError) {
        // Log but don't fail - Cal.com booking succeeded
        console.error('[Create Booking] Meeting record creation error:', meetingError);
      }
    }

    const displayTime = formatSlotForDisplay(startTime, timeZone);

    return NextResponse.json({
      success: true,
      booking_id: String(booking.id),
      booking_uid: booking.uid,
      datetime: startTime,
      display_time: displayTime,
      confirmation_message: `Your appointment is confirmed for ${displayTime}. You should receive a confirmation email shortly. Is there anything else I can help you with?`,
    });
  } catch (error) {
    console.error('[Create Booking] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking',
        fallback_message: "I'm sorry, I couldn't complete the booking right now. Let me take your information and have someone call you back to confirm your appointment.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/calendar/create-booking',
    method: 'POST',
    description: 'Create a booking in Cal.com (called by Retell AI agent)',
    parameters: {
      agent_id: 'Required - Retell agent ID to look up business',
      attendee_name: 'Required - Name of the person booking',
      start_time: 'Required - ISO datetime for the appointment',
      attendee_phone: 'Optional - Phone number of the attendee',
      attendee_email: 'Optional - Email of the attendee',
      service_type: 'Optional - Type of service requested',
      notes: 'Optional - Additional notes',
      time_zone: 'Optional - timezone (default: America/New_York)',
    },
  });
}
