'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Campaign, CampaignStatus, CampaignType } from '@/lib/types';

const supabase = createClient();

function mapDbCampaignToCampaign(dbCampaign: Record<string, unknown>): Campaign {
  return {
    id: dbCampaign.id as string,
    name: dbCampaign.name as string,
    status: dbCampaign.status as CampaignStatus,
    type: dbCampaign.type as CampaignType,
    leadsCount: dbCampaign.leads_count as number,
    contactedCount: dbCampaign.contacted_count as number,
    respondedCount: dbCampaign.responded_count as number,
    meetingsBooked: dbCampaign.meetings_booked as number,
    createdAt: dbCampaign.created_at as string,
    updatedAt: dbCampaign.updated_at as string,
  };
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapDbCampaignToCampaign);
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbCampaignToCampaign(data);
    },
    enabled: !!id,
  });
}

export function useCampaignLeads(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-leads', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select(`
          lead_id,
          leads (*)
        `)
        .eq('campaign_id', campaignId);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: { name: string; type: CampaignType; leadIds?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: campaign.name,
          type: campaign.type,
          leads_count: campaign.leadIds?.length || 0,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Add leads to campaign if provided
      if (campaign.leadIds && campaign.leadIds.length > 0) {
        const campaignLeads = campaign.leadIds.map(leadId => ({
          campaign_id: data.id,
          lead_id: leadId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: leadsError } = await (supabase as any)
          .from('campaign_leads')
          .insert(campaignLeads);

        if (leadsError) {
          throw new Error(leadsError.message);
        }
      }

      return mapDbCampaignToCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.leadsCount !== undefined) dbUpdates.leads_count = updates.leadsCount;
      if (updates.contactedCount !== undefined) dbUpdates.contacted_count = updates.contactedCount;
      if (updates.respondedCount !== undefined) dbUpdates.responded_count = updates.respondedCount;
      if (updates.meetingsBooked !== undefined) dbUpdates.meetings_booked = updates.meetingsBooked;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbCampaignToCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useAddLeadsToCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, leadIds }: { campaignId: string; leadIds: string[] }) => {
      const campaignLeads = leadIds.map(leadId => ({
        campaign_id: campaignId,
        lead_id: leadId,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('campaign_leads')
        .upsert(campaignLeads, { onConflict: 'campaign_id,lead_id' });

      if (error) {
        throw new Error(error.message);
      }

      // Update campaign leads count
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('campaigns')
        .update({ leads_count: leadIds.length })
        .eq('id', campaignId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-leads'] });
    },
  });
}
