'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/database.types';

export type BusinessOnboarding = Database['public']['Tables']['business_onboarding']['Row'];
export type OnboardingStatus = Database['public']['Enums']['onboarding_status'];

interface UseOnboardingsOptions {
  status?: OnboardingStatus | 'all';
  search?: string;
}

export function useOnboardings(options: UseOnboardingsOptions = {}) {
  const { status = 'all', search } = options;

  return useQuery({
    queryKey: ['onboardings', status, search],
    queryFn: async (): Promise<BusinessOnboarding[]> => {
      const supabase = createClient();

      let query = supabase
        .from('business_onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`business_name.ilike.%${search}%,email.ilike.%${search}%,owner_name.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BusinessOnboarding[];
    },
  });
}

export function useOnboarding(id: string) {
  return useQuery({
    queryKey: ['onboarding', id],
    queryFn: async (): Promise<BusinessOnboarding | null> => {
      if (!id) return null;

      const supabase = createClient();

      const { data, error } = await supabase
        .from('business_onboarding')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BusinessOnboarding;
    },
    enabled: !!id,
  });
}

export function useUpdateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['public']['Tables']['business_onboarding']['Update'];
    }): Promise<BusinessOnboarding> => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('business_onboarding')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BusinessOnboarding;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['onboardings'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding', data.id] });
    },
  });
}

export function useOnboardingStats() {
  return useQuery({
    queryKey: ['onboarding-stats'],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('business_onboarding')
        .select('status')
        .returns<{ status: OnboardingStatus }[]>();

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((d) => d.status === 'pending').length,
        in_review: data.filter((d) => d.status === 'in_review').length,
        agent_created: data.filter((d) => d.status === 'agent_created').length,
        active: data.filter((d) => d.status === 'active').length,
        paused: data.filter((d) => d.status === 'paused').length,
      };

      return stats;
    },
  });
}
