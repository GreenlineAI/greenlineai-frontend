-- Set password directly for glugo2942@gmail.com
-- Run this in Supabase SQL Editor
-- Replace 'YourNewPassword123!' with your desired password

-- First, let's confirm the email and set a password
UPDATE auth.users
SET 
  encrypted_password = crypt('GreenLine2024!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'glugo2942@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at
FROM auth.users
WHERE email = 'glugo2942@gmail.com';

-- Also check the profile
SELECT 
  id,
  email,
  name,
  company,
  plan
FROM profiles
WHERE email = 'glugo2942@gmail.com';
