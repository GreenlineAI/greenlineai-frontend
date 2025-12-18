/**
 * Next.js API Route - Outbound Calls Webhook
 * Path: /api/calls/webhook
 *
 * Handles webhooks from Retell AI for OUTBOUND calls (auto-dialer, campaigns)
 * Updates call status, transcript, and lead info in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RetellWebhook {
  event: string;
  call: {
    call_id: string;
    agent_id: string;
    call_status: string;
    call_type: string;
    start_timestamp?: number;
    end_timestamp?: number;
    transcript?: string;
    transcript_object?: Array<{
      role: string;
      content: string;
      timestamp: number;
    }>;
    recording_url?: string;
    public_log_url?: string;
    metadata?: {
      leadId?: string;
      campaignId?: string;
      source?: string;
    };
  };
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    const webhook: RetellWebhook = await request.json();

    console.log('[Calls Webhook] Event:', webhook.event, 'Call:', webhook.call.call_id);

    const { event, call } = webhook;

    // Map Retell call status to our status
    const statusMap: Record<string, string> = {
      'registered': 'pending',
      'ongoing': 'in_progress',
      'ended': 'completed',
      'error': 'failed',
    };

    const mappedStatus = statusMap[call.call_status] || call.call_status;

    // Calculate duration if available
    let duration: number | null = null;
    if (call.end_timestamp && call.start_timestamp) {
      duration = Math.floor((call.end_timestamp - call.start_timestamp) / 1000);
    }

    // Format transcript
    let transcript = call.transcript || '';
    if (call.transcript_object && call.transcript_object.length > 0) {
      transcript = call.transcript_object
        .map(t => `${t.role}: ${t.content}`)
        .join('\n');
    }

    // Find and update the call record
    const { data: existingCalls } = await supabase
      .from('outreach_calls')
      .select('id')
      .eq('vapi_call_id', call.call_id)
      .limit(1);

    if (existingCalls && existingCalls.length > 0) {
      const callId = existingCalls[0].id;

      await supabase
        .from('outreach_calls')
        .update({
          status: mappedStatus,
          duration,
          transcript,
          recording_url: call.recording_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', callId);

      console.log(`[Calls Webhook] Updated call ${callId}`);
    }

    // Update lead's last_contacted timestamp
    if (call.metadata?.leadId && (event === 'call_ended' || event === 'call_analyzed')) {
      await supabase
        .from('leads')
        .update({
          last_contacted: new Date().toISOString(),
          status: 'contacted',
        })
        .eq('id', call.metadata.leadId);

      console.log(`[Calls Webhook] Updated lead ${call.metadata.leadId}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('[Calls Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/calls/webhook',
    description: 'POST Retell AI outbound call webhooks here'
  });
}
