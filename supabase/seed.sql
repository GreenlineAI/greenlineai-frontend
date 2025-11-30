-- Seed data for testing
-- This will be inserted for a specific user after they sign up

-- You can run this manually after creating a test user
-- Replace 'YOUR_USER_ID' with the actual user UUID from auth.users

-- Example leads (run after you have a user)
/*
INSERT INTO leads (user_id, business_name, contact_name, email, phone, city, state, zip, industry, google_rating, review_count, status, score)
VALUES
  ('YOUR_USER_ID', 'Green Valley Landscaping', 'Mike Johnson', 'mike@greenvalley.com', '(512) 555-0101', 'Austin', 'TX', '78701', 'Landscaping', 3.2, 45, 'new', 'hot'),
  ('YOUR_USER_ID', 'Premier Lawn Care', 'Sarah Williams', 'sarah@premierlawn.com', '(214) 555-0102', 'Dallas', 'TX', '75201', 'Lawn Care', 2.8, 23, 'contacted', 'warm'),
  ('YOUR_USER_ID', 'Sunrise Garden Services', 'David Chen', 'david@sunrisegarden.com', '(713) 555-0103', 'Houston', 'TX', '77001', 'Landscaping', 3.5, 67, 'interested', 'hot'),
  ('YOUR_USER_ID', 'Desert Oasis Landscaping', 'Maria Garcia', 'maria@desertoasis.com', '(602) 555-0104', 'Phoenix', 'AZ', '85001', 'Landscaping', 4.1, 89, 'meeting_scheduled', 'hot'),
  ('YOUR_USER_ID', 'Rocky Mountain Mowing', 'Tom Anderson', NULL, '(303) 555-0105', 'Denver', 'CO', '80201', 'Lawn Care', 2.5, 12, 'no_answer', 'cold'),
  ('YOUR_USER_ID', 'Pacific Coast Gardens', 'Jennifer Lee', 'jen@pcgardens.com', '(415) 555-0106', 'San Francisco', 'CA', '94102', 'Landscaping', 3.8, 156, 'not_interested', 'cold'),
  ('YOUR_USER_ID', 'Evergreen Tree Service', 'Robert Brown', 'rob@evergreentree.com', '(206) 555-0107', 'Seattle', 'WA', '98101', 'Tree Service', 3.0, 34, 'new', 'warm'),
  ('YOUR_USER_ID', 'Sunshine Sprinkler Systems', 'Amy Martinez', 'amy@sunshinesprinkler.com', '(305) 555-0108', 'Miami', 'FL', '33101', 'Irrigation', 4.2, 78, 'contacted', 'warm'),
  ('YOUR_USER_ID', 'Heartland Lawn & Garden', 'Steve Wilson', 'steve@heartlandlawn.com', '(816) 555-0109', 'Kansas City', 'MO', '64101', 'Lawn Care', 2.9, 19, 'new', 'hot'),
  ('YOUR_USER_ID', 'Magnolia Landscaping Co', 'Lisa Thompson', 'lisa@magnoliaco.com', '(504) 555-0110', 'New Orleans', 'LA', '70112', 'Landscaping', 3.6, 52, 'interested', 'hot');

-- Example campaigns
INSERT INTO campaigns (user_id, name, status, type, leads_count, contacted_count, responded_count, meetings_booked)
VALUES
  ('YOUR_USER_ID', 'Texas Landscapers Q1', 'active', 'multi_channel', 250, 180, 45, 12),
  ('YOUR_USER_ID', 'West Coast Outreach', 'active', 'phone', 150, 75, 22, 8),
  ('YOUR_USER_ID', 'Email Nurture - Low Rating', 'paused', 'email', 500, 500, 35, 5);
*/
