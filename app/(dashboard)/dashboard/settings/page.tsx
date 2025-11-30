"use client";

import { useState } from "react";
import { User, Building, CreditCard, Bell, Key, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Settings" subtitle="Manage your account settings" />

      <main className="p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Profile Settings
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Marcus"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Chen"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="marcus@growthstack.com"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="(512) 555-0100"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Current Plan
                  </h2>
                  <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Outreach Service</p>
                      <p className="text-sm text-slate-600">$750/month - 500 leads contacted</p>
                    </div>
                    <button className="rounded-lg border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Payment Method
                  </h2>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-500">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-500">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      Update
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Billing History
                  </h2>
                  <div className="space-y-3">
                    {[
                      { date: "Jan 1, 2024", amount: "$750.00", status: "Paid" },
                      { date: "Dec 1, 2023", amount: "$750.00", status: "Paid" },
                      { date: "Nov 1, 2023", amount: "$750.00", status: "Paid" },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{invoice.date}</p>
                          <p className="text-sm text-slate-500">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-600">{invoice.status}</span>
                          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "profile" && activeTab !== "billing" && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-400">
                    {tabs.find((t) => t.id === activeTab)?.label} settings coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
