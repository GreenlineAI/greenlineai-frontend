-- Set password directly for glugo2942@gmail.com
-- Run this in Supabase SQL Editor
-- Replace 'YourPassword123!' with your desired password

UPDATE auth.users
SET 
  encrypted_password = crypt('Xevcid-toqvaj-zoxty8', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'glugo2942@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at
FROM auth.users
WHERE email = 'glugo2942@gmail.com';
