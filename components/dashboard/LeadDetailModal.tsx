"use client";

import { X, Phone, Mail, MapPin, Globe, Star, Calendar, MessageSquare, PhoneCall } from "lucide-react";
import { Lead } from "@/lib/types";

interface LeadDetailModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onCall: () => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onCall,
}: LeadDetailModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.businessName}</h2>
            <p className="text-sm text-slate-500">{lead.industry}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status badges */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                lead.score === "hot"
                  ? "bg-green-100 text-green-700"
                  : lead.score === "warm"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {lead.score.charAt(0).toUpperCase() + lead.score.slice(1)} Lead
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {lead.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold text-slate-900">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lead.contactName && (
                <div>
                  <p className="text-sm text-slate-500">Contact Name</p>
                  <p className="font-medium text-slate-900">{lead.contactName}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
              {lead.email && (
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}
              {lead.website && (
                <div>
                  <p className="text-sm text-slate-500">Website</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <a
                      href={`https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {lead.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold text-slate-900">Location</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">{lead.address}</p>
                <p className="text-slate-600">
                  {lead.city}, {lead.state} {lead.zip}
                </p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold text-slate-900">Business Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {lead.googleRating && (
                <div>
                  <p className="text-sm text-slate-500">Google Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-slate-900">{lead.googleRating}</span>
                    <span className="text-sm text-slate-500">({lead.reviewCount})</span>
                  </div>
                </div>
              )}
              {lead.employeeCount && (
                <div>
                  <p className="text-sm text-slate-500">Employees</p>
                  <p className="font-medium text-slate-900">{lead.employeeCount}</p>
                </div>
              )}
              {lead.yearEstablished && (
                <div>
                  <p className="text-sm text-slate-500">Established</p>
                  <p className="font-medium text-slate-900">{lead.yearEstablished}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Added</p>
                <p className="font-medium text-slate-900">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold text-slate-900">Activity</h3>
            <div className="space-y-3">
              {lead.lastContacted ? (
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary-100 p-2">
                    <Phone className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Last Contacted</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(lead.lastContacted)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No contact attempts yet</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-4 font-semibold text-slate-900">Notes</h3>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5" />
                <p className="text-slate-600">{lead.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={onCall}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <PhoneCall className="h-4 w-4" />
            Call with AI
          </button>
        </div>
      </div>
    </div>
  );
}
