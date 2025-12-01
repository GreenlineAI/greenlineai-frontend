-- Fix user profile for glugo2942@gmail.com
-- Run this in Supabase SQL Editor

-- Confirm email and fix profile
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'glugo2942@gmail.com'
  AND email_confirmed_at IS NULL;

-- First, let's check if the user exists and get their ID
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'glugo2942@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User with email glugo2942@gmail.com not found in auth.users';
  ELSE
    RAISE NOTICE 'User ID: %', v_user_id;
    
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
      RAISE NOTICE 'Profile not found, creating...';
      INSERT INTO profiles (id, email, name, plan)
      VALUES (v_user_id, 'glugo2942@gmail.com', 'Glugo User', 'leads');
      RAISE NOTICE 'Profile created successfully';
    ELSE
      RAISE NOTICE 'Profile already exists';
    END IF;
    
    -- Check lead count
    RAISE NOTICE 'Lead count: %', (SELECT COUNT(*) FROM leads WHERE user_id = v_user_id);
  END IF;
END $$;

-- Show summary
SELECT 
  u.id as user_id,
  u.email,
  p.id as profile_id,
  p.name,
  p.plan,
  (SELECT COUNT(*) FROM leads WHERE user_id = u.id) as lead_count
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'glugo2942@gmail.com';
