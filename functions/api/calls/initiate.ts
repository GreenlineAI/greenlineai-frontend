/**
 * Cloudflare Worker Function - Initiate Retell AI Call
 * Path: /api/calls/initiate
 */

interface Env {
  VOICE_AI_PROVIDER: string;
  STAMMER_API_KEY: string;
  STAMMER_AGENT_ID?: string;
  RETELL_API_KEY: string;
  RETELL_AGENT_ID_1: string;
  RETELL_AGENT_ID_2: string;
}

interface CallRequest {
  phoneNumber: string;
  leadId?: string;
  campaignId?: string;
  prompt?: string;
  agentId?: 'agent1' | 'agent2'; // Select which agent to use
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Get the voice provider
    const providerType = (env.VOICE_AI_PROVIDER || 'stammer') as string;
    
    // Check if API key is configured
    let apiKey = '';
    if (providerType === 'stammer') {
      apiKey = env.STAMMER_API_KEY;
    } else if (providerType === 'retell') {
      apiKey = env.RETELL_API_KEY;
    }
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return new Response(
        JSON.stringify({
          error: 'Voice AI not configured',
          details: `Please add ${providerType.toUpperCase()}_API_KEY to your Cloudflare Pages environment variables.`,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: CallRequest = await request.json();
    const { phoneNumber, leadId, campaignId, prompt, agentId = 'agent1' } = body;

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Route to appropriate provider
    if (providerType === 'stammer') {
      // Initiate call with Stammer AI
      // API Docs: https://app.stammer.ai/en/api-docs/me/
      const stammerResponse = await fetch('https://app.stammer.ai/en/chatbot/api/v1/call/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${env.STAMMER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          chatbot_uuid: env.STAMMER_AGENT_ID,
          user_key: leadId || `lead_${Date.now()}`,
          metadata: {
            leadId: leadId || '',
            campaignId: campaignId || '',
            source: 'greenline-dialer',
            calendlyUrl: 'https://calendly.com/greenlineai',
          },
        }),
      });

      if (!stammerResponse.ok) {
        const errorData = await stammerResponse.text();
        console.error('Stammer API error:', {
          status: stammerResponse.status,
          statusText: stammerResponse.statusText,
          error: errorData,
          url: 'https://app.stammer.ai/en/chatbot/api/v1/call/',
          chatbot_uuid: env.STAMMER_AGENT_ID,
        });
        throw new Error(`Stammer API error (${stammerResponse.status}): ${errorData || stammerResponse.statusText}`);
      }

      const data = await stammerResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          callId: data.call_id,
          status: data.status || 'queued',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (providerType === 'retell') {
      // Select which agent to use
      const selectedAgentId = agentId === 'agent2' ? env.RETELL_AGENT_ID_2 : env.RETELL_AGENT_ID_1;
      
      // Initiate call with Retell AI
      const retellResponse = await fetch('https://api.retellai.com/v2/create-phone-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_number: null, // Retell will use their number
          to_number: phoneNumber,
          agent_id: selectedAgentId,
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

function getAppointmentSettingPrompt(): string {
  return `You are a professional AI assistant calling on behalf of GreenLine AI, a marketing agency specializing in lead generation for home services businesses.

Your goal for this call:
1. Introduce yourself warmly and professionally
2. Check if now is a good time to talk (if not, offer to call back)
3. Verify you're speaking with the business owner or decision maker
4. Ask about their current marketing and lead generation situation
5. If they're interested in improving their lead flow, offer to book a brief 15-minute strategy call
6. If interested, send them the Calendly link via text: https://calendly.com/greenlineai
7. If not interested now, politely offer to follow up in a few months

Key points:
- Be conversational and natural, not scripted
- Respect their time - keep it brief (2-4 minutes max)
- Listen for pain points around lead quality, lead volume, or marketing costs
- Value proposition: We help home services businesses 2-3x their qualified leads using AI-powered outreach
- If they book a meeting, that's a success
- If they request a callback or follow-up, that's also a win

Remember: You're setting appointments, not closing deals on the phone. Be helpful, not pushy.`;
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
