'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { DashboardStats, DailyCallStats, CallOutcome, LeadStatusDistribution } from '@/lib/types';
import type { Database } from '@/lib/supabase/types';
import { startOfMonth, startOfWeek, startOfDay, subDays, format } from 'date-fns';

type CallAnalyticsRow = Database['public']['Tables']['call_analytics']['Row'];
type OutreachCallRow = Database['public']['Tables']['outreach_calls']['Row'];
type LeadRow = Database['public']['Tables']['leads']['Row'];

const supabase = createClient();

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const today = startOfDay(new Date());
      const weekStart = startOfWeek(today);
      const monthStart = startOfMonth(today);

      // Get total leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Get leads this month
      const { count: leadsThisMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Get total contacted
      const { count: totalContacted } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'new');

      // Get calls today
      const { count: callsToday } = await supabase
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get calls this week
      const { count: callsThisWeek } = await supabase
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString());

      // Get meetings booked this month
      const { count: meetingsBooked } = await supabase
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .eq('meeting_booked', true)
        .gte('created_at', monthStart.toISOString());

      // Calculate rates
      const responseRate = totalLeads && totalContacted
        ? Math.round((totalContacted / totalLeads) * 100)
        : 0;

      const conversionRate = totalContacted && meetingsBooked
        ? Math.round((meetingsBooked / totalContacted) * 100)
        : 0;

      return {
        totalLeads: totalLeads || 0,
        leadsThisMonth: leadsThisMonth || 0,
        totalContacted: totalContacted || 0,
        responseRate,
        meetingsBooked: meetingsBooked || 0,
        conversionRate,
        callsToday: callsToday || 0,
        callsThisWeek: callsThisWeek || 0,
      };
    },
  });
}

export function useDailyCallStats(days: number = 30) {
  return useQuery({
    queryKey: ['daily-call-stats', days],
    queryFn: async (): Promise<DailyCallStats[]> => {
      const startDate = subDays(new Date(), days);

      const { data, error } = await supabase
        .from('call_analytics')
        .select('*')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return (data as CallAnalyticsRow[]).map(row => ({
        date: row.date,
        calls: row.calls_made,
        connected: row.calls_connected,
        meetings: row.meetings_booked,
      }));
    },
  });
}

export function useCallOutcomes() {
  return useQuery({
    queryKey: ['call-outcomes'],
    queryFn: async (): Promise<CallOutcome[]> => {
      const { data, error } = await supabase
        .from('outreach_calls')
        .select('status, meeting_booked');

      if (error || !data || data.length === 0) {
        return [];
      }

      const outcomes: Record<string, number> = {
        connected: 0,
        no_answer: 0,
        voicemail: 0,
        meeting_booked: 0,
        failed: 0,
      };

      (data as Pick<OutreachCallRow, 'status' | 'meeting_booked'>[]).forEach(call => {
        if (call.meeting_booked) {
          outcomes.meeting_booked++;
        } else if (call.status === 'completed') {
          outcomes.connected++;
        } else if (call.status === 'no_answer') {
          outcomes.no_answer++;
        } else if (call.status === 'voicemail') {
          outcomes.voicemail++;
        } else if (call.status === 'failed') {
          outcomes.failed++;
        }
      });

      return [
        { name: 'Connected', value: outcomes.connected, color: '#3B82F6' },
        { name: 'No Answer', value: outcomes.no_answer, color: '#F59E0B' },
        { name: 'Voicemail', value: outcomes.voicemail, color: '#6B7280' },
        { name: 'Meeting Booked', value: outcomes.meeting_booked, color: '#10B981' },
      ].filter(o => o.value > 0);
    },
  });
}

export function useLeadStatusDistribution() {
  return useQuery({
    queryKey: ['lead-status-distribution'],
    queryFn: async (): Promise<LeadStatusDistribution[]> => {
      const { data, error } = await supabase
        .from('leads')
        .select('status');

      if (error || !data || data.length === 0) {
        return [];
      }

      const statusCounts: Record<string, number> = {};
      (data as Pick<LeadRow, 'status'>[]).forEach(lead => {
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
      });

      const colorMap: Record<string, string> = {
        new: '#6B7280',
        contacted: '#3B82F6',
        interested: '#10B981',
        meeting_scheduled: '#8B5CF6',
        not_interested: '#EF4444',
        no_answer: '#F59E0B',
        invalid: '#DC2626',
      };

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status as LeadStatusDistribution['status'],
        count,
        color: colorMap[status] || '#6B7280',
      }));
    },
  });
}

