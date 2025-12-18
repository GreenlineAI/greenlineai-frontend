/**
 * POST /api/calendar/check-availability
 *
 * Checks calendar availability via Cal.com API.
 * Called by the Retell AI agent during phone calls.
 *
 * Looks up the business by agent_id, retrieves their Cal.com credentials,
 * and returns available time slots.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  decryptApiKey,
  getCalComAvailability,
  getDateRange,
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
    const dateRange = body.date_range || body.args?.date_range || 'next_7_days';
    const preferredDate = body.preferred_date || body.args?.preferred_date;
    const timeZone = body.time_zone || body.args?.time_zone || 'America/New_York';

    if (!agentId) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the business by agent_id
    const { data: business, error: lookupError } = await supabase
      .from('business_onboarding')
      .select('cal_com_api_key_encrypted, cal_com_event_type_id, cal_com_validated, business_name')
      .eq('retell_agent_id', agentId)
      .single();

    if (lookupError || !business) {
      console.error('[Check Availability] Business lookup error:', lookupError);
      return NextResponse.json(
        {
          available: false,
          error: 'Business not found for this agent',
          fallback_message: "I'm sorry, I'm having trouble accessing the calendar right now. Let me take your information and have someone call you back to schedule.",
        },
        { status: 404 }
      );
    }

    // Check if Cal.com is configured
    if (!business.cal_com_api_key_encrypted || !business.cal_com_event_type_id) {
      console.log('[Check Availability] Cal.com not configured for business:', business.business_name);
      return NextResponse.json({
        available: false,
        calendar_configured: false,
        fallback_message: "I don't have direct access to the calendar right now, but I can take your information and have someone call you back to schedule. Would that work?",
      });
    }

    // Decrypt the API key
    let apiKey: string;
    try {
      apiKey = decryptApiKey(business.cal_com_api_key_encrypted);
    } catch (decryptError) {
      console.error('[Check Availability] Decryption error:', decryptError);
      return NextResponse.json({
        available: false,
        error: 'Calendar configuration error',
        fallback_message: "I'm having trouble accessing the calendar. Let me take your information for a callback.",
      });
    }

    // Get date range for availability check
    const { startTime, endTime } = preferredDate
      ? { startTime: preferredDate, endTime: new Date(new Date(preferredDate).getTime() + 24 * 60 * 60 * 1000).toISOString() }
      : getDateRange(dateRange);

    // Fetch availability from Cal.com
    const slots = await getCalComAvailability(
      apiKey,
      business.cal_com_event_type_id,
      startTime,
      endTime,
      timeZone
    );

    if (slots.length === 0) {
      return NextResponse.json({
        available: false,
        slots: [],
        message: "I don't see any available slots in that timeframe. Would you like me to check a different time, or should I take your information for a callback?",
      });
    }

    // Format slots for display
    const formattedSlots = slots.slice(0, 5).map((slot) => ({
      datetime: slot.time,
      display: formatSlotForDisplay(slot.time, timeZone),
    }));

    // Build a natural language response for the AI
    const slotDescriptions = formattedSlots.map((s) => s.display).join(', ');

    return NextResponse.json({
      available: true,
      slots: formattedSlots,
      total_slots: slots.length,
      message: `I have some availability. Here are some options: ${slotDescriptions}. Which of these works best for you?`,
      next_available: formattedSlots[0]?.display,
    });
  } catch (error) {
    console.error('[Check Availability] Error:', error);
    return NextResponse.json(
      {
        available: false,
        error: error instanceof Error ? error.message : 'Failed to check availability',
        fallback_message: "I'm sorry, I'm having trouble with the calendar system right now. Can I take your information and have someone call you back to schedule?",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/calendar/check-availability',
    method: 'POST',
    description: 'Check calendar availability for a business (called by Retell AI agent)',
    parameters: {
      agent_id: 'Required - Retell agent ID to look up business',
      date_range: 'Optional - today, tomorrow, this_week, next_week, next_7_days (default)',
      preferred_date: 'Optional - specific ISO date to check',
      time_zone: 'Optional - timezone (default: America/New_York)',
    },
  });
}
