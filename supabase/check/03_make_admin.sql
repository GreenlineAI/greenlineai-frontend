-- Step 1: Get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'litigator2334@gmail.com';

-- Step 2: Copy the id from above and paste it below, then run this INSERT
INSERT INTO admin_users (user_id, email, role, is_active)
VALUES ('PASTE_YOUR_USER_ID_HERE', 'litigator2334@gmail.com', 'super_admin', true);

-- Step 3: Verify it worked
SELECT * FROM admin_users WHERE email = 'litigator2334@gmail.com';
