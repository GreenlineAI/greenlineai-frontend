-- Check Admin Users
-- Run this in Supabase SQL Editor to see all admin users and their status

-- ============================================
-- 1. LIST ALL ADMIN USERS
-- ============================================
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.login_count,
  au.last_login_at,
  au.created_at,
  u.email_confirmed_at IS NOT NULL as email_verified
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY
  CASE au.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    ELSE 4
  END,
  au.created_at;

-- ============================================
-- 2. CHECK IF ADMIN_USERS TABLE EXISTS
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'admin_users'
) as admin_users_table_exists;

-- ============================================
-- 3. COUNT BY ROLE
-- ============================================
SELECT
  role,
  COUNT(*) as count,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
FROM admin_users
GROUP BY role
ORDER BY
  CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    ELSE 4
  END;

-- ============================================
-- 4. CHECK SPECIFIC KNOWN ADMIN EMAILS
-- ============================================
SELECT
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_verified,
  au.role,
  au.is_active,
  CASE
    WHEN au.id IS NULL THEN 'NOT IN ADMIN_USERS'
    WHEN au.is_active = false THEN 'INACTIVE'
    ELSE 'ACTIVE'
  END as admin_status
FROM auth.users u
LEFT JOIN admin_users au ON au.user_id = u.id
WHERE u.email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
ORDER BY u.email;

-- ============================================
-- 5. ALL AUTH USERS WITH ADMIN STATUS
-- ============================================
SELECT
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at IS NOT NULL as email_verified,
  au.role,
  au.is_active as admin_active,
  p.name,
  p.company
FROM auth.users u
LEFT JOIN admin_users au ON au.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
