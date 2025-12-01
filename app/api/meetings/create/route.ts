import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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
    const { data: meeting, error } = await supabase
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
      .select(`
        *,
        lead:leads(
          business_name,
          contact_name,
          email,
          phone
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create meeting', details: error.message }, 
        { status: 500 }
      );
    }

    // Update lead status to meeting_scheduled
    await supabase
      .from('leads')
      .update({ status: 'meeting_scheduled' })
      .eq('id', lead_id);

    // If there's a call_id, mark that call as having a meeting booked
    if (call_id) {
      await supabase
        .from('outreach_calls')
        .update({ meeting_booked: true })
        .eq('id', call_id);
    }

    return NextResponse.json({ 
      success: true, 
      meeting 
    });

  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
