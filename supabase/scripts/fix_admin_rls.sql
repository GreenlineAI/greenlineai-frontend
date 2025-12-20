-- Fix admin access RLS policy
-- The existing policy creates a circular dependency where users can't
-- read their own admin record to prove they're admin.
--
-- Run this in Supabase SQL Editor

-- Allow users to view their own admin record (required for auth checks)
CREATE POLICY "Users can view their own admin record"
  ON admin_users FOR SELECT
  USING (user_id = auth.uid());

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
