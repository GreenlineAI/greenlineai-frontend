-- Revues AI CRM - Security Policies Migration
-- This migration adds comprehensive Row Level Security (RLS) policies
-- to protect all user data and ensure tenant isolation

-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- LEADS TABLE POLICIES
-- ============================================

-- Users can only view their own leads
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert leads for themselves
CREATE POLICY "Users can insert own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own leads
CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own leads
CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CAMPAIGNS TABLE POLICIES
-- ============================================

-- Users can only view their own campaigns
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert campaigns for themselves
CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- OUTREACH_CALLS TABLE POLICIES
-- ============================================

-- Users can only view their own calls
CREATE POLICY "Users can view own calls"
  ON outreach_calls FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert calls for themselves
CREATE POLICY "Users can insert own calls"
  ON outreach_calls FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own calls
CREATE POLICY "Users can update own calls"
  ON outreach_calls FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own calls
CREATE POLICY "Users can delete own calls"
  ON outreach_calls FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CALL_ANALYTICS TABLE POLICIES
-- ============================================

-- Users can only view their own analytics
CREATE POLICY "Users can view own analytics"
  ON call_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert analytics for themselves
CREATE POLICY "Users can insert own analytics"
  ON call_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analytics
CREATE POLICY "Users can update own analytics"
  ON call_analytics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SERVICE ROLE BYPASS (for backend operations)
-- ============================================
-- Note: The service_role key bypasses RLS automatically
-- This is used for admin operations and webhook processing

-- ============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ============================================

-- Function to check if user owns a lead (for use in other policies)
CREATE OR REPLACE FUNCTION user_owns_lead(lead_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM leads
    WHERE id = lead_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a campaign
CREATE OR REPLACE FUNCTION user_owns_campaign(campaign_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUDIT LOG TABLE (optional but recommended)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow inserts (no reads/updates/deletes by users)
CREATE POLICY "Service role only for audit log"
  ON audit_log FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================
-- API KEYS TABLE (for external integrations)
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- Store hashed, never plain text
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '["read"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only view their own API keys
CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_outreach_calls_user_id ON outreach_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_outreach_calls_lead_id ON outreach_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_calls_created_at ON outreach_calls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_analytics_user_id ON call_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_call_analytics_date ON call_analytics(date);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
