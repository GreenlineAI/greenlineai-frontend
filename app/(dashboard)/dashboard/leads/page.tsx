"use client";

import { useState, useMemo } from "react";
import { Plus, Download, Upload, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeadsTable from "@/components/dashboard/LeadsTable";
import LeadsFilters from "@/components/dashboard/LeadsFilters";
import { useLeads } from "@/lib/supabase/use-leads";
import { Lead } from "@/lib/types";
import { LeadFilters } from "@/lib/types";

export default function LeadsPage() {
  const { leads, loading, usingMockData, deleteLead } = useLeads();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    status: "all",
    score: "all",
    industry: "all",
    state: "all",
    minRating: null,
    maxRating: null,
  });

  // Filter leads based on current filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          lead.businessName.toLowerCase().includes(searchLower) ||
          lead.contactName?.toLowerCase().includes(searchLower) ||
          lead.city.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone.includes(filters.search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && lead.status !== filters.status) {
        return false;
      }

      // Score filter
      if (filters.score !== "all" && lead.score !== filters.score) {
        return false;
      }

      // Industry filter
      if (filters.industry !== "all" && lead.industry !== filters.industry) {
        return false;
      }

      // State filter
      if (filters.state !== "all" && lead.state !== filters.state) {
        return false;
      }

      // Rating filters
      if (filters.minRating !== null) {
        if (!lead.googleRating || lead.googleRating < filters.minRating) {
          return false;
        }
      }
      if (filters.maxRating !== null) {
        if (!lead.googleRating || lead.googleRating >= filters.maxRating) {
          return false;
        }
      }

      return true;
    });
  }, [leads, filters]);

  const handleViewLead = (lead: Lead) => {
    // TODO: Open lead detail modal or navigate to detail page
    console.log("View lead:", lead);
  };

  const handleCallLead = (lead: Lead) => {
    // TODO: Initiate AI call
    console.log("Call lead:", lead);
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (confirm(`Are you sure you want to delete ${lead.businessName}?`)) {
      await deleteLead(lead.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="Leads" subtitle="Loading..." />
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Leads"
        subtitle={`${filteredLeads.length} of ${leads.length} leads`}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        }
      />

      <main className="p-6 space-y-6">
        {/* Demo data notice */}
        {usingMockData && (
          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Showing demo data. Run the schema.sql in your Supabase SQL editor to set up the database.
            </p>
          </div>
        )}

        {/* Filters */}
        <LeadsFilters
          filters={filters}
          onFiltersChange={setFilters}
          showAdvanced={showAdvancedFilters}
          onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />

        {/* Quick stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-slate-600">
              Hot: {leads.filter((l) => l.score === "hot").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-slate-600">
              Warm: {leads.filter((l) => l.score === "warm").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="text-slate-600">
              Cold: {leads.filter((l) => l.score === "cold").length}
            </span>
          </div>
          <div className="text-slate-400">|</div>
          <div className="text-slate-600">
            {leads.filter((l) => l.status === "meeting_scheduled").length} meetings scheduled
          </div>
        </div>

        {/* Leads Table */}
        <LeadsTable
          leads={filteredLeads}
          onViewLead={handleViewLead}
          onCallLead={handleCallLead}
          onDeleteLead={handleDeleteLead}
        />

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400"
            >
              Previous
            </button>
            <button
              disabled
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
