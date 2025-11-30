// Lead types
export interface Lead {
  id: string;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  city: string;
  state: string;
  zip: string | null;
  industry: string;
  googleRating: number | null;
  reviewCount: number | null;
  website: string | null;
  employeeCount: string | null;
  yearEstablished: number | null;
  status: LeadStatus;
  score: LeadScore;
  lastContacted: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "meeting_scheduled"
  | "not_interested"
  | "no_answer"
  | "invalid";

export type LeadScore = "hot" | "warm" | "cold";

export interface LeadFilters {
  search: string;
  status: LeadStatus | "all";
  score: LeadScore | "all";
  industry: string | "all";
  state: string | "all";
  minRating: number | null;
  maxRating: number | null;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  leadsCount: number;
  contactedCount: number;
  respondedCount: number;
  meetingsBooked: number;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignType = "phone" | "email" | "multi_channel";

// Outreach/Call types
export interface OutreachCall {
  id: string;
  leadId: string;
  lead: Lead;
  campaignId: string | null;
  status: CallStatus;
  duration: number | null; // seconds
  transcript: string | null;
  summary: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  meetingBooked: boolean;
  createdAt: string;
}

export type CallStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "no_answer"
  | "voicemail"
  | "failed";

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  company: string | null;
  plan: "leads" | "outreach" | "whitelabel";
  createdAt: string;
}

// Analytics types
export interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  totalContacted: number;
  responseRate: number;
  meetingsBooked: number;
  conversionRate: number;
}
