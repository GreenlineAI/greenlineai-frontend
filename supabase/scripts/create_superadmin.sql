-- Create Super Admin for GreenLine AI
-- Run this in Supabase SQL Editor after the user has signed up

-- First, check if the user exists
SELECT id, email, created_at
FROM auth.users
WHERE email = 'greenlineai@proton.me';

-- If the user exists, insert them as super_admin
-- (This will fail gracefully if they're already an admin)
INSERT INTO admin_users (user_id, email, role, is_active)
SELECT id, email, 'super_admin', true
FROM auth.users
WHERE email = 'greenlineai@proton.me'
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- Verify the admin was created
SELECT * FROM admin_users WHERE email = 'greenlineai@proton.me';
