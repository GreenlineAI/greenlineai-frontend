import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CallRequest {
  phoneNumber: string;
  leadId?: string;
  campaignId?: string;
  prompt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CallRequest = await request.json();
    const { phoneNumber, leadId, campaignId, prompt } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Get environment variables
    const providerType = process.env.VOICE_AI_PROVIDER || 'stammer';
    const stammerApiKey = process.env.STAMMER_API_KEY;
    const stammerAgentId = process.env.STAMMER_AGENT_ID;

    if (!stammerApiKey || stammerApiKey === 'your_api_key_here') {
      return NextResponse.json({
        error: 'Voice AI not configured',
        details: 'Please add STAMMER_API_KEY to your environment variables.',
      }, { status: 503 });
    }

    if (providerType === 'stammer') {
      // Initiate call with Stammer AI
      // API Docs: https://app.stammer.ai/en/api-docs/me/
      const stammerResponse = await fetch('https://app.stammer.ai/en/chatbot/api/v1/call/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${stammerApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          chatbot_uuid: stammerAgentId,
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
          chatbot_uuid: stammerAgentId,
        });
        
        return NextResponse.json({
          error: `Stammer API error (${stammerResponse.status})`,
          details: errorData || stammerResponse.statusText,
          success: false,
        }, { status: stammerResponse.status });
      }

      const data = await stammerResponse.json();

      return NextResponse.json({
        success: true,
        callId: data.call_id,
        status: data.status || 'queued',
      });
    }

    return NextResponse.json({ 
      error: 'Unsupported voice provider', 
      provider: providerType 
    }, { status: 400 });

  } catch (error) {
    console.error('Call initiation error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate call', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }, { status: 500 });
  }
}
