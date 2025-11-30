-- Revues AI CRM - Admin Access Control Migration
-- This creates a whitelist system where ONLY approved admins can access the dashboard
-- All other users are locked out until an admin grants them access

-- ============================================
-- ADMIN USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only super_admins and admins can view the admin list
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role IN ('super_admin', 'admin')
      AND au.is_active = true
    )
  );

-- Only super_admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- Only super_admins can update admin users
CREATE POLICY "Super admins can update admin users"
  ON admin_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
  );

-- Only super_admins can delete admin users (except themselves)
CREATE POLICY "Super admins can delete admin users"
  ON admin_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
      AND au.is_active = true
    )
    AND user_id != auth.uid() -- Cannot delete yourself
  );

-- ============================================
-- FUNCTION TO CHECK IF USER IS AUTHORIZED
-- ============================================

CREATE OR REPLACE FUNCTION is_authorized_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION TO CHECK IF USER IS ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION TO CHECK IF USER IS SUPER ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION TO GET USER ROLE
-- ============================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM admin_users
  WHERE user_id = auth.uid()
  AND is_active = true;

  RETURN COALESCE(user_role, 'unauthorized');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE EXISTING RLS POLICIES TO REQUIRE AUTHORIZATION
-- ============================================

-- Drop existing policies and recreate with authorization check
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

CREATE POLICY "Authorized users can view own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can insert own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id AND is_authorized_user())
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id AND is_authorized_user());

-- Same for campaigns
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can insert own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;

CREATE POLICY "Authorized users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can insert own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id AND is_authorized_user())
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id AND is_authorized_user());

-- Same for outreach_calls
DROP POLICY IF EXISTS "Users can view own calls" ON outreach_calls;
DROP POLICY IF EXISTS "Users can insert own calls" ON outreach_calls;
DROP POLICY IF EXISTS "Users can update own calls" ON outreach_calls;
DROP POLICY IF EXISTS "Users can delete own calls" ON outreach_calls;

CREATE POLICY "Authorized users can view own calls"
  ON outreach_calls FOR SELECT
  USING (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can insert own calls"
  ON outreach_calls FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can update own calls"
  ON outreach_calls FOR UPDATE
  USING (auth.uid() = user_id AND is_authorized_user())
  WITH CHECK (auth.uid() = user_id AND is_authorized_user());

CREATE POLICY "Authorized users can delete own calls"
  ON outreach_calls FOR DELETE
  USING (auth.uid() = user_id AND is_authorized_user());

-- ============================================
-- LOGIN TRACKING TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_login_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_users
  SET
    last_login_at = NOW(),
    login_count = login_count + 1
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEX FOR FAST AUTHORIZATION CHECKS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active_role ON admin_users(is_active, role);

-- ============================================
-- INITIAL SUPER ADMIN SETUP
-- Run this ONCE to set up your initial super admin
-- Replace with your actual email after first signup
-- ============================================

-- IMPORTANT: After you sign up with your email, run this command
-- in the Supabase SQL Editor to make yourself the super admin:
--
-- INSERT INTO admin_users (user_id, email, role, is_active)
-- SELECT id, email, 'super_admin', true
-- FROM auth.users
-- WHERE email = 'your-email@example.com';
