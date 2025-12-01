-- Update profile name for glugo2942@gmail.com
-- Run this in Supabase SQL Editor

UPDATE profiles
SET 
  name = 'Admin',
  company = 'GreenLine AI'
WHERE email = 'glugo2942@gmail.com';

-- Verify the update
SELECT id, email, name, company, plan
FROM profiles
WHERE email = 'glugo2942@gmail.com';
