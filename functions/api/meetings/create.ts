/**
 * Cloudflare Worker Function - Create Meeting
 * Path: /api/meetings/create
 *
 * Creates a new meeting record (requires authentication via cookie)
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Get auth token from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...val] = c.split('=');
        return [key, val.join('=')];
      })
    );

    // Try to get the auth token from various cookie formats
    const authToken = cookies['sb-access-token'] ||
                     cookies['sb-nggelyppkswqxycblvcb-auth-token'] ||
                     cookies['supabase-auth-token'];

    // Also check Authorization header
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    const token = bearerToken || authToken;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user with Supabase
    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await userResponse.json();

    const body = await request.json();
    const {
      lead_id,
      call_id,
      scheduled_at,
      duration = 15,
      meeting_type = 'strategy_call',
      location,
      notes
    } = body;

    // Validate required fields
    if (!lead_id || !scheduled_at) {
      return new Response(
        JSON.stringify({ error: 'lead_id and scheduled_at are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create meeting
    const meetingResponse = await fetch(
      `${supabaseUrl}/rest/v1/meetings`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          user_id: user.id,
          lead_id,
          call_id: call_id || null,
          scheduled_at,
          duration,
          meeting_type,
          location,
          notes,
          status: 'scheduled'
        }),
      }
    );

    if (!meetingResponse.ok) {
      const error = await meetingResponse.text();
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create meeting', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meetings = await meetingResponse.json();
    const meeting = meetings && meetings.length > 0 ? meetings[0] : null;

    // Update lead status to meeting_scheduled
    await fetch(
      `${supabaseUrl}/rest/v1/leads?id=eq.${lead_id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ status: 'meeting_scheduled' }),
      }
    );

    // If there's a call_id, mark that call as having a meeting booked
    if (call_id) {
      await fetch(
        `${supabaseUrl}/rest/v1/outreach_calls?id=eq.${call_id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ meeting_booked: true }),
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, meeting }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create meeting error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create meeting', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
