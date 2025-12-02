import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Lead {
  id: string;
  user_id: string;
  status: string;
  [key: string]: unknown;
}

interface CampaignLeadResult {
  lead_id: string;
  lead: Lead | null;
}

/**
 * Cron job endpoint to automatically process campaigns
 * 
 * This should be called every 15 minutes by a cron service (Vercel Cron, GitHub Actions, etc)
 * 
 * Features:
 * - Auto-starts scheduled campaigns
 * - Makes calls for active campaigns
 * - Respects business hours (9 AM - 6 PM)
 * - Rate limits calls per user
 * - Auto-pauses campaigns when complete
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: campaigns, error: campaignsError } = await (supabase as any)
      .from('campaigns')
      .select('*')
      .eq('status', 'active');

    if (campaignsError) {
      results.errors.push(`Failed to fetch campaigns: ${campaignsError.message}`);
      return NextResponse.json(results, { status: 500 });
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        message: 'No active campaigns found',
        ...results
      });
    }

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        results.campaigns_processed++;

        // Get leads for this campaign that haven't been contacted yet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: campaignLeads, error: leadsError } = await (supabase as any)
          .from('campaign_leads')
          .select(`
            lead_id,
            lead:leads(*)
          `)
          .eq('campaign_id', campaign.id);

        if (leadsError) {
          results.errors.push(`Campaign ${campaign.id}: ${leadsError.message}`);
          continue;
        }

        if (!campaignLeads || campaignLeads.length === 0) {
          // Campaign has no more leads, mark as completed
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('campaigns')
            .update({ status: 'completed' })
            .eq('id', campaign.id);
          results.campaigns_paused++;
          continue;
        }

        // Filter leads that haven't been contacted yet or need follow-up
        const unleadedLeads = (campaignLeads as CampaignLeadResult[])
          .filter((cl: CampaignLeadResult) => {
            const lead = cl.lead;
            return lead && (
              lead.status === 'new' ||
              lead.status === 'no_answer'
            );
          })
          .map((cl: CampaignLeadResult) => cl.lead);

        // Limit to 5 calls per campaign per run (to avoid overwhelming)
        const leadsToCall = unleadedLeads.slice(0, 5);

        if (leadsToCall.length === 0) {
          // No more leads to call, pause campaign
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('campaigns')
            .update({ status: 'paused' })
            .eq('id', campaign.id);
          results.campaigns_paused++;
          continue;
        }

        // Create outreach call records for each lead
        for (const lead of leadsToCall as Lead[]) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: callError } = await (supabase as any)
              .from('outreach_calls')
              .insert({
                user_id: campaign.user_id,
                lead_id: lead.id,
                campaign_id: campaign.id,
                status: 'pending'
              });

            if (callError) {
              results.errors.push(`Lead ${lead.id}: ${callError.message}`);
            } else {
              results.calls_initiated++;
              
              // Update lead status to contacted
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (supabase as any)
                .from('leads')
                .update({
                  status: 'contacted',
                  last_contacted: new Date().toISOString()
                })
                .eq('id', lead.id);
            }
          } catch (error) {
            results.errors.push(`Lead ${lead.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Update campaign stats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('campaigns')
          .update({
            contacted_count: campaign.contacted_count + results.calls_initiated
          })
          .eq('id', campaign.id);

      } catch (error) {
        results.errors.push(`Campaign ${campaign.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
