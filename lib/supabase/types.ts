export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'meeting_scheduled'
  | 'not_interested'
  | 'no_answer'
  | 'invalid'

export type LeadScore = 'hot' | 'warm' | 'cold'

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'
export type CampaignType = 'phone' | 'email' | 'multi_channel'

export type CallStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'no_answer'
  | 'voicemail'
  | 'failed'

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          plan: 'leads' | 'outreach' | 'whitelabel'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company?: string | null
          plan?: 'leads' | 'outreach' | 'whitelabel'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          plan?: 'leads' | 'outreach' | 'whitelabel'
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          business_name: string
          contact_name: string | null
          email: string | null
          phone: string
          address: string | null
          city: string
          state: string
          zip: string | null
          industry: string
          google_rating: number | null
          review_count: number | null
          website: string | null
          employee_count: string | null
          year_established: number | null
          status: LeadStatus
          score: LeadScore
          last_contacted: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          contact_name?: string | null
          email?: string | null
          phone: string
          address?: string | null
          city: string
          state: string
          zip?: string | null
          industry: string
          google_rating?: number | null
          review_count?: number | null
          website?: string | null
          employee_count?: string | null
          year_established?: number | null
          status?: LeadStatus
          score?: LeadScore
          last_contacted?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string
          address?: string | null
          city?: string
          state?: string
          zip?: string | null
          industry?: string
          google_rating?: number | null
          review_count?: number | null
          website?: string | null
          employee_count?: string | null
          year_established?: number | null
          status?: LeadStatus
          score?: LeadScore
          last_contacted?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          status: CampaignStatus
          type: CampaignType
          leads_count: number
          contacted_count: number
          responded_count: number
          meetings_booked: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: CampaignStatus
          type: CampaignType
          leads_count?: number
          contacted_count?: number
          responded_count?: number
          meetings_booked?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          status?: CampaignStatus
          type?: CampaignType
          leads_count?: number
          contacted_count?: number
          responded_count?: number
          meetings_booked?: number
          updated_at?: string
        }
      }
      outreach_calls: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          campaign_id: string | null
          status: CallStatus
          duration: number | null
          transcript: string | null
          summary: string | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          meeting_booked: boolean
          vapi_call_id: string | null
          recording_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          campaign_id?: string | null
          status?: CallStatus
          duration?: number | null
          transcript?: string | null
          summary?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          meeting_booked?: boolean
          vapi_call_id?: string | null
          recording_url?: string | null
          created_at?: string
        }
        Update: {
          status?: CallStatus
          duration?: number | null
          transcript?: string | null
          summary?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          meeting_booked?: boolean
          vapi_call_id?: string | null
          recording_url?: string | null
        }
      }
      call_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          calls_made: number
          calls_connected: number
          avg_duration: number
          meetings_booked: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          calls_made?: number
          calls_connected?: number
          avg_duration?: number
          meetings_booked?: number
          created_at?: string
        }
        Update: {
          calls_made?: number
          calls_connected?: number
          avg_duration?: number
          meetings_booked?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_status: LeadStatus
      lead_score: LeadScore
      campaign_status: CampaignStatus
      campaign_type: CampaignType
      call_status: CallStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
