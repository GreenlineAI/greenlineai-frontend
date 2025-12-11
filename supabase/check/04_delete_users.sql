-- Delete users from the new database that have broken passwords
-- WARNING: This will permanently delete these users and all their data

-- First, check what data these users have in other tables
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles WHERE id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users WHERE user_id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

SELECT 'business_onboarding' as table_name, COUNT(*) as count FROM business_onboarding WHERE user_id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

-- Delete from related tables first (due to foreign key constraints)
DELETE FROM admin_users WHERE user_id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

DELETE FROM business_onboarding WHERE user_id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

DELETE FROM profiles WHERE id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

-- Finally delete from auth.users (this requires admin privileges)
DELETE FROM auth.users WHERE id IN (
  '32b66f03-0e90-4d4b-9091-fd8b2f2404e6',
  '0b627f19-6ea2-469b-a596-84cab72190c9',
  'c2f810e1-d126-43c1-b104-b531517944dc'
);

-- Verify deletion
SELECT id, email FROM auth.users;
