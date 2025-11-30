import { Phone, Clock, CheckCircle, XCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Mock outreach calls
const mockCalls = [
  {
    id: "1",
    businessName: "Green Valley Landscaping",
    phone: "(512) 555-0101",
    status: "completed",
    duration: 145,
    outcome: "Meeting Scheduled",
    time: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    businessName: "Premier Lawn Care",
    phone: "(214) 555-0102",
    status: "completed",
    duration: 32,
    outcome: "Not Interested",
    time: "2024-01-15T14:15:00Z",
  },
  {
    id: "3",
    businessName: "Sunrise Garden Services",
    phone: "(713) 555-0103",
    status: "no_answer",
    duration: 0,
    outcome: "No Answer",
    time: "2024-01-15T14:00:00Z",
  },
  {
    id: "4",
    businessName: "Desert Oasis Landscaping",
    phone: "(602) 555-0104",
    status: "completed",
    duration: 210,
    outcome: "Interested - Follow Up",
    time: "2024-01-15T13:45:00Z",
  },
  {
    id: "5",
    businessName: "Rocky Mountain Mowing",
    phone: "(303) 555-0105",
    status: "voicemail",
    duration: 45,
    outcome: "Left Voicemail",
    time: "2024-01-15T13:30:00Z",
  },
];

export default function OutreachPage() {
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Outreach"
        subtitle="Recent AI calls and conversations"
      />

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2">
                <Phone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">47</p>
                <p className="text-sm text-slate-500">Calls Today</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">32</p>
                <p className="text-sm text-slate-500">Connected</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-100 p-2">
                <Clock className="h-5 w-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">2:34</p>
                <p className="text-sm text-slate-500">Avg Duration</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <XCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">8</p>
                <p className="text-sm text-slate-500">Meetings Booked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Recent Calls</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {mockCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      call.status === "completed"
                        ? "bg-green-100"
                        : call.status === "no_answer"
                        ? "bg-slate-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <Phone
                      className={`h-4 w-4 ${
                        call.status === "completed"
                          ? "text-green-600"
                          : call.status === "no_answer"
                          ? "text-slate-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{call.businessName}</p>
                    <p className="text-sm text-slate-500">{call.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{call.outcome}</p>
                    <p className="text-sm text-slate-500">
                      {formatDuration(call.duration)} &bull; {formatTime(call.time)}
                    </p>
                  </div>
                  <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    View Transcript
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
