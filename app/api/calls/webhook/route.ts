import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const webhook = await request.json();
    
    console.log('Received Retell AI webhook:', webhook);

    // Retell AI webhook format
    const {
      event,
      call,
    } = webhook;

    const {
      call_id,
      call_status,
      start_timestamp,
      end_timestamp,
      transcript,
      recording_url,
      call_analysis,
      metadata,
    } = call || {};

    if (!call_id) {
      console.error('No call_id in webhook');
      return NextResponse.json({ error: 'Missing call_id' }, { status: 400 });
    }

    // Find the call record in database
    const { data: dbCall, error: findError } = await supabase
      .from('outreach_calls')
      .select('*')
      .eq('vapi_call_id', call_id)
      .single();

    if (findError || !dbCall) {
      console.error('Call not found:', call_id);
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Calculate duration
    let duration = null;
    if (start_timestamp && end_timestamp) {
      duration = Math.floor((end_timestamp - start_timestamp) / 1000);
    } else if (call_analysis?.call_duration) {
      duration = Math.floor(call_analysis.call_duration);
    }

    // Map Retell status to our status
    const mappedStatus = mapCallStatus(call_status);

    // Extract sentiment from call analysis
    let sentiment = null;
    if (call_analysis?.user_sentiment) {
      sentiment = call_analysis.user_sentiment.toLowerCase();
    }

    // Check if meeting was booked (look for keywords in transcript)
    const meetingBooked = transcript ? 
      /schedule|book|calendar|meeting|appointment|yes.*time|sounds good/i.test(transcript) : 
      false;

    // Update the call record
    const { error: updateError } = await supabase
      .from('outreach_calls')
      .update({
        status: mappedStatus,
        duration: duration || null,
        transcript: transcript || null,
        recording_url: recording_url || null,
        sentiment: sentiment || null,
        meeting_booked: meetingBooked,
        summary: call_analysis?.call_summary || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbCall.id);

    if (updateError) {
      console.error('Error updating call:', updateError);
      return NextResponse.json({ error: 'Failed to update call' }, { status: 500 });
    }

    // Update lead based on call outcome
    if (metadata?.leadId || dbCall.lead_id) {
      await updateLeadFromCall(
        metadata?.leadId || dbCall.lead_id, 
        mappedStatus, 
        transcript,
        meetingBooked,
        sentiment
      );
    }

    console.log(`Call ${call_id} updated: status=${mappedStatus}, duration=${duration}s, meeting=${meetingBooked}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function mapCallStatus(providerStatus: string): string {
  const statusMap: Record<string, string> = {
    'registered': 'pending',
    'ongoing': 'in_progress',
    'ended': 'completed',
    'error': 'failed',
    'queued': 'pending',
    'ringing': 'pending',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'no_answer': 'no_answer',
    'voicemail': 'voicemail',
    'failed': 'failed',
    'busy': 'no_answer',
  };

  return statusMap[providerStatus] || 'completed';
}

async function updateLeadFromCall(
  leadId: string, 
  status: string, 
  transcript: string | null,
  meetingBooked: boolean = false,
  sentiment: string | null = null
) {
  // Analyze transcript for positive signals
  const isPositive = sentiment === 'positive' || (transcript ? 
    /interested|yes|sounds good|tell me more|schedule|book/i.test(transcript) : 
    false);

  const updates: Record<string, unknown> = {
    last_contact: new Date().toISOString(),
  };

  if (meetingBooked) {
    updates.status = 'meeting_scheduled';
  } else if (isPositive && status === 'completed') {
    updates.status = 'interested';
  } else if (status === 'completed') {
    updates.status = 'contacted';
  } else if (status === 'no_answer') {
    updates.status = 'no_answer';
  }

  await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId);
}
