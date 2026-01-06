/**
 * POST /api/calendar/create-booking-my-business
 *
 * Creates a booking in Cal.com for the GreenLineAI business only.
 * Uses the CALENDLY_API_KEY environment variable directly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCalComBooking, formatSlotForDisplay } from '@/lib/cal-com';

const apiKey = process.env.CALENDLY_API_KEY;
const eventTypeId = process.env.CALENDLY_EVENT_TYPE_ID; // Set this in your env or hardcode
const timeZoneDefault = 'America/New_York';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const attendeeName = body.attendee_name || body.caller_name;
    const attendeePhone = body.attendee_phone || body.caller_phone;
    const attendeeEmail = body.attendee_email || body.caller_email;
    const startTime = body.start_time || body.datetime;
    const serviceType = body.service_type;
    const notes = body.notes;
    const timeZone = body.time_zone || timeZoneDefault;

    if (!apiKey || !eventTypeId) {
      return NextResponse.json({ success: false, error: 'Cal.com API key or event type ID not configured.' }, { status: 500 });
    }
    if (!attendeeName || !startTime) {
      return NextResponse.json({ success: false, error: 'attendee_name and start_time are required.' }, { status: 400 });
    }

    const bookingEmail = attendeeEmail || `${attendeePhone?.replace(/\D/g, '')}@placeholder.greenline-ai.com`;
    const bookingNotes = [
      serviceType ? `Service: ${serviceType}` : null,
      attendeePhone ? `Phone: ${attendeePhone}` : null,
      notes ? `Notes: ${notes}` : null,
      'Booked via GreenLine AI phone agent',
    ].filter(Boolean).join('\n');

    const booking = await createCalComBooking(
      apiKey,
      eventTypeId,
      {
        start: startTime,
        name: attendeeName,
        email: bookingEmail,
        phone: attendeePhone,
        notes: bookingNotes,
        timeZone,
        metadata: { source: 'greenline_ai_phone', service_type: serviceType },
      }
    );

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
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to create booking' }, { status: 500 });
  }
}
