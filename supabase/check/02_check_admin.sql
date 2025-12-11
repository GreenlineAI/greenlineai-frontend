-- Check if a user is an admin
SELECT au.*, u.email as auth_email
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'litigator2334@gmail.com';

-- If not found, run this to make yourself a super_admin:
-- First get the user_id from auth.users
SELECT id, email FROM auth.users WHERE email = 'litigator2334@gmail.com';

-- Then insert into admin_users (replace USER_ID_HERE with the id from above)
-- INSERT INTO admin_users (user_id, email, role, is_active)
-- VALUES ('USER_ID_HERE', 'litigator2334@gmail.com', 'super_admin', true);
