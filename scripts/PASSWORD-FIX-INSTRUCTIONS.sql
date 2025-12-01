-- IMPORTANT: This SQL will NOT work for setting passwords!
-- 
-- The issue is that Supabase Auth uses its own password hashing algorithm
-- that is NOT compatible with PostgreSQL's crypt() function.
-- 
-- ❌ WRONG APPROACH (what we've been trying):
--    UPDATE auth.users SET encrypted_password = crypt('password', gen_salt('bf'))
--    This creates a bcrypt hash that Supabase Auth cannot verify!
--
-- ✅ CORRECT APPROACH - Choose ONE of these methods:
--
-- METHOD 1: Use Supabase Dashboard (RECOMMENDED)
-- -----------------------------------------------
-- 1. Go to: https://supabase.com/dashboard/project/nggelyppkswqxycblvcb
-- 2. Click "Authentication" in left sidebar
-- 3. Click "Users" tab
-- 4. Find user by email (greenlineai@proton.me or glugo2942@gmail.com)
-- 5. Click the three dots menu → "Reset Password"
-- 6. In the modal, enter new password: Admin123!
-- 7. Check "Auto Confirm User" 
-- 8. Click "Update User"
-- 9. Try logging in immediately
--
-- METHOD 2: Send Password Reset Email
-- ------------------------------------
-- On the login page at greenline-ai.com:
-- 1. Click "Forgot password?"
-- 2. Enter: greenlineai@proton.me or glugo2942@gmail.com
-- 3. Check email for reset link
-- 4. Click link and set new password
-- 5. Login with new password
--
-- METHOD 3: Use Supabase Admin API (via Node.js script)
-- ------------------------------------------------------
-- See: scripts/create-admin-via-api.ts
-- Run: npx tsx scripts/create-admin-via-api.ts
--
-- This uses the service_role key to properly hash passwords
--
-- VERIFICATION QUERIES (safe to run):
-- ------------------------------------

-- Check current user status
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmed_at IS NOT NULL as confirmed,
  last_sign_in_at,
  created_at,
  banned_until IS NULL as not_banned,
  deleted_at IS NULL as not_deleted
FROM auth.users
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
ORDER BY email;

-- Check if users have profiles
SELECT 
  u.email,
  p.id IS NOT NULL as has_profile,
  p.name,
  p.company,
  p.plan
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
ORDER BY u.email;

-- Count leads for each user
SELECT 
  u.email,
  COUNT(l.id) as lead_count
FROM auth.users u
LEFT JOIN leads l ON l.user_id = u.id
WHERE u.email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
GROUP BY u.email
ORDER BY u.email;
