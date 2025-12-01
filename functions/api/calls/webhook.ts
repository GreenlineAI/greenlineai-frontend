/**
 * Cloudflare Worker Function - Retell AI Webhook
 * Path: /api/calls/webhook
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

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

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const webhook: RetellWebhook = await request.json();
    
    console.log('Received Retell AI webhook:', webhook);

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
    let duration = null;
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

    // Update call in Supabase
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && call.metadata?.leadId) {
      // First, try to find the call by vapi_call_id
      const findResponse = await fetch(
        `${supabaseUrl}/rest/v1/outreach_calls?vapi_call_id=eq.${call.call_id}&select=id`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (findResponse.ok) {
        const existingCalls = await findResponse.json();
        
        if (existingCalls && existingCalls.length > 0) {
          // Update existing call
          const callId = existingCalls[0].id;
          await fetch(
            `${supabaseUrl}/rest/v1/outreach_calls?id=eq.${callId}`,
            {
              method: 'PATCH',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({
                status: mappedStatus,
                duration: duration,
                transcript: transcript,
                recording_url: call.recording_url,
                updated_at: new Date().toISOString(),
              }),
            }
          );
        }
      }

      // Also update the lead's last_contacted timestamp
      if (event === 'call_ended' || event === 'call_analyzed') {
        await fetch(
          `${supabaseUrl}/rest/v1/leads?id=eq.${call.metadata.leadId}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              last_contacted: new Date().toISOString(),
              status: 'contacted',
            }),
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
