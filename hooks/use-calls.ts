'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { OutreachCall, CallStatus, Lead, Campaign } from '@/lib/types';
const supabase = createClient();

interface CallsFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: CallStatus | 'all';
  meetingBooked?: boolean;
  search?: string;
}

interface CallsResponse {
  calls: OutreachCall[];
  total: number;
  page: number;
  pageSize: number;
}

function mapDbCallToCall(dbCall: Record<string, unknown>): OutreachCall {
  return {
    id: dbCall.id as string,
    leadId: dbCall.lead_id as string,
    lead: dbCall.leads ? mapDbLeadToLead(dbCall.leads as Record<string, unknown>) : undefined,
    campaignId: dbCall.campaign_id as string | null,
    campaign: dbCall.campaigns ? mapDbCampaignToCampaign(dbCall.campaigns as Record<string, unknown>) : undefined,
    status: dbCall.status as CallStatus,
    duration: dbCall.duration as number | null,
    transcript: dbCall.transcript as string | null,
    summary: dbCall.summary as string | null,
    sentiment: dbCall.sentiment as 'positive' | 'neutral' | 'negative' | null,
    meetingBooked: dbCall.meeting_booked as boolean,
    vapiCallId: dbCall.vapi_call_id as string | null,
    recordingUrl: dbCall.recording_url as string | null,
    createdAt: dbCall.created_at as string,
  };
}

function mapDbLeadToLead(dbLead: Record<string, unknown>): Lead {
  return {
    id: dbLead.id as string,
    businessName: dbLead.business_name as string,
    contactName: dbLead.contact_name as string | null,
    email: dbLead.email as string | null,
    phone: dbLead.phone as string,
    address: dbLead.address as string | null,
    city: dbLead.city as string,
    state: dbLead.state as string,
    zip: dbLead.zip as string | null,
    industry: dbLead.industry as string,
    googleRating: dbLead.google_rating as number | null,
    reviewCount: dbLead.review_count as number | null,
    website: dbLead.website as string | null,
    employeeCount: dbLead.employee_count as string | null,
    yearEstablished: dbLead.year_established as number | null,
    status: dbLead.status as Lead['status'],
    score: dbLead.score as Lead['score'],
    lastContacted: dbLead.last_contacted as string | null,
    notes: dbLead.notes as string | null,
    createdAt: dbLead.created_at as string,
    updatedAt: dbLead.updated_at as string,
  };
}

function mapDbCampaignToCampaign(dbCampaign: Record<string, unknown>): Campaign {
  return {
    id: dbCampaign.id as string,
    name: dbCampaign.name as string,
    status: dbCampaign.status as Campaign['status'],
    type: dbCampaign.type as Campaign['type'],
    leadsCount: dbCampaign.leads_count as number,
    contactedCount: dbCampaign.contacted_count as number,
    respondedCount: dbCampaign.responded_count as number,
    meetingsBooked: dbCampaign.meetings_booked as number,
    createdAt: dbCampaign.created_at as string,
    updatedAt: dbCampaign.updated_at as string,
  };
}

interface UseCallsOptions {
  page?: number;
  pageSize?: number;
  filters?: CallsFilters;
}

export function useCalls(options: UseCallsOptions = {}) {
  const { page = 1, pageSize = 25, filters } = options;

  return useQuery({
    queryKey: ['calls', options],
    queryFn: async (): Promise<CallsResponse> => {
      let query = supabase
        .from('outreach_calls')
        .select(`
          *,
          leads (*),
          campaigns (*)
        `, { count: 'exact' });

      // Apply filters
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.meetingBooked !== undefined) {
        query = query.eq('meeting_booked', filters.meetingBooked);
      }

      query = query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        calls: (data || []).map(mapDbCallToCall),
        total: count || 0,
        page,
        pageSize,
      };
    },
  });
}

export function useCall(id: string) {
  return useQuery({
    queryKey: ['call', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_calls')
        .select(`
          *,
          leads (*),
          campaigns (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbCallToCall(data);
    },
    enabled: !!id,
  });
}

export function useLeadCalls(leadId: string) {
  return useQuery({
    queryKey: ['lead-calls', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_calls')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapDbCallToCall);
    },
    enabled: !!leadId,
  });
}

export function useCreateCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (call: {
      leadId: string;
      campaignId?: string;
      vapiCallId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('outreach_calls')
        .insert({
          user_id: user.id,
          lead_id: call.leadId,
          campaign_id: call.campaignId || null,
          vapi_call_id: call.vapiCallId || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbCallToCall(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
  });
}

export function useUpdateCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<OutreachCall> }) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.transcript !== undefined) dbUpdates.transcript = updates.transcript;
      if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
      if (updates.sentiment !== undefined) dbUpdates.sentiment = updates.sentiment;
      if (updates.meetingBooked !== undefined) dbUpdates.meeting_booked = updates.meetingBooked;
      if (updates.recordingUrl !== undefined) dbUpdates.recording_url = updates.recordingUrl;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('outreach_calls')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbCallToCall(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['call'] });
    },
  });
}

export function useRecentCalls(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-calls', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_calls')
        .select(`
          *,
          leads (business_name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(mapDbCallToCall);
    },
  });
}
