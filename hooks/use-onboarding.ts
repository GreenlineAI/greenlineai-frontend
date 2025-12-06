'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type OnboardingStatus = 'pending' | 'in_review' | 'agent_created' | 'active' | 'paused';

export interface BusinessOnboarding {
  id: string;
  user_id: string | null;
  business_name: string;
  business_type: string;
  business_type_other: string | null;
  owner_name: string;
  email: string;
  phone: string;
  website: string | null;
  city: string;
  state: string;
  zip: string | null;
  service_radius_miles: number;
  services: string[];
  hours_monday: string | null;
  hours_tuesday: string | null;
  hours_wednesday: string | null;
  hours_thursday: string | null;
  hours_friday: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
  greeting_name: string | null;
  preferred_voice: string;
  appointment_duration: number;
  calendar_link: string | null;
  pricing_info: string | null;
  special_instructions: string | null;
  phone_preference: 'new' | 'forward' | 'port';
  existing_phone_number: string | null;
  current_phone_provider: string | null;
  retell_agent_id: string | null;
  retell_phone_number: string | null;
  status: OnboardingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface UseOnboardingsOptions {
  status?: OnboardingStatus | 'all';
  search?: string;
}

export function useOnboardings(options: UseOnboardingsOptions = {}) {
  const { status = 'all', search } = options;

  return useQuery({
    queryKey: ['onboardings', status, search],
    queryFn: async () => {
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
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
    queryFn: async () => {
      if (!id) return null;

      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
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
      updates: Partial<BusinessOnboarding>;
    }) => {
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('business_onboarding')
        .update(updates)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('business_onboarding')
        .select('status');

      if (error) throw error;

      const statusData = data as { status: string }[];
      const stats = {
        total: statusData.length,
        pending: statusData.filter((d) => d.status === 'pending').length,
        in_review: statusData.filter((d) => d.status === 'in_review').length,
        agent_created: statusData.filter((d) => d.status === 'agent_created').length,
        active: statusData.filter((d) => d.status === 'active').length,
        paused: statusData.filter((d) => d.status === 'paused').length,
      };

      return stats;
    },
  });
}
