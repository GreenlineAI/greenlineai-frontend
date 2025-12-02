import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: callId } = await params;

    // Get call from database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: call, error } = await (supabase as any)
      .from('calls')
      .select('*')
      .eq('id', callId)
      .single();

    if (error || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // If call has a vapi_call_id, we could check Stammer API for live status
    // For now, return the database status
    return NextResponse.json({
      id: call.id,
      status: call.status,
      duration: call.duration,
      disposition: call.disposition,
      transcript: call.transcript,
      recording_url: call.recording_url,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ 
      error: 'Failed to get call status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
