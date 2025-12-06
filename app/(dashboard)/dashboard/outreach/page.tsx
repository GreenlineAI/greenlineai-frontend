'use client';

import Link from 'next/link';
import {
  Users,
  Phone,
  Calendar,
  TrendingUp,
  PhoneCall,
  Upload,
  Flame,
  ArrowRight,
  Clock,
  Building,
  Sparkles,
  FileSpreadsheet,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/shared/StatsCard';
import { LeadScoreBadge, CampaignStatusBadge, CallStatusBadge } from '@/components/shared/StatusBadge';
import { CallsLineChart } from '@/components/charts/CallsLineChart';
import { CallOutcomesChart } from '@/components/charts/CallOutcomesChart';
import { useDashboardStats, useDailyCallStats, useCallOutcomes } from '@/hooks/use-analytics';
import { useLeads } from '@/hooks/use-leads';
import { useCampaigns } from '@/hooks/use-campaigns';
import { useRecentCalls } from '@/hooks/use-calls';
import { useUser } from '@/lib/supabase/hooks';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isToday } from 'date-fns';

interface Meeting {
  id: string;
  scheduled_at: string;
  duration: number;
  status: string;
  lead: {
    business_name: string;
    contact_name: string | null;
    phone: string;
  };
}

function UpcomingMeetingsWidget() {
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['upcoming-meetings'],
    queryFn: async () => {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          lead:leads(
            business_name,
            contact_name,
            phone
          )
        `)
        .gte('scheduled_at', now)
        .in('status', ['scheduled', 'confirmed'])
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Meeting[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">
        No upcoming meetings
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => {
        const scheduledDate = parseISO(meeting.scheduled_at);
        const isToday_ = isToday(scheduledDate);

        return (
          <div
            key={meeting.id}
            className="rounded-lg border p-3 space-y-2 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="font-medium truncate">{meeting.lead.business_name}</p>
                </div>
                {meeting.lead.contact_name && (
                  <p className="text-sm text-muted-foreground pl-6">
                    {meeting.lead.contact_name}
                  </p>
                )}
              </div>
              {isToday_ && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 flex-shrink-0">
                  Today
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground pl-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(scheduledDate, 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(scheduledDate, 'h:mm a')}</span>
              </div>
              <span>•</span>
              <span>{meeting.duration} min</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OutreachDashboardPage() {
  const { user } = useUser();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dailyStats, isLoading: dailyStatsLoading } = useDailyCallStats(30);
  const { data: callOutcomes, isLoading: outcomesLoading } = useCallOutcomes();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ page: 1, pageSize: 5 });
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: recentCalls, isLoading: callsLoading } = useRecentCalls(10);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const activeCampaigns = campaigns?.filter((c) => c.status === 'active') || [];

  // Check if user is completely new to outreach
  const isNewToOutreach = !statsLoading &&
    stats?.totalLeads === 0 &&
    (!recentCalls || recentCalls.length === 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outreach Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {userName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/leads">
                <Upload className="mr-2 h-4 w-4" />
                Import Leads
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/dialer">
                <PhoneCall className="mr-2 h-4 w-4" />
                Start Calling
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="p-6 space-y-6">
        {/* Welcome Card for New Users */}
        {isNewToOutreach && (
          <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-10 w-10 text-primary-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-xl font-semibold mb-2">Welcome to Outreach!</h3>
                  <p className="text-muted-foreground mb-4 max-w-lg">
                    Ready to book more meetings? Import your leads and let our AI help you reach out to potential customers efficiently.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Button asChild>
                      <Link href="/dashboard/leads">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Your First Leads
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/campaigns/new">
                        <Target className="mr-2 h-4 w-4" />
                        Create a Campaign
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                title="Total Leads"
                value={stats?.totalLeads?.toLocaleString() || '0'}
                icon={Users}
                trend={{ value: 12, isPositive: true }}
                description="vs last month"
              />
              <StatsCard
                title="Calls Today"
                value={stats?.callsToday?.toLocaleString() || '0'}
                icon={Phone}
                description={`${stats?.callsThisWeek || 0} this week`}
              />
              <StatsCard
                title="Meetings Booked"
                value={stats?.meetingsBooked?.toLocaleString() || '0'}
                icon={Calendar}
                trend={{ value: 8, isPositive: true }}
                description="this month"
              />
              <StatsCard
                title="Conversion Rate"
                value={`${stats?.conversionRate || 0}%`}
                icon={TrendingUp}
                trend={{ value: 2.3, isPositive: true }}
                description="vs last month"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link href="/dashboard/dialer">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  <span>Start Dialing</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link href="/dashboard/leads">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Import Leads</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link href="/dashboard/leads?score=hot">
                  <Flame className="h-5 w-5 text-red-500" />
                  <span>Hot Leads</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link href="/dashboard/campaigns/new">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>New Campaign</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CallsLineChart
            data={dailyStats || []}
            isLoading={dailyStatsLoading}
            title="Calls (Last 30 Days)"
          />
          <CallOutcomesChart
            data={callOutcomes || []}
            isLoading={outcomesLoading}
            title="Call Outcomes"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Leads */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Leads</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/leads">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {leadsData?.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{lead.businessName}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.city}, {lead.state}
                        </p>
                      </div>
                      <LeadScoreBadge score={lead.score} />
                    </div>
                  ))}
                  {(!leadsData?.leads || leadsData.leads.length === 0) && (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-primary-600" />
                      </div>
                      <p className="font-medium text-muted-foreground">No leads yet</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Import leads to start your outreach
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/leads">
                          <Upload className="mr-2 h-3 w-3" />
                          Import Leads
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Active Campaigns</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/campaigns">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {campaignsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCampaigns.slice(0, 3).map((campaign) => {
                    const progress = campaign.leadsCount > 0
                      ? (campaign.contactedCount / campaign.leadsCount) * 100
                      : 0;
                    return (
                      <div
                        key={campaign.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{campaign.name}</p>
                          <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{campaign.leadsCount} leads</span>
                          <span>{campaign.meetingsBooked} meetings</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                  {activeCampaigns.length === 0 && (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                        <Target className="h-6 w-6 text-primary-600" />
                      </div>
                      <p className="font-medium text-muted-foreground">No active campaigns</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Create a campaign to organize your outreach
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/campaigns/new">
                          <Calendar className="mr-2 h-3 w-3" />
                          New Campaign
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/meetings">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <UpcomingMeetingsWidget />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-1">
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
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCalls?.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {call.lead?.businessName || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(call.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CallStatusBadge status={call.status} />
                        {call.meetingBooked && (
                          <span className="text-xs text-green-600 font-medium">Booked</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!recentCalls || recentCalls.length === 0) && (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                        <Phone className="h-6 w-6 text-primary-600" />
                      </div>
                      <p className="font-medium text-muted-foreground">No calls yet</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Start dialing to see your call history
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/dialer">
                          <PhoneCall className="mr-2 h-3 w-3" />
                          Start Dialing
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
