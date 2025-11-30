"use client";

import { Bell, Search } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent-500" />
          </button>

          {/* Custom actions */}
          {actions}
        </div>
      </div>
    </header>
  );
}
