'use client';

import Link from 'next/link';
import {
  PhoneIncoming,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  PlayCircle,
  ArrowRight,
  Phone,
  CheckCircle2,
  Bot,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/shared/StatsCard';
import { CallsLineChart } from '@/components/charts/CallsLineChart';
import { CallOutcomesChart } from '@/components/charts/CallOutcomesChart';
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist';
import { WelcomeEmptyState } from '@/components/dashboard/WelcomeEmptyState';
import { useUser } from '@/lib/supabase/hooks';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isToday, startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';

interface CallRecord {
  id: string;
  phone_number: string;
  status: string;
  duration: number | null;
  disposition: string | null;
  transcript: string | null;
  recording_url: string | null;
  created_at: string;
}

interface MeetingRecord {
  id: string;
  scheduled_at: string;
  duration: number;
  status: string;
  meeting_type: string | null;
}

// Hook for inbound dashboard stats
function useInboundStats() {
  return useQuery({
    queryKey: ['inbound-dashboard-stats'],
    queryFn: async () => {
      const supabase = createClient();
      const today = startOfDay(new Date());
      const weekStart = startOfWeek(today);
      const monthStart = startOfMonth(today);

      // Get calls today - using 'calls' table for inbound
      const { count: callsToday } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get calls this week
      const { count: callsThisWeek } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString());

      // Get appointments booked this month from meetings table
      const { count: appointmentsBooked } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Get average call duration
      const { data: durationData } = await supabase
        .from('calls')
        .select('duration')
        .not('duration', 'is', null)
        .gte('created_at', monthStart.toISOString());

      const durations = (durationData || []) as { duration: number | null }[];
      const avgDuration = durations.length > 0
        ? Math.round(durations.reduce((acc, c) => acc + (c.duration || 0), 0) / durations.length)
        : 0;

      // Get completed calls for answer rate
      const { count: completedCalls } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

      const { count: totalCalls } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      const answerRate = totalCalls && completedCalls
        ? Math.round((completedCalls / totalCalls) * 100)
        : 0;

      return {
        callsToday: callsToday || 0,
        callsThisWeek: callsThisWeek || 0,
        appointmentsBooked: appointmentsBooked || 0,
        avgDuration,
        answerRate,
      };
    },
  });
}

// Hook for daily inbound call stats
function useInboundDailyStats(days: number = 30) {
  return useQuery({
    queryKey: ['inbound-daily-stats', days],
    queryFn: async () => {
      const supabase = createClient();
      const startDate = subDays(new Date(), days);

      const { data } = await supabase
        .from('calls')
        .select('created_at, status, duration')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const dailyStats: Record<string, { calls: number; connected: number; meetings: number }> = {};

      const calls = (data || []) as { created_at: string; status: string; duration: number | null }[];
      calls.forEach((call) => {
        const date = format(new Date(call.created_at), 'yyyy-MM-dd');
        if (!dailyStats[date]) {
          dailyStats[date] = { calls: 0, connected: 0, meetings: 0 };
        }
        dailyStats[date].calls++;
        if (call.status === 'completed') {
          dailyStats[date].connected++;
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

// Hook for inbound call outcomes
function useInboundCallOutcomes() {
  return useQuery({
    queryKey: ['inbound-call-outcomes'],
    queryFn: async () => {
      const supabase = createClient();
      const monthStart = startOfMonth(new Date());

      const { data } = await supabase
        .from('calls')
        .select('status, disposition')
        .gte('created_at', monthStart.toISOString());

      const outcomes: Record<string, number> = {
        answered: 0,
        missed: 0,
        voicemail: 0,
        appointment: 0,
      };

      const calls = (data || []) as { status: string; disposition: string | null }[];
      calls.forEach((call) => {
        if (call.status === 'completed') {
          if (call.disposition === 'appointment_booked' || call.disposition === 'meeting_booked') {
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

// Hook for recent inbound calls
function useRecentInboundCalls(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-inbound-calls', limit],
    queryFn: async (): Promise<CallRecord[]> => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('calls')
        .select('*')
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

  // Check onboarding status (you can expand this with real checks)
  const hasCompletedOnboarding = user?.user_metadata?.onboarding_complete || false;
  const hasConfiguredVoiceAI = user?.user_metadata?.voice_ai_configured || false;
  const hasConnectedCalendar = user?.user_metadata?.calendar_connected || false;
  const hasMadeTestCall = !isNewUser; // If they have calls, they've tested

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

      <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Getting Started Checklist for New Users */}
        {isNewUser && (
          <GettingStartedChecklist
            hasCompletedOnboarding={hasCompletedOnboarding}
            hasConfiguredVoiceAI={hasConfiguredVoiceAI}
            hasConnectedCalendar={hasConnectedCalendar}
            hasMadeTestCall={hasMadeTestCall}
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Calls Today"
                value={stats?.callsToday?.toString() || '0'}
                icon={PhoneIncoming}
                description={`${stats?.callsThisWeek || 0} this week`}
              />
              <StatsCard
                title="Appointments Booked"
                value={stats?.appointmentsBooked?.toString() || '0'}
                icon={Calendar}
                trend={{ value: 15, isPositive: true }}
                description="this month"
              />
              <StatsCard
                title="Avg Call Duration"
                value={formatDuration(stats?.avgDuration || 0)}
                icon={Clock}
                description="this month"
              />
              <StatsCard
                title="Answer Rate"
                value={`${stats?.answerRate || 0}%`}
                icon={TrendingUp}
                trend={{ value: 5, isPositive: true }}
                description="AI performance"
              />
            </>
          )}
        </div>

        {/* AI Agent Status Card */}
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-base sm:text-lg">AI Receptionist</h3>
                    <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Answering calls 24/7<span className="hidden sm:inline"> and booking appointments automatically</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-1.5 sm:mr-2 h-4 w-4" />
                    Configure
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                  <Link href="/#demo">
                    <PlayCircle className="mr-1.5 sm:mr-2 h-4 w-4" />
                    Test Call
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Calls */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Calls</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/calls">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {callsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentCalls && recentCalls.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {recentCalls.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      className="flex items-start sm:items-center justify-between rounded-lg border p-2.5 sm:p-3 hover:bg-muted/50 transition-colors gap-2"
                    >
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className={`rounded-full p-1.5 sm:p-2 flex-shrink-0 ${
                          call.status === 'completed' ? 'bg-green-100' :
                          call.status === 'voicemail' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Phone className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                            call.status === 'completed' ? 'text-green-600' :
                            call.status === 'voicemail' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{call.phone_number || 'Unknown Caller'}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {format(new Date(call.created_at), 'MMM d, h:mm a')}
                            {call.duration && ` • ${formatDuration(call.duration)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <CallStatusBadge status={call.status} />
                        {call.recording_url && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                            <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <PhoneIncoming className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="font-medium text-muted-foreground">No calls yet</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Calls will appear here once your AI starts receiving them
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/#demo">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Try a Test Call
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/meetings">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {appointments.map((apt) => {
                    const scheduledDate = parseISO(apt.scheduled_at);
                    const isToday_ = isToday(scheduledDate);

                    return (
                      <div
                        key={apt.id}
                        className="flex items-start sm:items-center justify-between rounded-lg border p-2.5 sm:p-3 hover:bg-muted/50 transition-colors gap-2"
                      >
                        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className="rounded-full p-1.5 sm:p-2 bg-primary-100 flex-shrink-0">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base truncate">
                              {apt.meeting_type || 'Appointment'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {format(scheduledDate, 'MMM d')} at {format(scheduledDate, 'h:mm a')}
                              {' • '}{apt.duration} min
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
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="font-medium text-muted-foreground">No upcoming appointments</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Appointments booked by your AI will appear here
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/settings?tab=integrations">
                      <Settings className="mr-2 h-4 w-4" />
                      Connect Calendar
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Getting the Most from Your AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Update Your Services</p>
                  <p className="text-sm text-muted-foreground">
                    Keep your service list current so the AI can accurately answer questions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Review Call Recordings</p>
                  <p className="text-sm text-muted-foreground">
                    Listen to calls to understand how the AI handles different scenarios
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Set Your Hours</p>
                  <p className="text-sm text-muted-foreground">
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
