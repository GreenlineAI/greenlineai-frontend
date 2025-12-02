/**
 * Automated Calling Script - Cron Job
 * 
 * This script systematically calls through all leads in the database
 * Respects daily limits, working hours, and call pacing
 * 
 * Usage:
 * 1. Deploy to Cloudflare Workers Cron Trigger
 * 2. Or run manually: node scripts/auto-dialer.ts
 */

import { createClient } from '@supabase/supabase-js';

// Cloudflare Workers types
type ScheduledEvent = {
  scheduledTime: number;
  cron: string;
};

type ExecutionContext = {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
};

interface Env {
  AUTO_DIALER_USER_ID: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NEXT_PUBLIC_SITE_URL: string;
}

// Configuration
const CONFIG = {
  DAILY_CALL_LIMIT: 100,           // Max calls per day
  CALLS_PER_BATCH: 10,             // How many to call at once
  DELAY_BETWEEN_CALLS: 30000,      // 30 seconds between calls (ms)
  WORKING_HOURS_START: 9,          // 9 AM
  WORKING_HOURS_END: 18,           // 6 PM
  EXCLUDED_DAYS: [0, 6],           // Sunday=0, Saturday=6
  RETRY_NO_ANSWER: true,           // Retry "no_answer" leads
  MAX_ATTEMPTS_PER_LEAD: 3,        // Max times to call same lead
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

/**
 * Check if we're within calling hours
 */
function isWithinWorkingHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Check if it's a weekend
  if (CONFIG.EXCLUDED_DAYS.includes(day)) {
    console.log('❌ Weekend - not calling');
    return false;
  }
  
  // Check if within working hours
  if (hour < CONFIG.WORKING_HOURS_START || hour >= CONFIG.WORKING_HOURS_END) {
    console.log(`❌ Outside working hours (${hour}:00)`);
    return false;
  }
  
  return true;
}

/**
 * Get leads that need to be called
 */
async function getLeadsToCall(supabase: any, userId: string, limit: number): Promise<Lead[]> {
  // Get leads that:
  // 1. Haven't been called yet OR
  // 2. Had "no_answer" status and haven't hit max attempts OR
  // 3. Status is "new" or "no_answer"
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['new', 'no_answer'])
    .order('created_at', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  
  // Filter out leads that have been called too many times
  const { data: callCounts } = await supabase
    .from('outreach_calls')
    .select('lead_id, count')
    .eq('user_id', userId)
    .in('lead_id', leads?.map((l: Lead) => l.id) || []);
  
  const callCountMap = new Map(
    callCounts?.map((c: any) => [c.lead_id, c.count]) || []
  );
  
  const filteredLeads = leads?.filter((lead: Lead) => {
    const attempts = (callCountMap.get(lead.id) as number) || 0;
    return attempts < CONFIG.MAX_ATTEMPTS_PER_LEAD;
  }) || [];
  
  console.log(`📋 Found ${filteredLeads.length} leads to call`);
  return filteredLeads;
}

/**
 * Get how many calls we've already made today
 */
async function getTodayCallCount(supabase: any, userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('outreach_calls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());
  
  if (error) {
    console.error('Error getting call count:', error);
    return 0;
  }
  
  console.log(`📞 Already made ${count || 0} calls today`);
  return count || 0;
}

/**
 * Initiate a call via Stammer AI
 */
async function initiateCall(supabase: any, lead: Lead, siteUrl: string): Promise<CallResult> {
  try {
    const response = await fetch(`${siteUrl}/api/calls/initiate`, {
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
    
    console.log(`✅ Called ${lead.business_name} - Call ID: ${data.callId}`);
    
    // Create call record in database
    await supabase.from('outreach_calls').insert({
      user_id: lead.user_id,
      lead_id: lead.id,
      status: 'pending',
      vapi_call_id: data.callId,
    });
    
    return {
      leadId: lead.id,
      success: true,
      callId: data.callId,
    };
  } catch (error) {
    console.error(`❌ Failed to call ${lead.business_name}:`, error);
    return {
      leadId: lead.id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main auto-dialer function
 */
async function runAutoDialer(userId: string, env: Env) {
  console.log('🚀 Starting Auto-Dialer...');
  console.log(`User ID: ${userId}`);
  console.log(`Config:`, CONFIG);
  
  // Initialize Supabase with environment variables
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Check if we're within working hours
  if (!isWithinWorkingHours()) {
    console.log('⏸️  Not calling - outside working hours');
    return {
      status: 'skipped',
      reason: 'outside_working_hours',
    };
  }
  
  // Check daily limit
  const todayCallCount = await getTodayCallCount(supabase, userId);
  const remainingCalls = CONFIG.DAILY_CALL_LIMIT - todayCallCount;
  
  if (remainingCalls <= 0) {
    console.log('⏸️  Daily call limit reached');
    return {
      status: 'skipped',
      reason: 'daily_limit_reached',
      callsToday: todayCallCount,
    };
  }
  
  console.log(`📊 Can make ${remainingCalls} more calls today`);
  
  // Get leads to call
  const batchSize = Math.min(CONFIG.CALLS_PER_BATCH, remainingCalls);
  const leads = await getLeadsToCall(supabase, userId, batchSize);
  
  if (leads.length === 0) {
    console.log('✅ No more leads to call');
    return {
      status: 'completed',
      reason: 'no_leads_remaining',
    };
  }
  
  // Call each lead
  const results: CallResult[] = [];
  
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`\n📞 [${i + 1}/${leads.length}] Calling ${lead.business_name}...`);
    
    const result = await initiateCall(supabase, lead, env.NEXT_PUBLIC_SITE_URL);
    results.push(result);
    
    // Wait between calls (except for last one)
    if (i < leads.length - 1) {
      console.log(`⏳ Waiting ${CONFIG.DELAY_BETWEEN_CALLS / 1000}s before next call...`);
      await sleep(CONFIG.DELAY_BETWEEN_CALLS);
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n✅ Auto-Dialer Complete!');
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total today: ${todayCallCount + successful}`);
  
  return {
    status: 'completed',
    callsMade: successful,
    callsFailed: failed,
    totalToday: todayCallCount + successful,
    results,
  };
}

/**
 * Cloudflare Workers Cron Handler
 */
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

// For manual execution (Node.js)
if (typeof require !== 'undefined' && require.main === module) {
  const userId = process.argv[2] || '0b627f19-6ea2-469b-a596-84cab72190c9';
  const mockEnv: Env = {
    AUTO_DIALER_USER_ID: userId,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
  };
  runAutoDialer(userId, mockEnv)
    .then(result => {
      console.log('\nFinal Result:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(scheduledHandler(event, env));
  },
};
