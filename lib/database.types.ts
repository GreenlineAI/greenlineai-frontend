export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          login_count: number | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_onboarding: {
        Row: {
          appointment_duration: number | null
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          business_type_other: string | null
          calendar_link: string | null
          city: string
          created_at: string | null
          current_phone_provider: string | null
          email: string
          existing_phone_number: string | null
          greeting_name: string | null
          hours_friday: string | null
          hours_monday: string | null
          hours_saturday: string | null
          hours_sunday: string | null
          hours_thursday: string | null
          hours_tuesday: string | null
          hours_wednesday: string | null
          id: string
          notes: string | null
          owner_name: string
          phone: string
          phone_preference:
            | Database["public"]["Enums"]["phone_setup_preference"]
            | null
          preferred_voice: string | null
          pricing_info: string | null
          retell_agent_id: string | null
          retell_phone_number: string | null
          service_radius_miles: number | null
          services: string[]
          special_instructions: string | null
          state: string
          status: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          zip: string | null
        }
        Insert: {
          appointment_duration?: number | null
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          business_type_other?: string | null
          calendar_link?: string | null
          city: string
          created_at?: string | null
          current_phone_provider?: string | null
          email: string
          existing_phone_number?: string | null
          greeting_name?: string | null
          hours_friday?: string | null
          hours_monday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_thursday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          id?: string
          notes?: string | null
          owner_name: string
          phone: string
          phone_preference?:
            | Database["public"]["Enums"]["phone_setup_preference"]
            | null
          preferred_voice?: string | null
          pricing_info?: string | null
          retell_agent_id?: string | null
          retell_phone_number?: string | null
          service_radius_miles?: number | null
          services: string[]
          special_instructions?: string | null
          state: string
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip?: string | null
        }
        Update: {
          appointment_duration?: number | null
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"]
          business_type_other?: string | null
          calendar_link?: string | null
          city?: string
          created_at?: string | null
          current_phone_provider?: string | null
          email?: string
          existing_phone_number?: string | null
          greeting_name?: string | null
          hours_friday?: string | null
          hours_monday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_thursday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          id?: string
          notes?: string | null
          owner_name?: string
          phone?: string
          phone_preference?:
            | Database["public"]["Enums"]["phone_setup_preference"]
            | null
          preferred_voice?: string | null
          pricing_info?: string | null
          retell_agent_id?: string | null
          retell_phone_number?: string | null
          service_radius_miles?: number | null
          services?: string[]
          special_instructions?: string | null
          state?: string
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_analytics: {
        Row: {
          avg_duration: number | null
          calls_connected: number | null
          calls_made: number | null
          created_at: string | null
          date: string
          id: string
          meetings_booked: number | null
          user_id: string
        }
        Insert: {
          avg_duration?: number | null
          calls_connected?: number | null
          calls_made?: number | null
          created_at?: string | null
          date: string
          id?: string
          meetings_booked?: number | null
          user_id: string
        }
        Update: {
          avg_duration?: number | null
          calls_connected?: number | null
          calls_made?: number | null
          created_at?: string | null
          date?: string
          id?: string
          meetings_booked?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_leads: {
        Row: {
          added_at: string | null
          campaign_id: string
          lead_id: string
        }
        Insert: {
          added_at?: string | null
          campaign_id: string
          lead_id: string
        }
        Update: {
          added_at?: string | null
          campaign_id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          contacted_count: number | null
          created_at: string | null
          id: string
          leads_count: number | null
          meetings_booked: number | null
          name: string
          responded_count: number | null
          settings: Json | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contacted_count?: number | null
          created_at?: string | null
          id?: string
          leads_count?: number | null
          meetings_booked?: number | null
          name: string
          responded_count?: number | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contacted_count?: number | null
          created_at?: string | null
          id?: string
          leads_count?: number | null
          meetings_booked?: number | null
          name?: string
          responded_count?: number | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          type?: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string
          connected_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          provider: string
          provider_email: string | null
          provider_user_id: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          business_name: string
          city: string
          contact_name: string | null
          created_at: string | null
          email: string | null
          employee_count: string | null
          google_rating: number | null
          id: string
          industry: string
          last_contacted: string | null
          notes: string | null
          phone: string
          review_count: number | null
          score: Database["public"]["Enums"]["lead_score"] | null
          state: string
          status: Database["public"]["Enums"]["lead_status"] | null
          updated_at: string | null
          user_id: string
          website: string | null
          year_established: number | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          city: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          employee_count?: string | null
          google_rating?: number | null
          id?: string
          industry: string
          last_contacted?: string | null
          notes?: string | null
          phone: string
          review_count?: number | null
          score?: Database["public"]["Enums"]["lead_score"] | null
          state: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          year_established?: number | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          employee_count?: string | null
          google_rating?: number | null
          id?: string
          industry?: string
          last_contacted?: string | null
          notes?: string | null
          phone?: string
          review_count?: number | null
          score?: Database["public"]["Enums"]["lead_score"] | null
          state?: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          year_established?: number | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          call_id: string | null
          created_at: string | null
          duration: number | null
          id: string
          lead_id: string
          location: string | null
          meeting_type: string | null
          notes: string | null
          reminder_sent: boolean | null
          scheduled_at: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id: string
          location?: string | null
          meeting_type?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id?: string
          location?: string | null
          meeting_type?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "outreach_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_calls: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          duration: number | null
          id: string
          lead_id: string
          meeting_booked: boolean | null
          recording_url: string | null
          sentiment: string | null
          status: Database["public"]["Enums"]["call_status"] | null
          summary: string | null
          transcript: string | null
          user_id: string
          vapi_call_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id: string
          meeting_booked?: boolean | null
          recording_url?: string | null
          sentiment?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: string | null
          transcript?: string | null
          user_id: string
          vapi_call_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id?: string
          meeting_booked?: boolean | null
          recording_url?: string | null
          sentiment?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: string | null
          transcript?: string | null
          user_id?: string
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_calls_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_calls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          payment_failed_at: string | null
          plan: Database["public"]["Enums"]["user_plan"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_period_end: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          payment_failed_at?: string | null
          plan?: Database["public"]["Enums"]["user_plan"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          payment_failed_at?: string | null
          plan?: Database["public"]["Enums"]["user_plan"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_authorized_user: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      user_owns_campaign: { Args: { campaign_id: string }; Returns: boolean }
      user_owns_lead: { Args: { lead_id: string }; Returns: boolean }
    }
    Enums: {
      business_type:
        | "landscaping"
        | "lawn_care"
        | "tree_service"
        | "hardscaping"
        | "irrigation"
        | "snow_removal"
        | "general_contractor"
        | "hvac"
        | "plumbing"
        | "electrical"
        | "roofing"
        | "painting"
        | "cleaning"
        | "pest_control"
        | "pool_service"
        | "other"
      call_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "no_answer"
        | "voicemail"
        | "failed"
      campaign_status: "draft" | "active" | "paused" | "completed"
      campaign_type: "phone" | "email" | "multi_channel"
      lead_score: "hot" | "warm" | "cold"
      lead_status:
        | "new"
        | "contacted"
        | "interested"
        | "meeting_scheduled"
        | "not_interested"
        | "no_answer"
        | "invalid"
      onboarding_status:
        | "pending"
        | "in_review"
        | "agent_created"
        | "active"
        | "paused"
      phone_setup_preference: "new" | "forward" | "port"
      user_plan: "leads" | "outreach" | "whitelabel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_type: [
        "landscaping",
        "lawn_care",
        "tree_service",
        "hardscaping",
        "irrigation",
        "snow_removal",
        "general_contractor",
        "hvac",
        "plumbing",
        "electrical",
        "roofing",
        "painting",
        "cleaning",
        "pest_control",
        "pool_service",
        "other",
      ],
      call_status: [
        "pending",
        "in_progress",
        "completed",
        "no_answer",
        "voicemail",
        "failed",
      ],
      campaign_status: ["draft", "active", "paused", "completed"],
      campaign_type: ["phone", "email", "multi_channel"],
      lead_score: ["hot", "warm", "cold"],
      lead_status: [
        "new",
        "contacted",
        "interested",
        "meeting_scheduled",
        "not_interested",
        "no_answer",
        "invalid",
      ],
      onboarding_status: [
        "pending",
        "in_review",
        "agent_created",
        "active",
        "paused",
      ],
      phone_setup_preference: ["new", "forward", "port"],
      user_plan: ["leads", "outreach", "whitelabel"],
    },
  },
} as const
