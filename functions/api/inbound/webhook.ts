/**
 * Cloudflare Worker Function - Inbound Call Webhook
 * Path: /api/inbound/webhook
 *
 * Handles webhooks from Retell AI inbound agents (created by flow-builder)
 * - Customer service agents for GreenLine AI clients
 * - GreenLine AI sales agent (Jordan)
 *
 * Integrates with existing Supabase CRM system
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

// Retell webhook event types
type RetellEvent =
  | 'call_started'
  | 'call_ended'
  | 'call_analyzed'
  | 'function_call';

interface RetellInboundWebhook {
  event: RetellEvent;
  call_id: string;
  agent_id: string;
  call_status: string;
  direction: 'inbound' | 'outbound';
  from_number?: string;
  to_number?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  transcript?: string;
  transcript_object?: Array<{
    role: 'agent' | 'user';
    content: string;
    timestamp: number;
  }>;
  recording_url?: string;
  public_log_url?: string;

  // Dynamic variables extracted during call
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: 'positive' | 'neutral' | 'negative';
    call_successful?: boolean;
    custom_analysis_data?: Record<string, unknown>;
  };

  // Variables extracted by extract_dynamic_variables nodes
  dynamic_variables?: {
    // Customer service agent variables
    caller_name?: string;
    caller_phone?: string;
    service_address?: string;
    service_type?: string;
    urgency?: string;
    message_name?: string;
    message_phone?: string;
    message_reason?: string;
    callback_time?: string;

    // GreenLine sales agent variables (Jordan)
    business_type?: string;
    business_name?: string;
    caller_email?: string;
    location?: string;
    call_volume?: string;
    current_situation?: string;
  };

  // Metadata passed when creating the call
  metadata?: {
    client_user_id?: string;      // The GreenLine AI customer's user ID
    agent_type?: 'customer_service' | 'greenline_sales';
    business_onboarding_id?: string;
  };
}

interface LeadInsert {
  user_id: string;
  contact_name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  status: 'new' | 'contacted' | 'interested' | 'meeting_scheduled';
  score: 'hot' | 'warm' | 'cold';
  notes?: string;
  last_contacted?: string;
}

interface InboundCallInsert {
  user_id: string;
  call_id: string;
  agent_id: string;
  direction: 'inbound';
  from_number?: string;
  to_number?: string;
  status: string;
  duration?: number;
  transcript?: string;
  recording_url?: string;
  caller_name?: string;
  caller_phone?: string;
  service_requested?: string;
  urgency?: string;
  sentiment?: string;
  call_summary?: string;
  dynamic_variables?: Record<string, unknown>;
  created_at: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const webhook: RetellInboundWebhook = await request.json();

    console.log(`[Inbound Webhook] Event: ${webhook.event}, Call: ${webhook.call_id}`);

    // Handle different event types
    switch (webhook.event) {
      case 'call_started':
        await handleCallStarted(webhook, supabaseUrl, supabaseKey);
        break;

      case 'call_ended':
      case 'call_analyzed':
        await handleCallEnded(webhook, supabaseUrl, supabaseKey);
        break;

      case 'function_call':
        // Handle real-time function calls if needed
        return await handleFunctionCall(webhook, supabaseUrl, supabaseKey);
    }

    return new Response(
      JSON.stringify({ success: true, event: webhook.event }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Inbound Webhook] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleCallStarted(
  webhook: RetellInboundWebhook,
  supabaseUrl: string,
  supabaseKey: string
) {
  console.log(`[Call Started] From: ${webhook.from_number} To: ${webhook.to_number}`);

  // Optionally create a pending call record
  // Most processing happens on call_ended
}

async function handleCallEnded(
  webhook: RetellInboundWebhook,
  supabaseUrl: string,
  supabaseKey: string
) {
  const vars = webhook.dynamic_variables || {};
  const metadata = webhook.metadata || {};
  const analysis = webhook.call_analysis || {};

  console.log(`[Call Ended] Duration: ${webhook.duration_ms}ms, Variables:`, vars);

  // Determine which user this call belongs to
  // Priority: 1) metadata.client_user_id, 2) lookup from agent_id
  let userId: string | undefined = metadata.client_user_id;

  if (!userId && webhook.agent_id) {
    // Look up user from business_onboarding by retell_agent_id
    const lookupResult = await getUserIdFromAgentId(supabaseUrl, supabaseKey, webhook.agent_id);
    userId = lookupResult ?? undefined;
  }

  if (!userId) {
    console.log('[Call Ended] Could not determine user_id, skipping CRM integration');
    return;
  }

  // Calculate duration in seconds
  const duration = webhook.duration_ms ? Math.floor(webhook.duration_ms / 1000) : null;

  // Format transcript
  let transcript = webhook.transcript || '';
  if (webhook.transcript_object?.length) {
    transcript = webhook.transcript_object
      .map(t => `${t.role === 'agent' ? 'Agent' : 'Caller'}: ${t.content}`)
      .join('\n');
  }

  // Determine lead score based on extracted variables and sentiment
  const score = determineLeadScore(vars, analysis);
  const status = determineLeadStatus(vars, analysis);

  // Create or update lead in CRM
  if (vars.caller_name || vars.message_name || vars.business_name) {
    const leadData: LeadInsert = {
      user_id: userId,
      contact_name: vars.caller_name || vars.message_name || vars.business_name || 'Unknown Caller',
      phone: vars.caller_phone || vars.message_phone || webhook.from_number || '',
      email: vars.caller_email,
      address: vars.service_address,
      industry: vars.business_type || vars.service_type,
      status: status,
      score: score,
      notes: buildLeadNotes(webhook, vars, analysis),
      last_contacted: new Date().toISOString(),
    };

    // Check if lead exists by phone number
    const existingLead = await findLeadByPhone(supabaseUrl, supabaseKey, userId, leadData.phone);

    if (existingLead) {
      // Update existing lead
      await updateLead(supabaseUrl, supabaseKey, existingLead.id, {
        ...leadData,
        notes: `${existingLead.notes || ''}\n\n---\n[${new Date().toISOString()}] New inbound call:\n${leadData.notes}`,
      });
      console.log(`[Lead Updated] ${existingLead.id}`);
    } else {
      // Create new lead
      const newLead = await createLead(supabaseUrl, supabaseKey, leadData);
      console.log(`[Lead Created] ${newLead?.id}`);
    }
  }

  // Update call analytics
  await updateCallAnalytics(supabaseUrl, supabaseKey, userId, {
    calls_made: 1,
    calls_connected: duration && duration > 10 ? 1 : 0,
    avg_duration: duration || 0,
    meetings_booked: status === 'meeting_scheduled' ? 1 : 0,
  });
}

async function handleFunctionCall(
  webhook: RetellInboundWebhook,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Response> {
  // Handle real-time function calls from the agent
  // This is where you'd integrate Cal.com, check availability, etc.

  // For now, return a simple acknowledgment
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Function call received',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

function determineLeadScore(
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): 'hot' | 'warm' | 'cold' {
  // Hot: Urgent need, wants to schedule, positive sentiment
  if (vars?.urgency === 'today' || vars?.urgency === 'urgent') return 'hot';
  if (analysis?.user_sentiment === 'positive' && analysis?.call_successful) return 'hot';

  // Warm: Has interest, provided contact info
  if (vars?.caller_name && vars?.caller_phone) return 'warm';
  if (vars?.business_name && vars?.caller_email) return 'warm';

  // Cold: Just inquiring, left message
  return 'cold';
}

function determineLeadStatus(
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): 'new' | 'contacted' | 'interested' | 'meeting_scheduled' {
  // Check if meeting/appointment was mentioned
  if (analysis?.call_summary?.toLowerCase().includes('scheduled') ||
      analysis?.call_summary?.toLowerCase().includes('booked')) {
    return 'meeting_scheduled';
  }

  // Check if they showed interest
  if (analysis?.user_sentiment === 'positive' || analysis?.call_successful) {
    return 'interested';
  }

  // Default to contacted since they called
  return 'contacted';
}

function buildLeadNotes(
  webhook: RetellInboundWebhook,
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): string {
  const parts: string[] = [];

  parts.push(`📞 Inbound Call - ${new Date().toLocaleString()}`);
  parts.push(`From: ${webhook.from_number || 'Unknown'}`);

  if (vars?.service_type) parts.push(`Service Needed: ${vars.service_type}`);
  if (vars?.service_address) parts.push(`Address: ${vars.service_address}`);
  if (vars?.urgency) parts.push(`Urgency: ${vars.urgency}`);
  if (vars?.message_reason) parts.push(`Message: ${vars.message_reason}`);
  if (vars?.callback_time) parts.push(`Best callback time: ${vars.callback_time}`);
  if (vars?.location) parts.push(`Service Area: ${vars.location}`);
  if (vars?.call_volume) parts.push(`Call Volume: ${vars.call_volume}`);
  if (vars?.current_situation) parts.push(`Current Setup: ${vars.current_situation}`);

  if (analysis?.call_summary) {
    parts.push(`\nSummary: ${analysis.call_summary}`);
  }

  if (analysis?.user_sentiment) {
    parts.push(`Sentiment: ${analysis.user_sentiment}`);
  }

  if (webhook.recording_url) {
    parts.push(`\n🎙️ Recording: ${webhook.recording_url}`);
  }

  return parts.join('\n');
}

// Supabase helper functions

async function getUserIdFromAgentId(
  supabaseUrl: string,
  supabaseKey: string,
  agentId: string
): Promise<string | null> {
  // Look up the user who owns this agent via business_onboarding table
  const response = await fetch(
    `${supabaseUrl}/rest/v1/business_onboarding?retell_agent_id=eq.${agentId}&select=user_id`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    }
  );

  if (response.ok) {
    const records = await response.json();
    if (records[0]?.user_id) {
      console.log(`[getUserIdFromAgentId] Found user ${records[0].user_id} for agent ${agentId}`);
      return records[0].user_id;
    }
  }

  console.log(`[getUserIdFromAgentId] No user found for agent ${agentId}`);
  return null;
}

async function findLeadByPhone(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  phone: string
): Promise<{ id: string; notes: string } | null> {
  if (!phone) return null;

  // Normalize phone number for search
  const normalizedPhone = phone.replace(/\D/g, '');

  const response = await fetch(
    `${supabaseUrl}/rest/v1/leads?user_id=eq.${userId}&phone=ilike.*${normalizedPhone.slice(-10)}*&select=id,notes&limit=1`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    }
  );

  if (response.ok) {
    const leads = await response.json();
    return leads[0] || null;
  }
  return null;
}

async function createLead(
  supabaseUrl: string,
  supabaseKey: string,
  lead: LeadInsert
): Promise<{ id: string } | null> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/leads`,
    {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(lead),
    }
  );

  if (response.ok) {
    const [created] = await response.json();
    return created;
  }
  console.error('[createLead] Failed:', await response.text());
  return null;
}

async function updateLead(
  supabaseUrl: string,
  supabaseKey: string,
  leadId: string,
  updates: Partial<LeadInsert>
): Promise<void> {
  await fetch(
    `${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updates),
    }
  );
}

async function updateCallAnalytics(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  metrics: {
    calls_made: number;
    calls_connected: number;
    avg_duration: number;
    meetings_booked: number;
  }
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // Try to update existing record for today
  const response = await fetch(
    `${supabaseUrl}/rest/v1/call_analytics?user_id=eq.${userId}&date=eq.${today}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        calls_made: metrics.calls_made, // This should be incremented, but Supabase REST doesn't support increment
        calls_connected: metrics.calls_connected,
        meetings_booked: metrics.meetings_booked,
      }),
    }
  );

  // If no record exists, create one
  if (response.status === 404 || response.headers.get('content-length') === '0') {
    await fetch(
      `${supabaseUrl}/rest/v1/call_analytics`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_id: userId,
          date: today,
          ...metrics,
        }),
      }
    );
  }
}
