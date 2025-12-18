/**
 * Next.js API Route - Create Meeting
 * Path: /api/meetings/create
 *
 * Creates a new meeting record (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user with Supabase
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      return NextResponse.json(
        { error: 'lead_id and scheduled_at are required' },
        { status: 400 }
      );
    }

    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        user_id: user.id,
        lead_id,
        call_id: call_id || null,
        scheduled_at,
        duration,
        meeting_type,
        location,
        notes,
        status: 'scheduled'
      })
      .select()
      .single();

    if (meetingError) {
      console.error('[Create Meeting] Error:', meetingError);
      return NextResponse.json(
        { error: 'Failed to create meeting', details: meetingError.message },
        { status: 500 }
      );
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'meeting_scheduled' })
      .eq('id', lead_id);

    // Mark call as having meeting booked
    if (call_id) {
      await supabase
        .from('outreach_calls')
        .update({ meeting_booked: true })
        .eq('id', call_id);
    }

    return NextResponse.json({ success: true, meeting });

  } catch (error) {
    console.error('[Create Meeting] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting', details: String(error) },
      { status: 500 }
    );
  }
}
