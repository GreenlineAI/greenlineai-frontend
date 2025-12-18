/**
 * Next.js API Route - Auto-Dialer Trigger
 * Path: /api/auto-dialer/trigger
 *
 * Endpoint to manually trigger the auto-dialer process
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface TriggerRequest {
  userId?: string;
  triggeredBy?: string;
  maxCalls?: number;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    // Optional: Add authentication
    const cronSecret = request.headers.get('X-Cron-Secret');
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: TriggerRequest = await request.json();
    const userId = body.userId || process.env.AUTO_DIALER_USER_ID;
    const maxCalls = body.maxCalls || 5;

    console.log('[Auto-Dialer] Triggered:', {
      userId,
      triggeredBy: body.triggeredBy,
      time: new Date().toISOString(),
    });

    const results = {
      calls_initiated: 0,
      leads_processed: [] as string[],
      errors: [] as string[]
    };

    // Get active campaigns for this user
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (campaignsError || !campaigns?.length) {
      return NextResponse.json({
        success: true,
        message: 'No active campaigns found',
        ...results
      });
    }

    // Process each campaign
    for (const campaign of campaigns) {
      // Get leads for this campaign that need calling
      const { data: campaignLeads } = await supabase
        .from('campaign_leads')
        .select('lead_id, lead:leads(*)')
        .eq('campaign_id', campaign.id)
        .limit(maxCalls);

      if (!campaignLeads?.length) continue;

      // Filter to new/no_answer leads
      interface LeadData { status: string; id: string; phone: string }
      const leadsToCall = campaignLeads
        .filter(cl => {
          const lead = cl.lead as unknown as LeadData | null;
          return lead && (lead.status === 'new' || lead.status === 'no_answer');
        })
        .slice(0, maxCalls);

      for (const cl of leadsToCall) {
        const lead = cl.lead as unknown as LeadData | null;
        if (!lead) continue;

        try {
          // Create outreach call record
          const { error: callError } = await supabase
            .from('outreach_calls')
            .insert({
              user_id: userId,
              lead_id: lead.id,
              campaign_id: campaign.id,
              status: 'pending'
            });

          if (!callError) {
            results.calls_initiated++;
            results.leads_processed.push(lead.id);

            // Update lead status
            await supabase
              .from('leads')
              .update({
                status: 'contacted',
                last_contacted: new Date().toISOString()
              })
              .eq('id', lead.id);
          } else {
            results.errors.push(`Lead ${lead.id}: ${callError.message}`);
          }
        } catch (error) {
          results.errors.push(`Lead ${lead.id}: ${String(error)}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results
    });

  } catch (error) {
    console.error('[Auto-Dialer] Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/auto-dialer/trigger',
    description: 'POST to trigger auto-dialer (requires X-Cron-Secret header)'
  });
}
