/**
 * Cloudflare Worker Function - Campaign Automation Cron
 * Path: /api/cron/campaign-automation
 *
 * Cron job endpoint to automatically process campaigns
 *
 * Features:
 * - Auto-starts scheduled campaigns
 * - Makes calls for active campaigns
 * - Respects business hours (9 AM - 6 PM)
 * - Rate limits calls per user
 * - Auto-pauses campaigns when complete
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  CRON_SECRET?: string;
}

interface Lead {
  id: string;
  user_id: string;
  status: string;
  [key: string]: unknown;
}

interface Campaign {
  id: string;
  user_id: string;
  status: string;
  contacted_count: number;
  [key: string]: unknown;
}

interface CampaignLeadResult {
  lead_id: string;
  lead: Lead | null;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
      return new Response(
        JSON.stringify({
          message: 'Outside business hours, no calls made',
          current_hour: hour
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all active campaigns
    const campaignsResponse = await fetch(
      `${supabaseUrl}/rest/v1/campaigns?status=eq.active&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!campaignsResponse.ok) {
      const error = await campaignsResponse.text();
      results.errors.push(`Failed to fetch campaigns: ${error}`);
      return new Response(
        JSON.stringify(results),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const campaigns: Campaign[] = await campaignsResponse.json();

    if (!campaigns || campaigns.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No active campaigns found',
          ...results
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        results.campaigns_processed++;

        // Get leads for this campaign that haven't been contacted yet
        const leadsResponse = await fetch(
          `${supabaseUrl}/rest/v1/campaign_leads?campaign_id=eq.${campaign.id}&select=lead_id,lead:leads(*)`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!leadsResponse.ok) {
          const error = await leadsResponse.text();
          results.errors.push(`Campaign ${campaign.id}: ${error}`);
          continue;
        }

        const campaignLeads: CampaignLeadResult[] = await leadsResponse.json();

        if (!campaignLeads || campaignLeads.length === 0) {
          // Campaign has no more leads, mark as completed
          await fetch(
            `${supabaseUrl}/rest/v1/campaigns?id=eq.${campaign.id}`,
            {
              method: 'PATCH',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({ status: 'completed' }),
            }
          );
          results.campaigns_paused++;
          continue;
        }

        // Filter leads that haven't been contacted yet or need follow-up
        const unleadedLeads = campaignLeads
          .filter((cl) => {
            const lead = cl.lead;
            return lead && (
              lead.status === 'new' ||
              lead.status === 'no_answer'
            );
          })
          .map((cl) => cl.lead);

        // Limit to 5 calls per campaign per run (to avoid overwhelming)
        const leadsToCall = unleadedLeads.slice(0, 5);

        if (leadsToCall.length === 0) {
          // No more leads to call, pause campaign
          await fetch(
            `${supabaseUrl}/rest/v1/campaigns?id=eq.${campaign.id}`,
            {
              method: 'PATCH',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({ status: 'paused' }),
            }
          );
          results.campaigns_paused++;
          continue;
        }

        // Create outreach call records for each lead
        for (const lead of leadsToCall as Lead[]) {
          try {
            const callResponse = await fetch(
              `${supabaseUrl}/rest/v1/outreach_calls`,
              {
                method: 'POST',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  user_id: campaign.user_id,
                  lead_id: lead.id,
                  campaign_id: campaign.id,
                  status: 'pending'
                }),
              }
            );

            if (!callResponse.ok) {
              const error = await callResponse.text();
              results.errors.push(`Lead ${lead.id}: ${error}`);
            } else {
              results.calls_initiated++;

              // Update lead status to contacted
              await fetch(
                `${supabaseUrl}/rest/v1/leads?id=eq.${lead.id}`,
                {
                  method: 'PATCH',
                  headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                  },
                  body: JSON.stringify({
                    status: 'contacted',
                    last_contacted: new Date().toISOString()
                  }),
                }
              );
            }
          } catch (error) {
            results.errors.push(`Lead ${lead.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Update campaign stats
        await fetch(
          `${supabaseUrl}/rest/v1/campaigns?id=eq.${campaign.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              contacted_count: campaign.contacted_count + results.calls_initiated
            }),
          }
        );

      } catch (error) {
        results.errors.push(`Campaign ${campaign.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        ...results
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cron job error:', error);
    return new Response(
      JSON.stringify({
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
