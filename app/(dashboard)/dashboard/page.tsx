import { Users, Phone, Calendar, TrendingUp } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { mockDashboardStats, mockLeads, mockCampaigns } from "@/lib/mock-data";

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const recentLeads = mockLeads.slice(0, 5);
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active");

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back, Marcus"
      />

      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            change={`+${stats.leadsThisMonth} this month`}
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Contacted"
            value={stats.totalContacted.toLocaleString()}
            change={`${stats.responseRate}% response rate`}
            changeType="neutral"
            icon={Phone}
            iconColor="bg-accent-100 text-accent-600"
          />
          <StatsCard
            title="Meetings Booked"
            value={stats.meetingsBooked}
            change="+12 this week"
            changeType="positive"
            icon={Calendar}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change="+2.3% from last month"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Recent Leads</h2>
              <a
                href="/dashboard/leads"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{lead.businessName}</p>
                    <p className="text-sm text-slate-500">
                      {lead.city}, {lead.state} &bull; {lead.industry}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        lead.score === "hot"
                          ? "bg-green-100 text-green-700"
                          : lead.score === "warm"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lead.score}
                    </span>
                    {lead.googleRating && (
                      <span className="text-sm text-slate-500">
                        {lead.googleRating} ★
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Active Campaigns</h2>
              <a
                href="/dashboard/campaigns"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span>{campaign.leadsCount} leads</span>
                    <span>{campaign.contactedCount} contacted</span>
                    <span>{campaign.meetingsBooked} meetings</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-primary-600"
                      style={{
                        width: `${(campaign.contactedCount / campaign.leadsCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {activeCampaigns.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500">
                  No active campaigns
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
