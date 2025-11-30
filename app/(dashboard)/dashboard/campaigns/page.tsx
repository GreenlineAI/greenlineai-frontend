import { Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockCampaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Campaigns"
        subtitle="Manage your outreach campaigns"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        }
      />

      <main className="p-6">
        <div className="grid gap-6">
          {mockCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-slate-500 capitalize">
                    {campaign.type.replace("_", " ")} campaign
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    campaign.status === "active"
                      ? "bg-green-100 text-green-700"
                      : campaign.status === "paused"
                      ? "bg-yellow-100 text-yellow-700"
                      : campaign.status === "completed"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaign.leadsCount}
                  </p>
                  <p className="text-sm text-slate-500">Total Leads</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaign.contactedCount}
                  </p>
                  <p className="text-sm text-slate-500">Contacted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {campaign.respondedCount}
                  </p>
                  <p className="text-sm text-slate-500">Responded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {campaign.meetingsBooked}
                  </p>
                  <p className="text-sm text-slate-500">Meetings</p>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary-600"
                  style={{
                    width: `${(campaign.contactedCount / campaign.leadsCount) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {Math.round((campaign.contactedCount / campaign.leadsCount) * 100)}% complete
                </p>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    View Details
                  </button>
                  {campaign.status === "active" && (
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      Pause
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
