-- Create a campaign for litigator2334@gmail.com
-- Run this in Supabase SQL Editor

BEGIN;

-- Create active campaign using CTE to get user_id
WITH user_info AS (
  SELECT id FROM auth.users WHERE email = 'litigator2334@gmail.com' LIMIT 1
)
INSERT INTO campaigns (
  user_id,
  name,
  type,
  status,
  settings,
  leads_count,
  contacted_count,
  meetings_booked
)
SELECT 
  user_info.id,
  'Landscaping Leads - December 2024',
  'phone',
  'active',
  jsonb_build_object(
    'schedule', jsonb_build_object(
      'days', array['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      'startTime', '09:00',
      'endTime', '17:00',
      'timezone', 'America/Los_Angeles'
    ),
    'maxCallsPerDay', 50,
    'callsPerHour', 10,
    'autoDialer', true,
    'voicemailDetection', true,
    'callScript', 'Hi, this is an AI assistant calling about lead generation services for landscaping businesses. We help companies like yours get more qualified leads through targeted outreach.'
  ),
  0,
  0,
  0
FROM user_info;

COMMIT;

-- Verify campaign was created
SELECT 
  c.id,
  c.name,
  c.type,
  c.status,
  c.leads_count,
  c.contacted_count,
  c.meetings_booked,
  c.created_at,
  u.email as user_email
FROM campaigns c
JOIN auth.users u ON u.id = c.user_id
WHERE u.email = 'litigator2334@gmail.com'
ORDER BY c.created_at DESC
LIMIT 1;
