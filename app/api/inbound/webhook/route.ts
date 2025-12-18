/**
 * Next.js API Route - Inbound Call Webhook
 * Path: /api/inbound/webhook
 *
 * Handles webhooks from Retell AI inbound agents (created by flow-builder)
 * - Customer service agents for GreenLine AI clients
 * - GreenLine AI sales agent (Jordan)
 *
 * Integrates with Supabase CRM system
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    client_user_id?: string;
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

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    const webhook: RetellInboundWebhook = await request.json();

    console.log(`[Inbound Webhook] Event: ${webhook.event}, Call: ${webhook.call_id}, Agent: ${webhook.agent_id}`);

    // Handle different event types
    switch (webhook.event) {
      case 'call_started':
        console.log(`[Call Started] From: ${webhook.from_number} To: ${webhook.to_number}`);
        break;

      case 'call_ended':
      case 'call_analyzed':
        await handleCallEnded(webhook, supabase);
        break;

      case 'function_call':
        return NextResponse.json({
          success: true,
          message: 'Function call received',
        });
    }

    return NextResponse.json({ success: true, event: webhook.event });

  } catch (error) {
    console.error('[Inbound Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleCallEnded(
  webhook: RetellInboundWebhook,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  const vars = webhook.dynamic_variables || {};
  const metadata = webhook.metadata || {};
  const analysis = webhook.call_analysis || {};

  console.log(`[Call Ended] Duration: ${webhook.duration_ms}ms, Variables:`, vars);

  // Determine which user this call belongs to
  let userId: string | undefined = metadata.client_user_id;

  if (!userId && webhook.agent_id) {
    userId = await getUserIdFromAgentId(supabase, webhook.agent_id);
  }

  if (!userId) {
    console.log('[Call Ended] Could not determine user_id, skipping CRM integration');
    return;
  }

  // Calculate duration in seconds
  const duration = webhook.duration_ms ? Math.floor(webhook.duration_ms / 1000) : null;

  // Determine lead score and status
  const score = determineLeadScore(vars, analysis);
  const status = determineLeadStatus(vars, analysis);

  // Create or update lead in CRM
  if (vars.caller_name || vars.message_name || vars.business_name) {
    // Parse city/state from address if available
    const addressParts = parseAddress(vars.service_address || '');

    const leadData = {
      user_id: userId,
      business_name: vars.business_name || vars.caller_name || vars.message_name || 'Inbound Caller',
      contact_name: vars.caller_name || vars.message_name || vars.business_name || 'Unknown Caller',
      phone: vars.caller_phone || vars.message_phone || webhook.from_number || '',
      email: vars.caller_email || null,
      address: vars.service_address || null,
      city: addressParts.city || vars.location || 'Unknown',
      state: addressParts.state || 'Unknown',
      industry: vars.business_type || vars.service_type || 'Other',
      status: status,
      score: score,
      notes: buildLeadNotes(webhook, vars, analysis),
      last_contacted: new Date().toISOString(),
    };

    // Check if lead exists by phone number
    const existingLead = await findLeadByPhone(supabase, userId, leadData.phone);

    if (existingLead) {
      // Update existing lead
      await supabase
        .from('leads')
        .update({
          ...leadData,
          notes: `${existingLead.notes || ''}\n\n---\n[${new Date().toISOString()}] New inbound call:\n${leadData.notes}`,
        })
        .eq('id', existingLead.id);
      console.log(`[Lead Updated] ${existingLead.id}`);
    } else {
      // Create new lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('[Lead Create Error]', error);
      } else {
        console.log(`[Lead Created] ${newLead?.id}`);
      }
    }
  }

  // Update call analytics
  await updateCallAnalytics(supabase, userId, {
    calls_made: 1,
    calls_connected: duration && duration > 10 ? 1 : 0,
    avg_duration: duration || 0,
    meetings_booked: status === 'meeting_scheduled' ? 1 : 0,
  });
}

async function getUserIdFromAgentId(
  supabase: ReturnType<typeof getSupabaseClient>,
  agentId: string
): Promise<string | undefined> {
  const { data, error } = await supabase
    .from('business_onboarding')
    .select('user_id')
    .eq('retell_agent_id', agentId)
    .single();

  if (error || !data?.user_id) {
    console.log(`[getUserIdFromAgentId] No user found for agent ${agentId}`);
    return undefined;
  }

  console.log(`[getUserIdFromAgentId] Found user ${data.user_id} for agent ${agentId}`);
  return data.user_id;
}

async function findLeadByPhone(
  supabase: ReturnType<typeof getSupabaseClient>,
  userId: string,
  phone: string
): Promise<{ id: string; notes: string } | null> {
  if (!phone) return null;

  const normalizedPhone = phone.replace(/\D/g, '');

  const { data } = await supabase
    .from('leads')
    .select('id, notes')
    .eq('user_id', userId)
    .ilike('phone', `%${normalizedPhone.slice(-10)}%`)
    .limit(1)
    .single();

  return data || null;
}

function determineLeadScore(
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): 'hot' | 'warm' | 'cold' {
  if (vars?.urgency === 'today' || vars?.urgency === 'urgent') return 'hot';
  if (analysis?.user_sentiment === 'positive' && analysis?.call_successful) return 'hot';
  if (vars?.caller_name && vars?.caller_phone) return 'warm';
  if (vars?.business_name && vars?.caller_email) return 'warm';
  return 'cold';
}

function determineLeadStatus(
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): 'new' | 'contacted' | 'interested' | 'meeting_scheduled' {
  if (analysis?.call_summary?.toLowerCase().includes('scheduled') ||
      analysis?.call_summary?.toLowerCase().includes('booked')) {
    return 'meeting_scheduled';
  }
  if (analysis?.user_sentiment === 'positive' || analysis?.call_successful) {
    return 'interested';
  }
  return 'contacted';
}

function parseAddress(address: string): { city: string; state: string } {
  // Try to extract city, state from address like "123 Main Street, San Diego, CA"
  const parts = address.split(',').map(p => p.trim());

  if (parts.length >= 2) {
    // Last part might be state or "City, State"
    const lastPart = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];

    // Check if last part is a state abbreviation (2 letters)
    if (lastPart.length === 2 && /^[A-Z]{2}$/i.test(lastPart)) {
      return { city: secondLast, state: lastPart.toUpperCase() };
    }

    // Check if last part contains "City, ST" or "City ST 12345"
    const stateMatch = lastPart.match(/([A-Za-z\s]+),?\s*([A-Z]{2})\s*\d*/);
    if (stateMatch) {
      return { city: stateMatch[1].trim(), state: stateMatch[2] };
    }

    // Default: assume second-to-last is city
    return { city: secondLast, state: '' };
  }

  return { city: '', state: '' };
}

function buildLeadNotes(
  webhook: RetellInboundWebhook,
  vars: RetellInboundWebhook['dynamic_variables'],
  analysis: RetellInboundWebhook['call_analysis']
): string {
  const parts: string[] = [];

  parts.push(`Inbound Call - ${new Date().toLocaleString()}`);
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
    parts.push(`\nRecording: ${webhook.recording_url}`);
  }

  return parts.join('\n');
}

async function updateCallAnalytics(
  supabase: ReturnType<typeof getSupabaseClient>,
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
  const { data: existing } = await supabase
    .from('call_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) {
    await supabase
      .from('call_analytics')
      .update({
        calls_made: (existing.calls_made || 0) + metrics.calls_made,
        calls_connected: (existing.calls_connected || 0) + metrics.calls_connected,
        meetings_booked: (existing.meetings_booked || 0) + metrics.meetings_booked,
      })
      .eq('user_id', userId)
      .eq('date', today);
  } else {
    await supabase
      .from('call_analytics')
      .insert({
        user_id: userId,
        date: today,
        ...metrics,
      });
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/inbound/webhook',
    description: 'POST Retell AI webhook events here',
  });
}
