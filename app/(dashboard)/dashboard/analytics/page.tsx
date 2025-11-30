import { TrendingUp, TrendingDown } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Analytics"
        subtitle="Track your lead generation performance"
      />

      <main className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">Contact Rate</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">85.2%</p>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                +3.2%
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">vs last month</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">Response Rate</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">18.5%</p>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                +1.8%
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">vs last month</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">Meeting Rate</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">15.1%</p>
              <span className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="h-4 w-4" />
                -0.5%
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">vs last month</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">Cost per Meeting</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">$47</p>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                -$8
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">vs last month</p>
          </div>
        </div>

        {/* Charts placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Leads Over Time</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-400">Chart coming soon</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Conversion Funnel</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-400">Chart coming soon</p>
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Campaign Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Leads
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Contacted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Response Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Meetings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Cost/Meeting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    Texas Landscapers Q1
                  </td>
                  <td className="px-4 py-4 text-slate-600">250</td>
                  <td className="px-4 py-4 text-slate-600">180</td>
                  <td className="px-4 py-4 text-slate-600">25%</td>
                  <td className="px-4 py-4 text-slate-600">12</td>
                  <td className="px-4 py-4 text-slate-600">$42</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    West Coast Outreach
                  </td>
                  <td className="px-4 py-4 text-slate-600">150</td>
                  <td className="px-4 py-4 text-slate-600">75</td>
                  <td className="px-4 py-4 text-slate-600">29%</td>
                  <td className="px-4 py-4 text-slate-600">8</td>
                  <td className="px-4 py-4 text-slate-600">$38</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    Email Nurture - Low Rating
                  </td>
                  <td className="px-4 py-4 text-slate-600">500</td>
                  <td className="px-4 py-4 text-slate-600">500</td>
                  <td className="px-4 py-4 text-slate-600">7%</td>
                  <td className="px-4 py-4 text-slate-600">5</td>
                  <td className="px-4 py-4 text-slate-600">$65</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
