-- Alternative: Generate password recovery tokens
-- Run this in Supabase SQL Editor

-- This will allow you to use Supabase's password recovery flow
-- Generate recovery tokens for both accounts
UPDATE auth.users
SET 
  recovery_token = encode(gen_random_bytes(32), 'hex'),
  recovery_sent_at = NOW(),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com');

-- Show the accounts
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  recovery_token IS NOT NULL as has_recovery_token,
  last_sign_in_at
FROM auth.users
WHERE email IN ('greenlineai@proton.me', 'glugo2942@gmail.com');
