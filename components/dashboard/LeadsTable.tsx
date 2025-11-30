"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  MoreHorizontal,
  Eye,
  PhoneCall,
  Trash2,
} from "lucide-react";
import { Lead, LeadStatus, LeadScore } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onViewLead?: (lead: Lead) => void;
  onCallLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  meeting_scheduled: "Meeting Scheduled",
  not_interested: "Not Interested",
  no_answer: "No Answer",
  invalid: "Invalid",
};

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  interested: "bg-green-100 text-green-700",
  meeting_scheduled: "bg-purple-100 text-purple-700",
  not_interested: "bg-red-100 text-red-700",
  no_answer: "bg-slate-100 text-slate-700",
  invalid: "bg-red-100 text-red-700",
};

const scoreColors: Record<LeadScore, string> = {
  hot: "bg-green-100 text-green-700",
  warm: "bg-yellow-100 text-yellow-700",
  cold: "bg-slate-100 text-slate-700",
};

export default function LeadsTable({
  leads,
  onViewLead,
  onCallLead,
  onDeleteLead,
}: LeadsTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Business
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Last Contact
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={cn(
                  "hover:bg-slate-50 transition-colors",
                  selectedLeads.includes(lead.id) && "bg-primary-50"
                )}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{lead.businessName}</p>
                    <p className="text-sm text-slate-500">{lead.industry}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {lead.contactName && (
                      <p className="text-sm text-slate-900">{lead.contactName}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <MapPin className="h-3 w-3" />
                    {lead.city}, {lead.state}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {lead.googleRating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-slate-900">
                        {lead.googleRating}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({lead.reviewCount})
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">No rating</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusColors[lead.status]
                    )}
                  >
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      scoreColors[lead.score]
                    )}
                  >
                    {lead.score}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">
                  {formatDate(lead.lastContacted)}
                </td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === lead.id ? null : lead.id)
                      }
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {openDropdown === lead.id && (
                      <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            onViewLead?.(lead);
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onCallLead?.(lead);
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <PhoneCall className="h-4 w-4" />
                          Call Now
                        </button>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => {
                            onDeleteLead?.(lead);
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500">No leads found matching your filters</p>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedLeads.length > 0 && (
        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-sm text-slate-600">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Add to Campaign
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Export Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
