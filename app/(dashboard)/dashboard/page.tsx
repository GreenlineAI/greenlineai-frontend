'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PhoneIncoming,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  ArrowRight,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EnhancedStatsCard } from '@/components/shared/EnhancedStatsCard';
import { CallsLineChart } from '@/components/charts/CallsLineChart';
import { CallOutcomesChart } from '@/components/charts/CallOutcomesChart';
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';
import { AIStatusCard } from '@/components/dashboard/AIStatusCard';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { TimePeriodSelector, TimePeriod } from '@/components/dashboard/TimePeriodSelector';
import { useUser } from '@/lib/supabase/hooks';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isToday, startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';

interface CallRecord {
  id: string;
  lead_id: string;
  status: string;
  duration: number | null;
  meeting_booked: boolean | null;
  transcript: string | null;
  recording_url: string | null;
  created_at: string;
  leads?: {
    business_name: string;
    phone: string;
  };
}

interface MeetingRecord {
  id: string;
  scheduled_at: string;
  duration: number;
  status: string;
  meeting_type: string | null;
}

// Hook for dashboard stats using outreach_calls table
function useInboundStats() {
  return useQuery({
    queryKey: ['inbound-dashboard-stats'],
    queryFn: async () => {
      const supabase = createClient();
      const today = startOfDay(new Date());
      const weekStart = startOfWeek(today);
      const monthStart = startOfMonth(today);
      const lastWeekStart = subDays(weekStart, 7);

      // Get calls today - using outreach_calls table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: callsToday } = await (supabase as any)
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get calls this week
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: callsThisWeek } = await (supabase as any)
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString());

      // Get calls last week for comparison
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: callsLastWeek } = await (supabase as any)
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeekStart.toISOString())
        .lt('created_at', weekStart.toISOString());

      // Get appointments booked this month from meetings table
      const { count: appointmentsBooked } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Get average call duration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: durationData } = await (supabase as any)
        .from('outreach_calls')
        .select('duration')
        .not('duration', 'is', null)
        .gte('created_at', monthStart.toISOString());

      const durations = (durationData || []) as { duration: number | null }[];
      const avgDuration = durations.length > 0
        ? Math.round(durations.reduce((acc: number, c: { duration: number | null }) => acc + (c.duration || 0), 0) / durations.length)
        : 0;

      // Get completed calls for answer rate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: completedCalls } = await (supabase as any)
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: totalCalls } = await (supabase as any)
        .from('outreach_calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      const answerRate = totalCalls && completedCalls
        ? Math.round((completedCalls / totalCalls) * 100)
        : 0;

      // Calculate week-over-week change
      const weeklyChange = callsLastWeek && callsLastWeek > 0
        ? Math.round(((callsThisWeek || 0) - callsLastWeek) / callsLastWeek * 100)
        : 0;

      return {
        callsToday: callsToday || 0,
        callsThisWeek: callsThisWeek || 0,
        appointmentsBooked: appointmentsBooked || 0,
        avgDuration,
        answerRate,
        weeklyChange,
      };
    },
  });
}

// Hook for daily call stats (for sparklines)
function useInboundDailyStats(days: number = 30) {
  return useQuery({
    queryKey: ['inbound-daily-stats', days],
    queryFn: async () => {
      const supabase = createClient();
      const startDate = subDays(new Date(), days);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('outreach_calls')
        .select('created_at, status, duration, meeting_booked')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const dailyStats: Record<string, { calls: number; connected: number; meetings: number }> = {};

      const calls = (data || []) as { created_at: string; status: string; duration: number | null; meeting_booked: boolean | null }[];
      calls.forEach((call) => {
        const date = format(new Date(call.created_at), 'yyyy-MM-dd');
        if (!dailyStats[date]) {
          dailyStats[date] = { calls: 0, connected: 0, meetings: 0 };
        }
        dailyStats[date].calls++;
        if (call.status === 'completed') {
          dailyStats[date].connected++;
        }
        if (call.meeting_booked) {
          dailyStats[date].meetings++;
        }
      });

      // Fill in missing days
      const result = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        result.push({
          date,
          calls: dailyStats[date]?.calls || 0,
          connected: dailyStats[date]?.connected || 0,
          meetings: dailyStats[date]?.meetings || 0,
        });
      }

      return result;
    },
  });
}

// Hook for call outcomes
function useInboundCallOutcomes() {
  return useQuery({
    queryKey: ['inbound-call-outcomes'],
    queryFn: async () => {
      const supabase = createClient();
      const monthStart = startOfMonth(new Date());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('outreach_calls')
        .select('status, meeting_booked')
        .gte('created_at', monthStart.toISOString());

      const outcomes: Record<string, number> = {
        answered: 0,
        missed: 0,
        voicemail: 0,
        appointment: 0,
      };

      const calls = (data || []) as { status: string; meeting_booked: boolean | null }[];
      calls.forEach((call) => {
        if (call.status === 'completed') {
          if (call.meeting_booked) {
            outcomes.appointment++;
          } else {
            outcomes.answered++;
          }
        } else if (call.status === 'no_answer' || call.status === 'failed') {
          outcomes.missed++;
        } else if (call.status === 'voicemail') {
          outcomes.voicemail++;
        }
      });

      return [
        { name: 'Answered', value: outcomes.answered, color: '#3B82F6' },
        { name: 'Appointment Booked', value: outcomes.appointment, color: '#10B981' },
        { name: 'Missed', value: outcomes.missed, color: '#EF4444' },
        { name: 'Voicemail', value: outcomes.voicemail, color: '#F59E0B' },
      ].filter(o => o.value > 0);
    },
  });
}

// Hook for recent calls
function useRecentInboundCalls(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-inbound-calls', limit],
    queryFn: async (): Promise<CallRecord[]> => {
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('outreach_calls')
        .select(`
          id,
          lead_id,
          status,
          duration,
          meeting_booked,
          transcript,
          recording_url,
          created_at,
          leads (business_name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as CallRecord[];
    },
  });
}

// Hook for upcoming appointments
function useUpcomingAppointments(limit: number = 5) {
  return useQuery({
    queryKey: ['upcoming-appointments', limit],
    queryFn: async (): Promise<MeetingRecord[]> => {
      const supabase = createClient();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .gte('scheduled_at', now)
        .in('status', ['scheduled', 'confirmed'])
        .order('scheduled_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data || []) as MeetingRecord[];
    },
  });
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function CallStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    completed: { label: 'Answered', className: 'bg-green-100 text-green-700' },
    in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
    missed: { label: 'Missed', className: 'bg-red-100 text-red-700' },
    no_answer: { label: 'Missed', className: 'bg-red-100 text-red-700' },
    voicemail: { label: 'Voicemail', className: 'bg-yellow-100 text-yellow-700' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  };

  const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');
  const { data: stats, isLoading: statsLoading } = useInboundStats();
  const { data: dailyStats, isLoading: dailyStatsLoading } = useInboundDailyStats(30);
  const { data: callOutcomes, isLoading: outcomesLoading } = useInboundCallOutcomes();
  const { data: recentCalls, isLoading: callsLoading } = useRecentInboundCalls(10);
  const { data: appointments, isLoading: appointmentsLoading } = useUpcomingAppointments(5);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';

  // Check if user is new (no calls and no appointments)
  const isNewUser = !statsLoading &&
    (stats?.callsToday === 0 && stats?.callsThisWeek === 0 && stats?.appointmentsBooked === 0) &&
    (!recentCalls || recentCalls.length === 0);

  // Check onboarding status
  const hasCompletedOnboarding = user?.user_metadata?.onboarding_complete || false;
  const hasConfiguredVoiceAI = user?.user_metadata?.voice_ai_configured || false;
  const hasConnectedCalendar = user?.user_metadata?.calendar_connected || false;
  const hasMadeTestCall = !isNewUser;

  // Transform recent calls to activity feed format
  const activityItems = (recentCalls || []).slice(0, 5).map((call) => ({
    id: call.id,
    type: call.status === 'completed'
      ? 'call_completed' as const
      : call.status === 'voicemail'
      ? 'call_voicemail' as const
      : 'call_missed' as const,
    title: call.leads?.business_name || call.leads?.phone || 'Unknown Caller',
    description: call.status === 'completed'
      ? `Call answered • ${formatDuration(call.duration)}`
      : call.status === 'voicemail'
      ? 'Left a voicemail'
      : 'No answer',
    timestamp: call.created_at,
    metadata: {
      duration: call.duration || undefined,
      phoneNumber: call.leads?.phone,
    },
  }));

  // Create sparkline data from last 7 days
  const sparklineData = (dailyStats || []).slice(-7).map((d) => ({ value: d.calls }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {userName}!
              <span className="hidden sm:inline"> Here's how your AI receptionist is performing.</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
            </div>
            <NotificationBell className="hidden lg:flex" />
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
              <Link href="/dashboard/calls">
                <Headphones className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Call </span>Recordings
              </Link>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">AI </span>Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 space-y-5">
        {/* Getting Started Checklist for New Users */}
        {isNewUser && (
          <GettingStartedChecklist
            hasCompletedOnboarding={hasCompletedOnboarding}
            hasConfiguredVoiceAI={hasConfiguredVoiceAI}
            hasConnectedCalendar={hasConnectedCalendar}
            hasMadeTestCall={hasMadeTestCall}
          />
        )}

        {/* AI Status Card */}
        <AIStatusCard
          isActive={true}
          todayCalls={stats?.callsToday || 0}
          avgResponseTime={1.2}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statsLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <EnhancedStatsCard
                title="Calls Today"
                value={stats?.callsToday?.toString() || '0'}
                icon={PhoneIncoming}
                description={`${stats?.callsThisWeek || 0} this week`}
                sparklineData={sparklineData}
                accentColor="blue"
              />
              <EnhancedStatsCard
                title="Appointments"
                value={stats?.appointmentsBooked?.toString() || '0'}
                icon={Calendar}
                trend={{ value: 15, isPositive: true }}
                description="this month"
                accentColor="green"
              />
              <EnhancedStatsCard
                title="Avg Duration"
                value={formatDuration(stats?.avgDuration || 0)}
                icon={Clock}
                description="this month"
                accentColor="purple"
              />
              <EnhancedStatsCard
                title="Answer Rate"
                value={`${stats?.answerRate || 0}%`}
                icon={TrendingUp}
                trend={{
                  value: stats?.weeklyChange || 0,
                  isPositive: (stats?.weeklyChange || 0) >= 0,
                }}
                description="AI performance"
                accentColor="orange"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Charts Section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-5">
            <CallsLineChart
              data={dailyStats || []}
              isLoading={dailyStatsLoading}
              title="Inbound Calls (Last 30 Days)"
            />
            <CallOutcomesChart
              data={callOutcomes || []}
              isLoading={outcomesLoading}
              title="Call Outcomes"
            />
          </div>

          {/* Right Sidebar - Activity Feed */}
          <div className="space-y-5">
            <LiveActivityFeed
              activities={activityItems}
              isLoading={callsLoading}
              maxItems={5}
            />

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Upcoming Appointments</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/meetings">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <div className="space-y-2">
                    {appointments.map((apt) => {
                      const scheduledDate = parseISO(apt.scheduled_at);
                      const isToday_ = isToday(scheduledDate);

                      return (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="rounded-full p-2 bg-purple-100 flex-shrink-0">
                              <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {apt.meeting_type || 'Appointment'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(scheduledDate, 'MMM d')} at {format(scheduledDate, 'h:mm a')}
                              </p>
                            </div>
                          </div>
                          {isToday_ && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs flex-shrink-0">
                              Today
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No upcoming appointments</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Appointments booked by your AI will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pro Tips Card */}
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Getting the Most from Your AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Update Your Services</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep your service list current so the AI can accurately answer questions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Headphones className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Review Call Recordings</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Listen to calls to understand how the AI handles different scenarios
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border">
                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Set Your Hours</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Make sure your business hours are accurate for booking appointments
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
