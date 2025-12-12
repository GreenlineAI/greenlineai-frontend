-- Confirm email and create super admin for greenlineai@proton.me
-- Run this in Supabase SQL Editor

-- Step 1: Confirm the email (fixes login issues after clicking confirmation link)
UPDATE auth.users
SET email_confirmed_at = now(),
    confirmed_at = now()
WHERE email = 'greenlineai@proton.me';

-- Step 2: Add as super admin
INSERT INTO admin_users (user_id, email, role, is_active)
SELECT id, email, 'super_admin', true
FROM auth.users
WHERE email = 'greenlineai@proton.me'
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- Step 3: Verify everything is set up correctly
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  a.role,
  a.is_active
FROM auth.users u
LEFT JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'greenlineai@proton.me';
