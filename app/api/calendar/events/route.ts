import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use type assertion since integrations table is new
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrationsTable = supabase.from('integrations') as any;

    // Get Google Calendar integration
    const { data: integration, error: integrationError } = await integrationsTable
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google_calendar')
      .single();

    if (integrationError || !integration) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 404 });
    }

    let accessToken = integration.access_token;

    // Check if token is expired and refresh if needed
    if (new Date(integration.token_expires_at) < new Date()) {
      if (!integration.refresh_token) {
        return NextResponse.json({ error: 'Token expired and no refresh token' }, { status: 401 });
      }

      const newTokens = await refreshAccessToken(integration.refresh_token);
      if (!newTokens) {
        // Token refresh failed, need to reconnect
        await integrationsTable
          .delete()
          .eq('id', integration.id);
        return NextResponse.json({ error: 'Token refresh failed, please reconnect' }, { status: 401 });
      }

      // Update tokens in database
      accessToken = newTokens.access_token;
      await integrationsTable
        .update({
          access_token: newTokens.access_token,
          token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
        })
        .eq('id', integration.id);
    }

    // Get query params for date range
    const searchParams = request.nextUrl.searchParams;
    const timeMin = searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const maxResults = searchParams.get('maxResults') || '50';

    // Fetch calendar events from Google
    const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
    calendarUrl.searchParams.set('timeMin', timeMin);
    calendarUrl.searchParams.set('timeMax', timeMax);
    calendarUrl.searchParams.set('maxResults', maxResults);
    calendarUrl.searchParams.set('singleEvents', 'true');
    calendarUrl.searchParams.set('orderBy', 'startTime');

    const calendarResponse = await fetch(calendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.text();
      console.error('Calendar API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
    }

    const calendarData = await calendarResponse.json();

    return NextResponse.json({
      events: calendarData.items || [],
      nextPageToken: calendarData.nextPageToken,
    });
  } catch (error) {
    console.error('Calendar events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a calendar event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use type assertion since integrations table is new
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrationsTable = supabase.from('integrations') as any;

    // Get Google Calendar integration
    const { data: integration, error: integrationError } = await integrationsTable
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google_calendar')
      .single();

    if (integrationError || !integration) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 404 });
    }

    let accessToken = integration.access_token;

    // Check if token is expired and refresh if needed
    if (new Date(integration.token_expires_at) < new Date()) {
      if (!integration.refresh_token) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }

      const newTokens = await refreshAccessToken(integration.refresh_token);
      if (!newTokens) {
        return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
      }

      accessToken = newTokens.access_token;
      await integrationsTable
        .update({
          access_token: newTokens.access_token,
          token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
        })
        .eq('id', integration.id);
    }

    const body = await request.json();

    // Create event in Google Calendar
    const createResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: body.summary,
        description: body.description,
        start: body.start,
        end: body.end,
        attendees: body.attendees,
        reminders: body.reminders || {
          useDefault: true,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error('Create event error:', errorData);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    const event = await createResponse.json();

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
