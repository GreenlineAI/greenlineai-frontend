/**
 * Cloudflare Worker Function - Initiate Retell AI Call
 * Path: /api/calls/initiate
 */

interface Env {
  VOICE_AI_PROVIDER: string;
  VOICE_AI_API_KEY: string;
  RETELL_AGENT_ID: string;
}

interface CallRequest {
  phoneNumber: string;
  leadId?: string;
  campaignId?: string;
  prompt?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Check if API key is configured
    const apiKey = env.VOICE_AI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return new Response(
        JSON.stringify({
          error: 'Voice AI not configured',
          details: 'Please add VOICE_AI_API_KEY to your Cloudflare Pages environment variables.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: CallRequest = await request.json();
    const { phoneNumber, leadId, campaignId, prompt } = body;

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the voice provider (Retell AI)
    const providerType = (env.VOICE_AI_PROVIDER || 'retell') as string;
    
    if (providerType === 'retell') {
      // Initiate call with Retell AI
      const retellResponse = await fetch('https://api.retellai.com/v2/create-phone-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_number: null, // Retell will use their number
          to_number: phoneNumber,
          agent_id: env.RETELL_AGENT_ID,
          metadata: {
            leadId: leadId || '',
            campaignId: campaignId || '',
            source: 'greenline-dialer',
          },
          retell_llm_dynamic_variables: {
            business_context: prompt || getDefaultPrompt(),
          },
        }),
      });

      if (!retellResponse.ok) {
        const errorData = await retellResponse.text();
        console.error('Retell API error:', errorData);
        throw new Error(`Retell API error: ${retellResponse.statusText}`);
      }

      const data = await retellResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          callId: data.call_id,
          status: data.call_status || 'registered',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported voice provider', provider: providerType }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error initiating call:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to initiate call',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function getDefaultPrompt(): string {
  return `You are an AI sales assistant calling on behalf of a marketing agency. 
Your goal is to:
1. Introduce yourself professionally
2. Verify you're speaking with the business owner or decision maker
3. Ask if they're currently happy with their lead generation
4. If interested, offer to schedule a brief strategy call
5. If not interested, politely thank them and end the call

Be natural, conversational, and respectful of their time.`;
}
