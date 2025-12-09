export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          status: 'new' | 'contacted' | 'interested' | 'meeting_scheduled' | 'not_interested' | 'no_answer' | 'invalid'
          score: 'hot' | 'warm' | 'cold'
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
          status?: 'new' | 'contacted' | 'interested' | 'meeting_scheduled' | 'not_interested' | 'no_answer' | 'invalid'
          score?: 'hot' | 'warm' | 'cold'
          last_contacted?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
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
          status?: 'new' | 'contacted' | 'interested' | 'meeting_scheduled' | 'not_interested' | 'no_answer' | 'invalid'
          score?: 'hot' | 'warm' | 'cold'
          last_contacted?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          status: 'draft' | 'active' | 'paused' | 'completed'
          type: 'phone' | 'email' | 'multi_channel'
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
          status?: 'draft' | 'active' | 'paused' | 'completed'
          type: 'phone' | 'email' | 'multi_channel'
          leads_count?: number
          contacted_count?: number
          responded_count?: number
          meetings_booked?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          status?: 'draft' | 'active' | 'paused' | 'completed'
          type?: 'phone' | 'email' | 'multi_channel'
          leads_count?: number
          contacted_count?: number
          responded_count?: number
          meetings_booked?: number
          created_at?: string
          updated_at?: string
        }
      }
      outreach_calls: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          campaign_id: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'no_answer' | 'voicemail' | 'failed'
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
          status?: 'pending' | 'in_progress' | 'completed' | 'no_answer' | 'voicemail' | 'failed'
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
          id?: string
          user_id?: string
          lead_id?: string
          campaign_id?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'no_answer' | 'voicemail' | 'failed'
          duration?: number | null
          transcript?: string | null
          summary?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          meeting_booked?: boolean
          vapi_call_id?: string | null
          recording_url?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          call_id: string | null
          scheduled_at: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_type: string
          location: string | null
          notes: string | null
          reminder_sent: boolean
          calendly_event_uri: string | null
          calendly_invitee_uri: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          call_id?: string | null
          scheduled_at: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_type?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string
          call_id?: string | null
          scheduled_at?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_type?: string
          location?: string | null
          notes?: string | null
          reminder_sent?: boolean
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_leads: {
        Row: {
          campaign_id: string
          lead_id: string
          added_at: string
        }
        Insert: {
          campaign_id: string
          lead_id: string
          added_at?: string
        }
        Update: {
          campaign_id?: string
          lead_id?: string
          added_at?: string
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
          id?: string
          user_id?: string
          date?: string
          calls_made?: number
          calls_connected?: number
          avg_duration?: number
          meetings_booked?: number
          created_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          user_id: string
          lead_id: string | null
          phone_number: string
          status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'voicemail'
          disposition: string | null
          duration: number | null
          transcript: string | null
          recording_url: string | null
          vapi_call_id: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id?: string | null
          phone_number: string
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'voicemail'
          disposition?: string | null
          duration?: number | null
          transcript?: string | null
          recording_url?: string | null
          vapi_call_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string | null
          phone_number?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'voicemail'
          disposition?: string | null
          duration?: number | null
          transcript?: string | null
          recording_url?: string | null
          vapi_call_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_onboarding: {
        Row: {
          id: string
          user_id: string | null
          business_name: string
          business_type: 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other'
          business_type_other: string | null
          owner_name: string
          email: string
          phone: string
          website: string | null
          city: string
          state: string
          zip: string | null
          service_radius_miles: number
          services: string[]
          hours_monday: string | null
          hours_tuesday: string | null
          hours_wednesday: string | null
          hours_thursday: string | null
          hours_friday: string | null
          hours_saturday: string | null
          hours_sunday: string | null
          greeting_name: string | null
          preferred_voice: string
          appointment_duration: number
          calendar_link: string | null
          pricing_info: string | null
          special_instructions: string | null
          phone_preference: 'new' | 'forward' | 'port'
          existing_phone_number: string | null
          current_phone_provider: string | null
          retell_agent_id: string | null
          retell_phone_number: string | null
          status: 'pending' | 'in_review' | 'agent_created' | 'active' | 'paused'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          business_name: string
          business_type: 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other'
          business_type_other?: string | null
          owner_name: string
          email: string
          phone: string
          website?: string | null
          city: string
          state: string
          zip?: string | null
          service_radius_miles?: number
          services: string[]
          hours_monday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          hours_thursday?: string | null
          hours_friday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          greeting_name?: string | null
          preferred_voice?: string
          appointment_duration?: number
          calendar_link?: string | null
          pricing_info?: string | null
          special_instructions?: string | null
          phone_preference?: 'new' | 'forward' | 'port'
          existing_phone_number?: string | null
          current_phone_provider?: string | null
          retell_agent_id?: string | null
          retell_phone_number?: string | null
          status?: 'pending' | 'in_review' | 'agent_created' | 'active' | 'paused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          business_name?: string
          business_type?: 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other'
          business_type_other?: string | null
          owner_name?: string
          email?: string
          phone?: string
          website?: string | null
          city?: string
          state?: string
          zip?: string | null
          service_radius_miles?: number
          services?: string[]
          hours_monday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          hours_thursday?: string | null
          hours_friday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          greeting_name?: string | null
          preferred_voice?: string
          appointment_duration?: number
          calendar_link?: string | null
          pricing_info?: string | null
          special_instructions?: string | null
          phone_preference?: 'new' | 'forward' | 'port'
          existing_phone_number?: string | null
          current_phone_provider?: string | null
          retell_agent_id?: string | null
          retell_phone_number?: string | null
          status?: 'pending' | 'in_review' | 'agent_created' | 'active' | 'paused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'google_calendar' | 'slack' | 'hubspot' | 'salesforce'
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          provider_user_id: string | null
          provider_email: string | null
          metadata: Json
          connected_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'google_calendar' | 'slack' | 'hubspot' | 'salesforce'
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          provider_user_id?: string | null
          provider_email?: string | null
          metadata?: Json
          connected_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'google_calendar' | 'slack' | 'hubspot' | 'salesforce'
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          provider_user_id?: string | null
          provider_email?: string | null
          metadata?: Json
          connected_at?: string
          created_at?: string
          updated_at?: string
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
      lead_status: 'new' | 'contacted' | 'interested' | 'meeting_scheduled' | 'not_interested' | 'no_answer' | 'invalid'
      lead_score: 'hot' | 'warm' | 'cold'
      campaign_status: 'draft' | 'active' | 'paused' | 'completed'
      campaign_type: 'phone' | 'email' | 'multi_channel'
      call_status: 'pending' | 'in_progress' | 'completed' | 'no_answer' | 'voicemail' | 'failed'
      user_plan: 'leads' | 'outreach' | 'whitelabel'
      onboarding_status: 'pending' | 'in_review' | 'agent_created' | 'active' | 'paused'
      business_type: 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other'
      phone_setup_preference: 'new' | 'forward' | 'port'
    }
  }
}
