/**
 * Cloudflare Worker Function - Get Call Status
 * Path: /api/calls/[id]/status
 */

interface Env {
  VOICE_AI_API_KEY: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export async function onRequestGet(context: { request: Request; env: Env; params: { id: string } }) {
  const { env, params } = context;

  try {
    const callId = params.id;

    // Try to get call status from Supabase first
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabaseResponse = await fetch(
        `${supabaseUrl}/rest/v1/outreach_calls?id=eq.${callId}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (supabaseResponse.ok) {
        const data = await supabaseResponse.json();
        if (data && data.length > 0) {
          const call = data[0];
          return new Response(
            JSON.stringify({
              id: call.id,
              status: call.status,
              duration: call.duration,
              transcript: call.transcript,
              recording_url: call.recording_url,
              meeting_booked: call.meeting_booked,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // If not in Supabase, try to get from Retell AI
    const apiKey = env.VOICE_AI_API_KEY;
    if (apiKey) {
      const retellResponse = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (retellResponse.ok) {
        const retellData = await retellResponse.json();
        return new Response(
          JSON.stringify({
            id: retellData.call_id,
            status: retellData.call_status,
            duration: retellData.end_timestamp 
              ? Math.floor((retellData.end_timestamp - retellData.start_timestamp) / 1000)
              : null,
            transcript: retellData.transcript || null,
            recording_url: retellData.recording_url || null,
            meeting_booked: false,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Call not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching call status:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch call status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
