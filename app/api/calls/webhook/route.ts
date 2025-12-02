import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Webhook from Stammer AI when call status changes
    const body = await request.json();
    
    console.log('Stammer webhook received:', body);

    // Get call by vapi_call_id
    const supabase = await createClient();
    
    const { data: call } = await supabase
      .from('calls')
      .select('*')
      .eq('vapi_call_id', body.call_id)
      .single();

    if (!call) {
      console.warn('Call not found for webhook:', body.call_id);
      return NextResponse.json({ received: true });
    }

    // Map Stammer status to our status
    let status = call.status;
    let disposition = call.disposition;
    
    if (body.status === 'completed' || body.status === 'ended') {
      status = 'completed';
      // You can set disposition based on additional webhook data
      if (body.answered) {
        disposition = 'answered';
      } else {
        disposition = 'no_answer';
      }
    } else if (body.status === 'failed') {
      status = 'failed';
      disposition = 'failed';
    }

    // Update call record
    await supabase
      .from('calls')
      .update({
        status,
        disposition,
        duration: body.duration || call.duration,
        transcript: body.transcript || call.transcript,
        recording_url: body.recording_url || call.recording_url,
        ended_at: body.ended_at || new Date().toISOString(),
      })
      .eq('id', call.id);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
