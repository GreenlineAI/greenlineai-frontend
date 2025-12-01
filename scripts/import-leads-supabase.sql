-- GreenLine AI Leads Import for Supabase UI
-- Run this in Supabase SQL Editor
-- 
-- INSTRUCTIONS:
-- 1. First, find your user ID by running:
--    SELECT id FROM auth.users WHERE email = 'Gugo2942@gmail.com';
-- 2. Copy the UUID returned
-- 3. Replace 'YOUR_USER_ID_HERE' below with that UUID (keep the quotes)
-- 4. Run this entire script

BEGIN;

-- Set the user_id variable
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'Gugo2942@gmail.com' 
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email Gugo2942@gmail.com not found. Please create the user first.';
  END IF;

  -- Insert all leads using the found user_id
  INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
  SELECT 
    v_user_id,
    business_name,
    contact_name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    industry,
    google_rating,
    review_count,
    website,
    status::lead_status,
    score::lead_score,
    notes
  FROM (VALUES
    ('Mowbray Tree Services', NULL, NULL, '(909) 389-0077', '686 E Mill St, San Bernardino, CA 92408, USA', 'San Bernardino', 'CA', '92408', 'Landscaping', 3.5, 133, 'https://www.mowbrays.com/', 'new', 'hot', NULL),
    ('GRS Landscaping & Paving Co.', NULL, NULL, '(714) 860-7099', '5681 Beach Blvd, Buena Park, CA 90621, USA', 'Buena Park', 'CA', '90621', 'Landscaping', 3.5, 13, 'http://grslandscaping.website/', 'new', 'hot', NULL),
    ('Mimosa Nursery', NULL, NULL, '(323) 722-4543', '6270 Allston St, Los Angeles, CA 90022, USA', 'Los Angeles', 'CA', '90022', 'Landscaping', 3.9, 85, 'http://mimosala.com/', 'new', 'hot', NULL),
    ('Mimosa Nursery', NULL, NULL, '(714) 828-0780', '2700 W Crescent Ave, Anaheim, CA 92801, USA', 'Anaheim', 'CA', '92801', 'Landscaping', 3.8, 96, 'https://vuoncayoc.com/', 'new', 'hot', NULL),
    ('Arlington Gardens Care Center', NULL, NULL, '(951) 351-2800', '3688 Nye Ave, Riverside, CA 92505, USA', 'Riverside', 'CA', '92505', 'Landscaping', 3.6, 114, 'https://www.arlingtongardenscc.com/', 'new', 'hot', NULL),
    ('Rancho California Landscaping', NULL, NULL, '(310) 768-1680', '13801 S Western Ave, Gardena, CA 90249, USA', 'Gardena', 'CA', '90249', 'Landscaping', 3.3, 15, 'https://www.ranchocalifornia.biz/', 'new', 'hot', NULL),
    ('Lowe''s', NULL, NULL, '(619) 584-5500', '2318 Northside Dr, San Diego, CA 92108, USA', 'San Diego', 'CA', '92108', 'Landscaping', 4.0, 30, 'https://www.lowes.com/l/gardencenter.html?cm_mmc=YEXT-_-GC', 'new', 'hot', NULL),
    ('Mario Tree Service', NULL, NULL, '(562) 322-2246', '7802 Chatfield Ave, Whittier, CA 90606, USA', 'Whittier', 'CA', '90606', 'Landscaping', 3.9, 14, 'https://mariotreeservice.net/', 'new', 'hot', NULL),
    ('Grassland Landscape and Lawncare', NULL, NULL, '(562) 551-8873', '1611 Long Beach Blvd, Long Beach, CA 90813, USA', 'Long Beach', 'CA', '90813', 'Landscaping', 4.0, 18, 'https://longbeachlandscaping.net/', 'new', 'hot', NULL),
    ('Discount Tree Care Arborist, Inc.', NULL, NULL, '(562) 842-8635', '3126 E 64th St, Long Beach, CA 90805, USA', 'Long Beach', 'CA', '90805', 'Landscaping', 4.1, 131, 'https://discounttreecarearboristinc.com/', 'new', 'warm', NULL),
    ('Aerations Plus Sprinkler Repair Los Angeles', NULL, NULL, '(866) 337-0655', '925 N La Brea Ave Office 424, West Hollywood, CA 90038, USA', 'West Hollywood', 'CA', '90038', 'Landscaping', 4.2, 52, 'https://www.aerationsplusla.com/?utm_source=google&utm_medium=organic&utm_campaign=local-seo&utm_term=west-hollywood-website', 'new', 'warm', NULL),
    ('SiteOne Landscape Supply', NULL, NULL, '(714) 963-5372', '10500 Garfield Ave, Huntington Beach, CA 92646, USA', 'Huntington Beach', 'CA', '92646', 'Landscaping', 4.1, 69, 'https://www.siteone.com/en/store/317', 'new', 'warm', NULL),
    ('Red Star Fertilizer Co', NULL, NULL, '(909) 597-4801', '17132 Hellman Ave, Corona, CA 92880, USA', 'Corona', 'CA', '92880', 'Landscaping', 3.5, 13, NULL, 'new', 'hot', NULL),
    ('Paradise Garden Center', NULL, NULL, '(951) 789-0386', '7109 Dufferin Ave, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 3.6, 98, NULL, 'new', 'hot', NULL),
    ('Gloria''s Nursery', NULL, NULL, '(909) 743-3642', '18283 Marygold Ave, Bloomington, CA 92316, USA', 'Bloomington', 'CA', '92316', 'Landscaping', 3.7, 15, 'http://gloriasnursery.weebly.com/', 'new', 'hot', NULL),
    ('H & R Gardening and Landscaping', NULL, NULL, '(909) 754-3254', '3949 Modesto Dr, San Bernardino, CA 92404, USA', 'San Bernardino', 'CA', '92404', 'Landscaping', 4.2, 74, 'http://www.handrgardeningandlandscaping.com/', 'new', 'warm', NULL),
    ('Sergio Contreras Landscape Inc.', NULL, NULL, '(310) 477-0586', '4464 W Adams Blvd, Los Angeles, CA 90016, USA', 'Los Angeles', 'CA', '90016', 'Landscaping', 4.0, 21, 'https://sclandscapeinc.com/', 'new', 'hot', NULL),
    ('Forge Aeration & Lawn Care', NULL, NULL, '(949) 329-8526', '26632 Towne Centre Dr, Foothill Ranch, CA 92610, USA', 'Lake Forest', 'CA', '92610', 'Landscaping', 2.6, 18, NULL, 'new', 'hot', NULL),
    ('SP Hardscaping & Artificial Grass', NULL, NULL, '(213) 521-8287', '1560 Brookhollow Dr #209, Santa Ana, CA 92705, USA', 'Santa Ana', 'CA', '92705', 'Landscaping', 3.5, 16, NULL, 'new', 'hot', NULL),
    ('Ortega Maintenance', NULL, NULL, '(951) 340-0254', '2140 Devonshire Dr, Corona, CA 92879, USA', 'Corona', 'CA', '92879', 'Landscaping', 3.9, 15, 'http://www.ortegatreeandlawnservices.com/', 'new', 'hot', NULL)
  ) AS t(business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes);

  RAISE NOTICE 'Successfully imported % leads for user %', (SELECT COUNT(*) FROM leads WHERE user_id = v_user_id), v_user_id;
END $$;

COMMIT;

-- Verify the import
SELECT 
  COUNT(*) as total_leads_imported,
  user_id,
  (SELECT email FROM auth.users WHERE id = user_id) as user_email
FROM leads 
GROUP BY user_id;
