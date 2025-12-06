/**
 * Voice AI Calling Service
 * Provider: Retell AI
 */

export interface CallRequest {
  phoneNumber: string;
  agentId?: string;
  fromNumber?: string;
  metadata?: Record<string, unknown>;
  retellLlmDynamicVariables?: Record<string, string>;
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
        from_number: request.fromNumber || process.env.RETELL_FROM_NUMBER,
        to_number: request.phoneNumber,
        agent_id: request.agentId || process.env.RETELL_AGENT_ID,
        metadata: request.metadata,
        retell_llm_dynamic_variables: request.retellLlmDynamicVariables,
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

  async listCalls(limit = 50): Promise<CallWebhook[]> {
    const response = await fetch(`${this.baseUrl}/list-calls?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list calls: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((call: Record<string, unknown>) => ({
      callId: call.call_id,
      status: mapRetellStatus(call.call_status as string),
      duration: (call.call_analysis as Record<string, unknown>)?.call_duration,
      transcript: call.transcript,
      recording_url: call.recording_url,
      metadata: call.metadata,
    }));
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
 * Get Retell AI instance
 */
export function getVoiceProvider(): RetellAI {
  const apiKey = process.env.RETELL_API_KEY || '';
  if (!apiKey) {
    throw new Error('RETELL_API_KEY environment variable is not set');
  }
  return new RetellAI(apiKey);
}
