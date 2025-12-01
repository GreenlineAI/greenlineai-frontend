/**
 * Voice AI Calling Service
 * Supports multiple providers: Stammer AI, Bland AI, Retell AI
 */

export type VoiceProvider = 'stammer' | 'bland' | 'retell' | 'vapi';

export interface CallRequest {
  phoneNumber: string;
  agentId?: string;
  prompt?: string;
  voiceId?: string;
  metadata?: Record<string, unknown>;
}

export interface CallResponse {
  callId: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

export interface CallWebhook {
  callId: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'no_answer' | 'voicemail' | 'failed';
  duration?: number;
  transcript?: string;
  recording_url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Stammer AI Integration
 */
export class StammerAI {
  private apiKey: string;
  private baseUrl = 'https://api.stammer.ai/v1'; // Update with actual Stammer AI URL

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initiateCall(request: CallRequest): Promise<CallResponse> {
    const response = await fetch(`${this.baseUrl}/calls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: request.phoneNumber,
        agent_id: request.agentId,
        voice_id: request.voiceId,
        prompt: request.prompt,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stammer AI error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      callId: data.call_id,
      status: data.status,
      message: data.message,
    };
  }

  async getCallStatus(callId: string): Promise<CallWebhook> {
    const response = await fetch(`${this.baseUrl}/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * Bland AI Integration
 */
export class BlandAI {
  private apiKey: string;
  private baseUrl = 'https://api.bland.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initiateCall(request: CallRequest): Promise<CallResponse> {
    const response = await fetch(`${this.baseUrl}/calls`, {
      method: 'POST',
      headers: {
        'authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: request.phoneNumber,
        task: request.prompt || 'Have a conversation with the prospect',
        voice: request.voiceId || 'maya',
        wait_for_greeting: true,
        record: true,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bland AI error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      callId: data.call_id,
      status: data.status,
    };
  }

  async getCallStatus(callId: string): Promise<CallWebhook> {
    const response = await fetch(`${this.baseUrl}/calls/${callId}`, {
      headers: {
        'authorization': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      callId: data.call_id,
      status: data.status,
      duration: data.call_length,
      transcript: data.concatenated_transcript,
      recording_url: data.recording_url,
    };
  }
}

/**
 * Retell AI Integration
 */
export class RetellAI {
  private apiKey: string;
  private baseUrl = 'https://api.retellai.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initiateCall(request: CallRequest): Promise<CallResponse> {
    const response = await fetch(`${this.baseUrl}/create-phone-call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_number: process.env.VOICE_AI_PHONE_NUMBER,
        to_number: request.phoneNumber,
        agent_id: request.agentId,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Retell AI error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      callId: data.call_id,
      status: 'queued',
    };
  }

  async getCallStatus(callId: string): Promise<CallWebhook> {
    const response = await fetch(`${this.baseUrl}/get-call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      callId: data.call_id,
      status: mapRetellStatus(data.call_status),
      duration: data.call_analysis?.call_duration,
      transcript: data.transcript,
      recording_url: data.recording_url,
      metadata: data.metadata,
    };
  }
}

function mapRetellStatus(status: string): CallWebhook['status'] {
  const statusMap: Record<string, CallWebhook['status']> = {
    'registered': 'queued',
    'ongoing': 'in_progress',
    'ended': 'completed',
    'error': 'failed',
  };
  return statusMap[status] || 'queued';
}

/**
 * Factory to get the right provider
 */
export function getVoiceProvider(provider: VoiceProvider = 'retell'): StammerAI | BlandAI | RetellAI {
  const apiKey = process.env.VOICE_AI_API_KEY || '';
  
  switch (provider) {
    case 'stammer':
      return new StammerAI(apiKey);
    case 'bland':
      return new BlandAI(apiKey);
    case 'retell':
      return new RetellAI(apiKey);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
