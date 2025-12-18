/**
 * Next.js API Route - Campaign Automation Cron
 * Path: /api/cron/campaign-automation
 *
 * Cron job endpoint to automatically process campaigns
 *
 * Features:
 * - Auto-starts scheduled campaigns
 * - Makes calls for active campaigns
 * - Respects business hours (9 AM - 6 PM)
 * - Rate limits calls per campaign
 * - Auto-pauses campaigns when complete
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Lead {
  id: string;
  user_id: string;
  status: string;
}

interface Campaign {
  id: string;
  user_id: string;
  status: string;
  contacted_count: number;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      campaigns_processed: 0,
      calls_initiated: 0,
      campaigns_paused: 0,
      errors: [] as string[]
    };

    // Check if we're in business hours (9 AM - 6 PM)
    const now = new Date();
    const hour = now.getHours();
    const isBusinessHours = hour >= 9 && hour < 18;

    if (!isBusinessHours) {
      return NextResponse.json({
        message: 'Outside business hours, no calls made',
        current_hour: hour
      });
    }

    // Get all active campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');

    if (campaignsError) {
      results.errors.push(`Failed to fetch campaigns: ${campaignsError.message}`);
      return NextResponse.json(results, { status: 500 });
    }

    if (!campaigns?.length) {
      return NextResponse.json({
        message: 'No active campaigns found',
        ...results
      });
    }

    // Process each campaign
    for (const campaign of campaigns as Campaign[]) {
      try {
        results.campaigns_processed++;

        // Get leads for this campaign
        const { data: campaignLeads } = await supabase
          .from('campaign_leads')
          .select('lead_id, lead:leads(*)')
          .eq('campaign_id', campaign.id);

        if (!campaignLeads?.length) {
          // No more leads, mark as completed
          await supabase
            .from('campaigns')
            .update({ status: 'completed' })
            .eq('id', campaign.id);
          results.campaigns_paused++;
          continue;
        }

        // Filter to new/no_answer leads
        const unleadedLeads = campaignLeads
          .filter(cl => {
            const lead = cl.lead as Lead | null;
            return lead && (lead.status === 'new' || lead.status === 'no_answer');
          })
          .map(cl => cl.lead as Lead);

        // Limit to 5 calls per campaign per run
        const leadsToCall = unleadedLeads.slice(0, 5);

        if (leadsToCall.length === 0) {
          // No more leads to call, pause campaign
          await supabase
            .from('campaigns')
            .update({ status: 'paused' })
            .eq('id', campaign.id);
          results.campaigns_paused++;
          continue;
        }

        // Create outreach call records for each lead
        for (const lead of leadsToCall) {
          try {
            const { error: callError } = await supabase
              .from('outreach_calls')
              .insert({
                user_id: campaign.user_id,
                lead_id: lead.id,
                campaign_id: campaign.id,
                status: 'pending'
              });

            if (!callError) {
              results.calls_initiated++;

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

        // Update campaign stats
        await supabase
          .from('campaigns')
          .update({
            contacted_count: campaign.contacted_count + results.calls_initiated
          })
          .eq('id', campaign.id);

      } catch (error) {
        results.errors.push(`Campaign ${campaign.id}: ${String(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results
    });

  } catch (error) {
    console.error('[Campaign Automation] Error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
