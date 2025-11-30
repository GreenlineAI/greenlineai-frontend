'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { CallsLineChart } from '@/components/charts/CallsLineChart';
import { LeadStatusChart } from '@/components/charts/LeadStatusChart';
import { CallOutcomesChart } from '@/components/charts/CallOutcomesChart';
import {
  useDashboardStats,
  useDailyCallStats,
  useCallOutcomes,
  useLeadStatusDistribution,
} from '@/hooks/use-analytics';
import { useCampaigns } from '@/hooks/use-campaigns';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30');

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dailyStats, isLoading: dailyLoading } = useDailyCallStats(parseInt(dateRange));
  const { data: callOutcomes, isLoading: outcomesLoading } = useCallOutcomes();
  const { data: leadStatus, isLoading: statusLoading } = useLeadStatusDistribution();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  const handleExport = () => {
    toast.info('Export feature coming soon');
  };

  // Calculate conversion funnel
  const totalLeads = stats?.totalLeads || 0;
  const contacted = stats?.totalContacted || 0;
  const meetings = stats?.meetingsBooked || 0;
  const contactRate = totalLeads > 0 ? ((contacted / totalLeads) * 100).toFixed(1) : '0';
  const conversionRate = contacted > 0 ? ((meetings / contacted) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Analytics"
          description="Track your lead generation performance"
          actions={
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          }
        />
      </div>

      <main className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{totalLeads}</p>
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      +{stats?.leadsThisMonth || 0}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Contact Rate</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{contactRate}%</p>
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      +3.2%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">vs last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{conversionRate}%</p>
                    <span className="flex items-center text-sm font-medium text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      -0.5%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">vs last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Meetings Booked</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{meetings}</p>
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      +8
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">this month</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CallsLineChart
            data={dailyStats || []}
            isLoading={dailyLoading}
            title={`Calls (Last ${dateRange} Days)`}
          />
          <CallOutcomesChart
            data={callOutcomes || []}
            isLoading={outcomesLoading}
            title="Call Outcomes"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadStatusChart
            data={leadStatus || []}
            isLoading={statusLoading}
            title="Lead Status Distribution"
          />

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Leads</span>
                    <span className="font-medium">{totalLeads}</span>
                  </div>
                  <div className="h-8 w-full rounded bg-primary/20">
                    <div
                      className="h-full rounded bg-primary transition-all"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Contacted</span>
                    <span className="font-medium">
                      {contacted} ({contactRate}%)
                    </span>
                  </div>
                  <div className="h-8 w-full rounded bg-blue-100">
                    <div
                      className="h-full rounded bg-blue-500 transition-all"
                      style={{ width: `${contactRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Interested</span>
                    <span className="font-medium">
                      {Math.round(contacted * 0.3)} ({((contacted * 0.3 / totalLeads) * 100 || 0).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-8 w-full rounded bg-green-100">
                    <div
                      className="h-full rounded bg-green-500 transition-all"
                      style={{ width: `${(contacted * 0.3 / totalLeads) * 100 || 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meeting Booked</span>
                    <span className="font-medium">
                      {meetings} ({((meetings / totalLeads) * 100 || 0).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-8 w-full rounded bg-purple-100">
                    <div
                      className="h-full rounded bg-purple-500 transition-all"
                      style={{ width: `${(meetings / totalLeads) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Campaign
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Leads
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Contacted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Response Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Meetings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {campaigns && campaigns.length > 0 ? (
                      campaigns.map((campaign) => {
                        const responseRate = campaign.contactedCount > 0
                          ? ((campaign.respondedCount / campaign.contactedCount) * 100).toFixed(1)
                          : '0';
                        const convRate = campaign.contactedCount > 0
                          ? ((campaign.meetingsBooked / campaign.contactedCount) * 100).toFixed(1)
                          : '0';

                        return (
                          <tr key={campaign.id}>
                            <td className="px-4 py-4 font-medium">{campaign.name}</td>
                            <td className="px-4 py-4 text-muted-foreground">{campaign.leadsCount}</td>
                            <td className="px-4 py-4 text-muted-foreground">{campaign.contactedCount}</td>
                            <td className="px-4 py-4 text-muted-foreground">{responseRate}%</td>
                            <td className="px-4 py-4 text-muted-foreground">{campaign.meetingsBooked}</td>
                            <td className="px-4 py-4 text-muted-foreground">{convRate}%</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No campaigns yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
