'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Lead, LeadFilters, LeadStatus, LeadScore } from '@/lib/types';

const supabase = createClient();

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

interface UseLeadsOptions {
  page?: number;
  pageSize?: number;
  filters?: Partial<LeadFilters>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
    status: dbLead.status as LeadStatus,
    score: dbLead.score as LeadScore,
    lastContacted: dbLead.last_contacted as string | null,
    notes: dbLead.notes as string | null,
    createdAt: dbLead.created_at as string,
    updatedAt: dbLead.updated_at as string,
  };
}

async function fetchLeads(options: UseLeadsOptions): Promise<LeadsResponse> {
  const { page = 1, pageSize = 25, filters, sortBy = 'created_at', sortOrder = 'desc' } = options;

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters?.search) {
    query = query.or(`business_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.score && filters.score !== 'all') {
    query = query.eq('score', filters.score);
  }
  if (filters?.state && filters.state !== 'all') {
    query = query.eq('state', filters.state);
  }
  if (filters?.minRating !== null && filters?.minRating !== undefined) {
    query = query.gte('google_rating', filters.minRating);
  }
  if (filters?.maxRating !== null && filters?.maxRating !== undefined) {
    query = query.lte('google_rating', filters.maxRating);
  }

  // Apply sorting and pagination
  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    leads: (data || []).map(mapDbLeadToLead),
    total: count || 0,
    page,
    pageSize,
  };
}

export function useLeads(options: UseLeadsOptions = {}) {
  return useQuery({
    queryKey: ['leads', options],
    queryFn: () => fetchLeads(options),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbLeadToLead(data);
    },
    enabled: !!id,
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName;
      if (updates.contactName !== undefined) dbUpdates.contact_name = updates.contactName;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.city !== undefined) dbUpdates.city = updates.city;
      if (updates.state !== undefined) dbUpdates.state = updates.state;
      if (updates.zip !== undefined) dbUpdates.zip = updates.zip;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.score !== undefined) dbUpdates.score = updates.score;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.lastContacted !== undefined) dbUpdates.last_contacted = updates.lastContacted;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('leads')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbLeadToLead(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead'] });
    },
  });
}

export function useDeleteLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('leads')
        .delete()
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useBulkUpdateLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Partial<Lead> }) => {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.score !== undefined) dbUpdates.score = updates.score;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('leads')
        .update(dbUpdates)
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
