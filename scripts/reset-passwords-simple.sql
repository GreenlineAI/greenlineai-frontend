-- Force reset passwords for both admin accounts
-- Run this in Supabase SQL Editor

-- Method 1: Use a simpler password first
UPDATE auth.users
SET 
  encrypted_password = crypt('admin123', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW()),
  updated_at = NOW()
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com');

-- Verify the update worked
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmed_at IS NOT NULL as confirmed,
  encrypted_password IS NOT NULL as has_password,
  encrypted_password != '' as password_not_empty,
  last_sign_in_at
FROM auth.users
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
ORDER BY email;

-- Check if there are any auth issues
SELECT 
  email,
  banned_until,
  confirmation_token,
  recovery_token
FROM auth.users
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com');
