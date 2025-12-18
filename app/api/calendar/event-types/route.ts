/**
 * GET /api/calendar/event-types
 *
 * Fetches event types from Cal.com for a given API key.
 * Used to populate the event type dropdown in the onboarding form.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCalComEventTypes } from '@/lib/cal-com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Fetch event types from Cal.com
    const eventTypes = await getCalComEventTypes(apiKey);

    // Map to a simpler format for the frontend
    const formattedEventTypes = eventTypes.map((et) => ({
      id: String(et.id),
      title: et.title,
      slug: et.slug,
      length: et.length,
      description: et.description,
    }));

    return NextResponse.json({
      eventTypes: formattedEventTypes,
    });
  } catch (error) {
    console.error('[Calendar Event Types] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch event types',
      },
      { status: 500 }
    );
  }
}
