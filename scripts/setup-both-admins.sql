-- Setup both admin accounts
-- Run this in Supabase SQL Editor

-- Set password for greenlineai@proton.me
UPDATE auth.users
SET 
  encrypted_password = crypt('GreenLine2024!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'greenlineai@proton.me';

-- Set password for glugo2942@gmail.com (in case it needs refresh)
UPDATE auth.users
SET 
  encrypted_password = crypt('GreenLine2024!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'glugo2942@gmail.com';

-- Update profile for greenlineai@proton.me
INSERT INTO profiles (id, email, name, company, plan)
SELECT id, email, 'Admin', 'GreenLine AI', 'leads'
FROM auth.users
WHERE email = 'greenlineai@proton.me'
ON CONFLICT (id) DO UPDATE
SET 
  name = 'Admin',
  company = 'GreenLine AI';

-- Update profile for glugo2942@gmail.com
UPDATE profiles
SET 
  name = 'Admin',
  company = 'GreenLine AI'
WHERE email = 'glugo2942@gmail.com';

-- Verify both accounts
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.encrypted_password IS NOT NULL as has_password,
  p.name,
  p.company,
  (SELECT COUNT(*) FROM leads WHERE user_id = u.id) as lead_count
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email IN ('greenlineai@proton.me', 'glugo2942@gmail.com')
ORDER BY u.email;
