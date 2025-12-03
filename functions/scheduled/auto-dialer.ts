/**
 * Automated Calling Script - Cron Job
 *
 * This script systematically calls through all leads in the database
 * Respects daily limits, working hours, and call pacing
 *
 * Usage: Deploy to Cloudflare Workers Cron Trigger
 */

// Cloudflare Workers types
type ScheduledEvent = {
  scheduledTime: number;
  cron: string;
};

type ExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
};

interface Env {
  AUTO_DIALER_USER_ID: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NEXT_PUBLIC_SITE_URL: string;
}

// Configuration
const CONFIG = {
  DAILY_CALL_LIMIT: 100,
  CALLS_PER_BATCH: 10,
  DELAY_BETWEEN_CALLS: 30000,
  WORKING_HOURS_START: 9,
  WORKING_HOURS_END: 18,
  EXCLUDED_DAYS: [0, 6],
  RETRY_NO_ANSWER: true,
  MAX_ATTEMPTS_PER_LEAD: 3,
};

interface Lead {
  id: string;
  business_name: string;
  contact_name: string | null;
  phone: string;
  industry: string;
  city: string;
  state: string;
  status: string;
  user_id: string;
}

interface CallResult {
  leadId: string;
  success: boolean;
  callId?: string;
  error?: string;
}

function isWithinWorkingHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  if (CONFIG.EXCLUDED_DAYS.includes(day)) {
    console.log('Weekend - not calling');
    return false;
  }

  if (hour < CONFIG.WORKING_HOURS_START || hour >= CONFIG.WORKING_HOURS_END) {
    console.log(`Outside working hours (${hour}:00)`);
    return false;
  }

  return true;
}

async function getLeadsToCall(env: Env, userId: string, limit: number): Promise<Lead[]> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/leads?user_id=eq.${userId}&status=in.(new,no_answer)&order=created_at.asc&limit=${limit}`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!response.ok) {
    console.error('Error fetching leads:', await response.text());
    return [];
  }

  const leads: Lead[] = await response.json();
  console.log(`Found ${leads.length} leads to call`);
  return leads;
}

async function getTodayCallCount(env: Env, userId: string): Promise<number> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const response = await fetch(
    `${supabaseUrl}/rest/v1/outreach_calls?user_id=eq.${userId}&created_at=gte.${today.toISOString()}&select=id`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'count=exact',
      },
    }
  );

  if (!response.ok) {
    console.error('Error getting call count:', await response.text());
    return 0;
  }

  const contentRange = response.headers.get('content-range');
  const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
  console.log(`Already made ${count} calls today`);
  return count;
}

async function initiateCall(env: Env, lead: Lead): Promise<CallResult> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/calls/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: lead.phone,
        leadId: lead.id,
        campaignId: 'auto-dialer',
        metadata: {
          business_name: lead.business_name,
          contact_name: lead.contact_name || 'Owner',
          business_type: lead.industry,
          city: lead.city,
          state: lead.state,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    console.log(`Called ${lead.business_name} - Call ID: ${data.callId}`);

    // Create call record
    await fetch(`${supabaseUrl}/rest/v1/outreach_calls`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        user_id: lead.user_id,
        lead_id: lead.id,
        status: 'pending',
        vapi_call_id: data.callId,
      }),
    });

    return {
      leadId: lead.id,
      success: true,
      callId: data.callId,
    };
  } catch (error) {
    console.error(`Failed to call ${lead.business_name}:`, error);
    return {
      leadId: lead.id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAutoDialer(userId: string, env: Env) {
  console.log('Starting Auto-Dialer...');
  console.log(`User ID: ${userId}`);

  if (!isWithinWorkingHours()) {
    console.log('Not calling - outside working hours');
    return {
      status: 'skipped',
      reason: 'outside_working_hours',
    };
  }

  const todayCallCount = await getTodayCallCount(env, userId);
  const remainingCalls = CONFIG.DAILY_CALL_LIMIT - todayCallCount;

  if (remainingCalls <= 0) {
    console.log('Daily call limit reached');
    return {
      status: 'skipped',
      reason: 'daily_limit_reached',
      callsToday: todayCallCount,
    };
  }

  console.log(`Can make ${remainingCalls} more calls today`);

  const batchSize = Math.min(CONFIG.CALLS_PER_BATCH, remainingCalls);
  const leads = await getLeadsToCall(env, userId, batchSize);

  if (leads.length === 0) {
    console.log('No more leads to call');
    return {
      status: 'completed',
      reason: 'no_leads_remaining',
    };
  }

  const results: CallResult[] = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Calling ${lead.business_name}...`);

    const result = await initiateCall(env, lead);
    results.push(result);

    if (i < leads.length - 1) {
      console.log(`Waiting ${CONFIG.DELAY_BETWEEN_CALLS / 1000}s before next call...`);
      await sleep(CONFIG.DELAY_BETWEEN_CALLS);
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('Auto-Dialer Complete!');
  console.log(`Successful: ${successful}, Failed: ${failed}, Total today: ${todayCallCount + successful}`);

  return {
    status: 'completed',
    callsMade: successful,
    callsFailed: failed,
    totalToday: todayCallCount + successful,
    results,
  };
}

export async function scheduledHandler(event: ScheduledEvent, env: Env) {
  const userId = env.AUTO_DIALER_USER_ID || '0b627f19-6ea2-469b-a596-84cab72190c9';

  try {
    const result = await runAutoDialer(userId, env);
    console.log('Cron job result:', result);
    return result;
  } catch (error) {
    console.error('Cron job error:', error);
    throw error;
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(scheduledHandler(event, env));
  },
};
