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
  lead?: Lead;
  campaignId: string | null;
  campaign?: Campaign;
  status: CallStatus;
  duration: number | null; // seconds
  transcript: string | null;
  summary: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  meetingBooked: boolean;
  vapiCallId: string | null;
  recordingUrl: string | null;
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
  callsToday: number;
  callsThisWeek: number;
}

export interface CallAnalytics {
  id: string;
  date: string;
  callsMade: number;
  callsConnected: number;
  avgDuration: number;
  meetingsBooked: number;
}

export interface DailyCallStats {
  date: string;
  calls: number;
  connected: number;
  meetings: number;
}

export interface CallOutcome {
  name: string;
  value: number;
  color: string;
}

export interface LeadStatusDistribution {
  status: LeadStatus;
  count: number;
  color: string;
}

// Dialer types
export interface DialerSession {
  campaignId: string | null;
  queue: Lead[];
  currentIndex: number;
  isAutoDialing: boolean;
  isPaused: boolean;
  callsCompleted: number;
  meetingsBooked: number;
}

export interface ActiveCall {
  lead: Lead;
  status: "ringing" | "connected" | "ended";
  startTime: Date;
  duration: number;
  transcript: TranscriptEntry[];
  vapiCallId: string | null;
}

export interface TranscriptEntry {
  speaker: "ai" | "human";
  text: string;
  timestamp: number;
}

// Disposition types
export type CallDisposition =
  | "meeting_booked"
  | "interested_follow_up"
  | "not_interested"
  | "no_answer"
  | "wrong_number"
  | "call_back_later"
  | "voicemail";

// Settings types
export interface VoiceSettings {
  vapiApiKey: string;
  assistantId: string;
  phoneNumberId: string;
  voiceGender: "male" | "female";
  recordingEnabled: boolean;
  openingScript: string;
  voicemailMessage: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  slackWebhook: string | null;
  calendarIntegration: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: number[];
  callDelaySeconds: number;
  dailyCallLimit: number;
}
