-- Comprehensive diagnostic for glugo2942@gmail.com
-- Run this in Supabase SQL Editor

-- 1. Check auth.users table
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'glugo2942@gmail.com';

-- 2. Check profiles table
SELECT * FROM profiles WHERE email = 'glugo2942@gmail.com';

-- 3. Check lead count by user_id
SELECT 
  user_id,
  COUNT(*) as lead_count,
  MIN(created_at) as first_lead,
  MAX(created_at) as last_lead
FROM leads
GROUP BY user_id;

-- 4. Check if there are any leads with your user_id
SELECT 
  COUNT(*) as your_lead_count
FROM leads
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'glugo2942@gmail.com');

-- 5. Show first 5 leads in the database (to see what user_id they have)
SELECT 
  id,
  user_id,
  business_name,
  city,
  state,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;
