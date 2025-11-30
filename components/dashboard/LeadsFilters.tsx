"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { LeadFilters, LeadStatus, LeadScore } from "@/lib/types";
import { industries, states } from "@/lib/mock-data";

interface LeadsFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

const statusOptions: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "meeting_scheduled", label: "Meeting Scheduled" },
  { value: "not_interested", label: "Not Interested" },
  { value: "no_answer", label: "No Answer" },
];

const scoreOptions: { value: LeadScore | "all"; label: string }[] = [
  { value: "all", label: "All Scores" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

export default function LeadsFilters({
  filters,
  onFiltersChange,
  showAdvanced,
  onToggleAdvanced,
}: LeadsFiltersProps) {
  const updateFilter = <K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      score: "all",
      industry: "all",
      state: "all",
      minRating: null,
      maxRating: null,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.score !== "all" ||
    filters.industry !== "all" ||
    filters.state !== "all" ||
    filters.minRating !== null ||
    filters.maxRating !== null;

  return (
    <div className="space-y-4">
      {/* Main filter bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search businesses, contacts, cities..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Quick filters */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value as LeadStatus | "all")}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.score}
          onChange={(e) => updateFilter("score", e.target.value as LeadScore | "all")}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {scoreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Advanced filters toggle */}
        <button
          onClick={onToggleAdvanced}
          className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
            showAdvanced
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex h-10 items-center gap-1 rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Advanced filters panel */}
      {showAdvanced && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Industry */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => updateFilter("industry", e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) => updateFilter("state", e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Min Google Rating
              </label>
              <select
                value={filters.minRating ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "minRating",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">No minimum</option>
                <option value="1">1.0+</option>
                <option value="2">2.0+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3.0+</option>
                <option value="3.5">3.5+</option>
                <option value="4">4.0+</option>
              </select>
            </div>

            {/* Max Rating */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Max Google Rating
              </label>
              <select
                value={filters.maxRating ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "maxRating",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">No maximum</option>
                <option value="2">Under 2.0</option>
                <option value="2.5">Under 2.5</option>
                <option value="3">Under 3.0</option>
                <option value="3.5">Under 3.5</option>
                <option value="4">Under 4.0</option>
                <option value="4.5">Under 4.5</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
