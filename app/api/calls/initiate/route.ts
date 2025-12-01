import { NextRequest, NextResponse } from 'next/server';
import { getVoiceProvider } from '@/lib/services/voice-calling';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.VOICE_AI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { 
          error: 'Voice AI not configured',
          details: 'Please add VOICE_AI_API_KEY to your .env.local file. See docs/VOICE-CALLING-SETUP.md for instructions.',
          setupUrl: '/docs/VOICE-CALLING-SETUP.md'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { phoneNumber, leadId, campaignId, prompt } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Get the voice provider (Retell AI)
    const providerType = (process.env.VOICE_AI_PROVIDER || 'retell') as 'bland' | 'stammer' | 'retell';
    const provider = getVoiceProvider(providerType);

    // Initiate the call
    const result = await provider.initiateCall({
      phoneNumber,
      agentId: process.env.RETELL_AGENT_ID || undefined,
      prompt: prompt || getDefaultPrompt(),
      metadata: {
        leadId,
        campaignId,
        source: 'greenline-dialer',
      },
    });

    return NextResponse.json({
      success: true,
      callId: result.callId,
      status: result.status,
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
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
