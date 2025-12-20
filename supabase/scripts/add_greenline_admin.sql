-- Add greenlineai@proton.me as super_admin
-- Run this in Supabase SQL Editor

INSERT INTO admin_users (user_id, email, role, is_active)
SELECT id, email, 'super_admin', true
FROM auth.users
WHERE email = 'greenlineai@proton.me'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', is_active = true;

-- Verify it worked
SELECT * FROM admin_users WHERE email = 'greenlineai@proton.me';
