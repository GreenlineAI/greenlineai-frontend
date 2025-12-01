-- GreenLine AI Leads Import
-- Run this in Supabase SQL Editor
-- First, get your admin user_id:
-- SELECT id FROM auth.users WHERE email = 'Gugo2942@gmail.com';

-- Replace YOUR_USER_ID below with the actual UUID

DO $$
DECLARE
  admin_id UUID := (SELECT id FROM auth.users WHERE email = 'Gugo2942@gmail.com');
BEGIN

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mowbray Tree Services', NULL, NULL, '(909) 389-0077', '686 E Mill St, San Bernardino, CA 92408, USA', 'San Bernardino', 'CA', '92408', 'Landscaping', 3.5, 133, 'https://www.mowbrays.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'GRS Landscaping & Paving Co.', NULL, NULL, '(714) 860-7099', '5681 Beach Blvd, Buena Park, CA 90621, USA', 'Buena Park', 'CA', '90621', 'Landscaping', 3.5, 13, 'http://grslandscaping.website/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mimosa Nursery', NULL, NULL, '(323) 722-4543', '6270 Allston St, Los Angeles, CA 90022, USA', 'Los Angeles', 'CA', '90022', 'Landscaping', 3.9, 85, 'http://mimosala.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mimosa Nursery', NULL, NULL, '(714) 828-0780', '2700 W Crescent Ave, Anaheim, CA 92801, USA', 'Anaheim', 'CA', '92801', 'Landscaping', 3.8, 96, 'https://vuoncayoc.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Arlington Gardens Care Center', NULL, NULL, '(951) 351-2800', '3688 Nye Ave, Riverside, CA 92505, USA', 'Riverside', 'CA', '92505', 'Landscaping', 3.6, 114, 'https://www.arlingtongardenscc.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rancho California Landscaping', NULL, NULL, '(310) 768-1680', '13801 S Western Ave, Gardena, CA 90249, USA', 'Gardena', 'CA', '90249', 'Landscaping', 3.3, 15, 'https://www.ranchocalifornia.biz/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lowe''s', NULL, NULL, '(619) 584-5500', '2318 Northside Dr, San Diego, CA 92108, USA', 'San Diego', 'CA', '92108', 'Landscaping', 4, 30, 'https://www.lowes.com/l/gardencenter.html?cm_mmc=YEXT-_-GC', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mario Tree Service', NULL, NULL, '(562) 322-2246', '7802 Chatfield Ave, Whittier, CA 90606, USA', 'Whittier', 'CA', '90606', 'Landscaping', 3.9, 14, 'https://mariotreeservice.net/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Grassland Landscape and Lawncare', NULL, NULL, '(562) 551-8873', '1611 Long Beach Blvd, Long Beach, CA 90813, USA', 'Long Beach', 'CA', '90813', 'Landscaping', 4, 18, 'https://longbeachlandscaping.net/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Discount Tree Care Arborist, Inc.', NULL, NULL, '(562) 842-8635', '3126 E 64th St, Long Beach, CA 90805, USA', 'Long Beach', 'CA', '90805', 'Landscaping', 4.1, 131, 'https://discounttreecarearboristinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Aerations Plus Sprinkler Repair Los Angeles', NULL, NULL, '(866) 337-0655', '925 N La Brea Ave Office 424, West Hollywood, CA 90038, USA', 'West Hollywood', 'CA', '90038', 'Landscaping', 4.2, 52, 'https://www.aerationsplusla.com/?utm_source=google&utm_medium=organic&utm_campaign=local-seo&utm_term=west-hollywood-website', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'SiteOne Landscape Supply', NULL, NULL, '(714) 963-5372', '10500 Garfield Ave, Huntington Beach, CA 92646, USA', 'Huntington Beach', 'CA', '92646', 'Landscaping', 4.1, 69, 'https://www.siteone.com/en/store/317', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Red Star Fertilizer Co', NULL, NULL, '(909) 597-4801', '17132 Hellman Ave, Corona, CA 92880, USA', 'Corona', 'CA', '92880', 'Landscaping', 3.5, 13, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Paradise Garden Center', NULL, NULL, '(951) 789-0386', '7109 Dufferin Ave, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 3.6, 98, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gloria''s Nursery', NULL, NULL, '(909) 743-3642', '18283 Marygold Ave, Bloomington, CA 92316, USA', 'Bloomington', 'CA', '92316', 'Landscaping', 3.7, 15, 'http://gloriasnursery.weebly.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'H & R Gardening and Landscaping', NULL, NULL, '(909) 754-3254', '3949 Modesto Dr, San Bernardino, CA 92404, USA', 'San Bernardino', 'CA', '92404', 'Landscaping', 4.2, 74, 'http://www.handrgardeningandlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sergio Contreras Landscape Inc.', NULL, NULL, '(310) 477-0586', '4464 W Adams Blvd, Los Angeles, CA 90016, USA', 'Los Angeles', 'CA', '90016', 'Landscaping', 4, 21, 'https://sclandscapeinc.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Forge Aeration & Lawn Care', NULL, NULL, '(949) 329-8526', '26632 Towne Centre Dr, Foothill Ranch, CA 92610, USA', 'Lake Forest', 'CA', '92610', 'Landscaping', 2.6, 18, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'SP Hardscaping & Artificial Grass', NULL, NULL, '(213) 521-8287', '1560 Brookhollow Dr #209, Santa Ana, CA 92705, USA', 'Santa Ana', 'CA', '92705', 'Landscaping', 3.5, 16, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ortega Maintenance', NULL, NULL, '(951) 340-0254', '2140 Devonshire Dr, Corona, CA 92879, USA', 'Corona', 'CA', '92879', 'Landscaping', 3.9, 15, 'http://www.ortegatreeandlawnservices.com/', 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'GrowAce', NULL, NULL, '(888) 621-0062', '735 Challenger St, Brea, CA 92821, USA', 'Brea', 'CA', '92821', 'Landscaping', 4.1, 389, 'https://growace.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Moon Valley Nurseries', NULL, NULL, '(909) 325-4024', '5211 Edison Ave, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 4.1, 98, 'https://www.moonvalleynurseries.com/locations/chino', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sprinkler Guy LA', NULL, NULL, '(310) 634-5059', '11321 Washington Blvd, Culver City, CA 90230, USA', 'Culver City', 'CA', '90230', 'Landscaping', 3.9, 7, 'http://cms.sprinklerguyla-com.webnode.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Emily Garden Nursery', NULL, NULL, '(714) 557-3404', 'Scala nursery, 3439 W MacArthur Blvd, Santa Ana, CA 92704, USA', 'Santa Ana', 'CA', '92704', 'Landscaping', 4.2, 26, 'http://emilygardennursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LuxeStone Landscaping Solutions', NULL, NULL, '(949) 580-0067', '377 W Chapman Ave, Placentia, CA 92870, USA', 'Placentia', 'CA', '92870', 'Landscaping', 3.8, 5, 'http://luxestonelandscapingsolutions.website/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mimi Nursery', NULL, NULL, '(714) 638-5115', '13352 S Euclid St, Garden Grove, CA 92843, USA', 'Garden Grove', 'CA', '92843', 'Landscaping', 3.8, 29, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Natures Growers', NULL, NULL, '(714) 999-1190', '1621 S Euclid St, Anaheim, CA 92802, USA', 'Anaheim', 'CA', '92802', 'Landscaping', 4, 5, 'http://naturesgrowers.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Marroquin''s Landscaping & Maintenance Services Inc.', NULL, NULL, '(951) 295-7042', '3825 Crestmore Rd spc 330, Riverside, CA 92509, USA', 'Riverside', 'CA', '92509', 'Landscaping', 4, 9, 'https://marroquinslandscaping.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Casa Verde Landscaping & Garden Service', NULL, NULL, '(310) 971-0780', '22516 Normandie Ave #B41, Torrance, CA 90502, USA', 'Torrance', 'CA', '90502', 'Landscaping', 3.3, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Belman Living Hardscape & Pavers', NULL, NULL, '(844) 728-3711', '2522 Chambers Rd #100, Tustin, CA 92780, USA', 'Tustin', 'CA', '92780', 'Landscaping', 3.8, 6, 'https://belmanpavers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Urban Landscape', NULL, NULL, '(949) 433-7428', '895 Dove St, Newport Beach, CA 92660, USA', 'Newport Beach', 'CA', '92660', 'Landscaping', 4.1, 37, 'https://www.urbanlandscape.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gardens Plus +', NULL, NULL, '(909) 986-6666', '120 N Campus Ave, Ontario, CA 91764, USA', 'Ontario', 'CA', '91764', 'Landscaping', 3.8, 32, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Shiyi succulent garden', NULL, NULL, '(626) 586-0094', '11817 Central Ave, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 4.1, 45, 'http://shiyisucculent.com/?utm_source=gmb&utm_medium=referral', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'BLVD Nursery', NULL, NULL, '(626) 744-9202', '170 E Orange Grove Blvd, Pasadena, CA 91103, USA', 'Pasadena', 'CA', '91103', 'Landscaping', 4.7, 91, 'https://www.blvdnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Roger''s Gardens', NULL, NULL, '(949) 640-5800', '2301 San Joaquin Hills Rd, Corona Del Mar, CA 92625, USA', 'Newport Beach', 'CA', '92625', 'Landscaping', 4.6, 1023, 'https://www.rogersgardens.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mission Hills Nursery', NULL, NULL, '(619) 295-2808', '1525 Fort Stockton Dr, San Diego, CA 92103, USA', 'San Diego', 'CA', '92103', 'Landscaping', 4.6, 147, 'https://www.missionhillsnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LawnStarter Lawn Care Service', NULL, NULL, '(424) 324-2113', 'Hedrick Summit, Suite 483 South, 330 De Neve Dr, Los Angeles, CA 90024, USA', 'Los Angeles', 'CA', '90024', 'Landscaping', 4.5, 66, 'https://www.lawnstarter.com/los-angeles-ca-lawn-care?utm_source=google&utm_medium=GLocal&utm_campaign=LosAngelesLocal', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Center', NULL, NULL, '(562) 776-2200', '7121 Firestone Blvd, Downey, CA 90241, USA', 'Downey', 'CA', '90241', 'Landscaping', 4.5, 59, 'https://www.homedepot.com/l/Downey/CA/Downey/90241/6627/garden-center?emt=GCGMBGoogleMaps', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Deep Roots Garden Center', NULL, NULL, '(310) 376-0567', '18420 Hawthorne Blvd, Torrance, CA 90504, USA', 'Torrance', 'CA', '90504', 'Landscaping', 4.5, 75, 'https://deep-roots.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Adam''s Feed & Garden Supply, Inc.', NULL, NULL, '(323) 587-0670', '8707 Compton Ave, Los Angeles, CA 90002, USA', 'Los Angeles', 'CA', '90002', 'Landscaping', 4.5, 108, 'http://facebook.com/adamsfeedgardensupply/?rf=160119460677275', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sprinkler Repair Service', NULL, NULL, '(310) 634-5059', '11512 Culver Blvd, Los Angeles, CA 90066, USA', 'Los Angeles', 'CA', '90066', 'Landscaping', 4.6, 65, 'http://sprinklerrepair1.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'MC Landscaping LLC', NULL, NULL, '(562) 225-9460', '5780 South St, Lakewood, CA 90713, USA', 'Lakewood', 'CA', '90713', 'Landscaping', 4.7, 106, 'https://mclandscapingllc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gutierrez & Sons Tree Services and Landscaping', NULL, NULL, '(310) 596-6704', '879 W 179th St Suite 400 Office #55, Gardena, CA 90248, USA', 'Gardena', 'CA', '90248', 'Landscaping', 4.7, 114, 'https://www.gutierrezandsonstreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'H & H Nursery', NULL, NULL, '(562) 804-2513', '6220 Lakewood Blvd, Lakewood, CA 90712, USA', 'Lakewood', 'CA', '90712', 'Landscaping', 4.7, 399, 'http://www.hhnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Easy Does It Tree Service Inc', NULL, NULL, '(323) 252-1675', '2156 W 30th St, Los Angeles, CA 90018, USA', 'Los Angeles', 'CA', '90018', 'Landscaping', 4.8, 74, 'http://easydoesittreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'J&P Sprinkler repair Services', NULL, NULL, '(310) 906-8168', '10536 S Burl Ave, Lennox, CA 90304, USA', 'Lennox', 'CA', '90304', 'Landscaping', 4.8, 58, 'https://sprinklersjp.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Poly Timber Tree Service Inc.', NULL, NULL, '(626) 478-4558', '8248 Birchbark Ave, Pico Rivera, CA 90660, USA', 'Pico Rivera', 'CA', '90660', 'Landscaping', 4.9, 82, 'http://www.polytimbertreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Think Green Tree Care Inc.', NULL, NULL, '(626) 510-5144', '16037 Harvest Moon St, La Puente, CA 91744, USA', 'La Puente', 'CA', '91744', 'Landscaping', 4.9, 64, 'https://treeservicesinlosangeles.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gabriel´s Tree Service And Landscaping', NULL, NULL, '(323) 515-5178', '11528 Felton Ave, Los Angeles, CA 90045, USA', 'Los Angeles', 'CA', '90045', 'Landscaping', 5, 585, 'http://www.gabrieltreeservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Favor Tree Care', NULL, NULL, '(714) 395-9495', '510 N Wedgewood Dr, Anaheim, CA 92801, USA', 'Anaheim', 'CA', '92801', 'Landscaping', 5, 67, 'https://favorlandandtreecare.com/?utm_campaign=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Environmental Green Tree Care/ Killelea Landscape', NULL, NULL, '(949) 690-6410', '333 W Broadway #1206, Anaheim, CA 92815, USA', 'Anaheim', 'CA', '92815', 'Landscaping', 5, 267, 'http://www.killelealandscapeco.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Advisor Inc.', NULL, NULL, '(888) 869-0987', '7660 Beverly Blvd, Los Angeles, CA 90036, USA', 'Los Angeles', 'CA', '90036', 'Landscaping', 5, 251, 'https://greenadvisorinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ariel Builders Landscape Specialist', NULL, NULL, '(424) 415-8500', '4640 Admiralty Way 5th fl, Marina Del Rey, CA 90292, USA', 'Marina del Rey', 'CA', '90292', 'Landscaping', 5, 100, 'https://ariel-buildersinc.com/ariel-builders-landscape', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Top Notch Co & Irrigation', NULL, NULL, '(657) 231-9544', '2612 S Croddy Way Suite i, Santa Ana, CA 92704, USA', 'Santa Ana', 'CA', '92704', 'Landscaping', 5, 72, 'https://topnotchlandscapelighting.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Buildcal Landscape', NULL, NULL, '(818) 303-1570', '507 Vine St, Glendale, CA 91204, USA', 'Glendale', 'CA', '91204', 'Landscaping', 4.2, 15, 'https://buildcal.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Hashimoto Nursery', NULL, NULL, '(310) 473-6232', '1935 Sawtelle Blvd, Los Angeles, CA 90025, USA', 'Los Angeles', 'CA', '90025', 'Landscaping', 4.5, 131, 'http://www.hashimotonursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'San Gabriel Nursery & Florist', NULL, NULL, '(626) 286-3782', '632 S San Gabriel Blvd, San Gabriel, CA 91776, USA', 'San Gabriel', 'CA', '91776', 'Landscaping', 4.5, 261, 'http://www.sgnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Flora Grubb Gardens Plant Nursery', NULL, NULL, '(310) 823-5956', '13198 Mindanao Wy, Marina Del Rey, CA 90292, USA', 'Marina del Rey', 'CA', '90292', 'Landscaping', 4.5, 198, 'https://www.floragrubb.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sepulveda Garden Center', NULL, NULL, '(818) 784-5180', '16633 Magnolia Blvd, Encino, CA 91436, USA', 'Los Angeles', 'CA', '91436', 'Landscaping', 4.6, 97, 'https://www.laparks.org/horticulture/sepulveda-garden-center', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Merrihew''s Sunset Gardens', NULL, NULL, '(310) 452-1051', '1526 Ocean Park Blvd, Santa Monica, CA 90405, USA', 'Santa Monica', 'CA', '90405', 'Landscaping', 4.6, 110, 'https://www.merrihewsnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Right Way Tree Service, Inc.', NULL, NULL, '(323) 738-0446', '13027 Victory Blvd #509, Valley Glen, CA 91606, USA', 'Los Angeles', 'CA', '91606', 'Landscaping', 4.7, 80, 'http://rightwaytreeservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Flores Artscape', NULL, NULL, '(323) 666-3510', '3959 Eagle Rock Blvd, Los Angeles, CA 90065, USA', 'Los Angeles', 'CA', '90065', 'Landscaping', 4.7, 133, 'https://www.floresartscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Leaf Zone', NULL, NULL, '(818) 658-2776', '15117 Ventura Blvd Suite #1, Sherman Oaks, CA 91403, USA', 'Los Angeles', 'CA', '91403', 'Landscaping', 4.8, 69, 'https://greenleafzone.com/service-area/sherman-oaks-ca/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'California Tree Design Inc.', NULL, NULL, '(562) 253-9577', '3990 N Fair Oaks Ave, Altadena, CA 91001, USA', 'Altadena', 'CA', '91001', 'Landscaping', 4.8, 65, 'http://www.californiatreedesign.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'City Home & Garden, Inc', NULL, NULL, '(213) 622-7705', '737 San Pedro St, Los Angeles, CA 90014, USA', 'Los Angeles', 'CA', '90014', 'Landscaping', 4.8, 91, 'http://www.cityhomegarden.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Unique Home Builders', NULL, NULL, '(855) 477-5086', '17000 Ventura Blvd suite 302, Encino, CA 91316, USA', 'Los Angeles', 'CA', '91316', 'Landscaping', 4.9, 244, 'https://uniquehbc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Urban Green Remodeling', NULL, NULL, '(310) 601-5775', '1550 N El Centro Ave #1010, Los Angeles, CA 90028, USA', 'Los Angeles', 'CA', '90028', 'Landscaping', 4.9, 62, 'http://urbangreenremodeling.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pacific Pavingstone', NULL, NULL, '(818) 275-8613', '8309 Tujunga Ave #101, Sun Valley, CA 91352, USA', 'Los Angeles', 'CA', '91352', 'Landscaping', 4.9, 69, 'https://www.pacificpavingstone.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Grow Control Landscape', NULL, NULL, '(626) 627-4583', '2405 Mountain View Rd, El Monte, CA 91733, USA', 'El Monte', 'CA', '91733', 'Landscaping', 4.9, 50, 'https://www.growcontrollandscape.com/?utm_source=google&utm_medium=seo&utm_campaign=gbp-listing', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pacific Outdoor Living', NULL, NULL, '(818) 275-8271', '8309 Tujunga Ave #201, Sun Valley, CA 91352, USA', 'Los Angeles', 'CA', '91352', 'Landscaping', 4.9, 313, 'https://pacificoutdoorliving.com/?utm_source=GMB&utm_medium=organic&utm_campaign=sunvalley', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Timeless Builds Pool Contractor Los Angeles', NULL, NULL, '(310) 846-8139', '10250 Constellation Blvd #100, Los Angeles, CA 90067, USA', 'Los Angeles', 'CA', '90067', 'Landscaping', 4.9, 71, 'https://explore.timelessbuilds.com/vision-call/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Socal Landscape & Gardening', NULL, NULL, '(213) 566-7469', '1245 McClellan Dr, Los Angeles, CA 90025, USA', 'Los Angeles', 'CA', '90025', 'Landscaping', 5, 74, 'https://www.socallg.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'TREE SERVICE SG MONARCH INC', NULL, NULL, '(818) 400-5146', '13031 Willard St, North Hollywood, CA 91605, USA', 'Los Angeles', 'CA', '91605', 'Landscaping', 5, 62, 'https://secure.getjobber.com/website', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Safeway Tree Service Inc.', NULL, NULL, '(818) 435-3781', '16716 Horace St, Granada Hills, CA 91344, USA', 'Los Angeles', 'CA', '91344', 'Landscaping', 5, 139, 'http://www.safewaytree.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'GRANADA TREE SERVICE', NULL, NULL, '(818) 849-8546', '10644 1/2 Sepulveda Blvd, Mission Hills, CA 91345, USA', 'Los Angeles', 'CA', '91345', 'Landscaping', 5, 64, 'http://granadatreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Droughtscape', NULL, NULL, '(818) 446-0707', 'Angeles Crest Hwy, La Cañada Flintridge, CA 91011, USA', 'La Cañada Flintridge', 'CA', '91011', 'Landscaping', 5, 87, 'https://www.droughtscapela.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'RainforestLA, Inc.', NULL, NULL, '(323) 828-4178', '442 Alandele Ave, Los Angeles, CA 90036, USA', 'Los Angeles', 'CA', '90036', 'Landscaping', 5, 91, 'https://rainforestla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ernie Ureno Tree Service Inc', NULL, NULL, '(714) 491-7132', 'Santa Ana, CA 92704, USA', 'Santa Ana', 'CA', '92704', 'Landscaping', 4.2, 15, 'https://erniestreeservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Village Nurseries', NULL, NULL, '(714) 998-8751', '1582 N Tustin St, Orange, CA 92867, USA', 'Orange', 'CA', '92867', 'Landscaping', 4.3, 76, 'http://www.villagenurserieslc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'B & M Lawn & Garden Center', NULL, NULL, '(714) 996-5490', '2801 E Miraloma Ave suite a, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 4.4, 114, 'http://www.bmproturf.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Freddy''s Tree Service', NULL, NULL, '(714) 630-1578', '1037 S Marjan St, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 4.7, 51, 'http://www.freddystreeexperts.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Heavenly''s Lawn Care', NULL, NULL, '(949) 357-0965', '555 Anton Blvd suit 150, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 4.8, 85, 'https://www.heavenlyslawncareoc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Premier Tree Experts', NULL, NULL, '(714) 588-8035', '802 E Lincoln Ave, Orange, CA 92865, USA', 'Orange', 'CA', '92865', 'Landscaping', 4.8, 77, 'http://www.premiertreeexperts.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'David''s Tree Service, Inc.', NULL, NULL, '(714) 842-6345', '19051 Gothard St, Huntington Beach, CA 92648, USA', 'Huntington Beach', 'CA', '92648', 'Landscaping', 4.8, 236, 'http://www.davidstree.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Martinez Nursery', NULL, NULL, '(714) 828-4908', '8734 La Palma Ave, Buena Park, CA 90620, USA', 'Buena Park', 'CA', '90620', 'Landscaping', 4.8, 169, 'http://www.martineznurserysocal.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orange County Farm Supply', NULL, NULL, '(714) 978-6500', '1826 W Chapman Ave, Orange, CA 92868, USA', 'Orange', 'CA', '92868', 'Landscaping', 4.8, 212, 'https://www.ocfarmsupply.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Laguna Hills Nursery', NULL, NULL, '(714) 542-5600', '1829 N Tustin Ave, Santa Ana, CA 92705, USA', 'Santa Ana', 'CA', '92705', 'Landscaping', 4.8, 318, 'http://www.lagunahillsnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'M & M Nursery', NULL, NULL, '(714) 538-8042', '380 N Tustin St, Orange, CA 92867, USA', 'Orange', 'CA', '92867', 'Landscaping', 4.8, 78, 'http://www.fairygardenexpert.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'The Potting Shed by Carlisle', NULL, NULL, '(714) 468-5154', '10 Plaza Square Suite 102, Orange, CA 92866, USA', 'Orange', 'CA', '92866', 'Landscaping', 4.8, 123, 'http://www.tpshomeandgarden.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'TurFresh', NULL, NULL, '(855) 444-8873', '418 Goetz Ave, Santa Ana, CA 92707, USA', 'Santa Ana', 'CA', '92707', 'Landscaping', 5, 363, 'https://www.turfresh.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Plant Depot', NULL, NULL, '(949) 240-2107', '32413 San Juan Creek Rd, San Juan Capistrano, CA 92675, USA', 'San Juan Capistrano', 'CA', '92675', 'Landscaping', 4.6, 260, 'http://www.plantdepot.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Thumb Nursery - Lake Forest', NULL, NULL, '(949) 828-5575', '23782 Bridger Rd, Lake Forest, CA 92630, USA', 'Lake Forest', 'CA', '92630', 'Landscaping', 4.8, 979, 'https://www.greenthumb.com/green-thumb-nursery-lake-forest-location/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'South Green Tree Care Inc', NULL, NULL, '(949) 910-3195', '23041 Antonio Pkwy, Rancho Santa Margarita, CA 92688, USA', 'Rancho Santa Margarita', 'CA', '92688', 'Landscaping', 5, 271, 'https://www.southgreentreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Fontana Nursery', NULL, NULL, '(909) 827-4254', '15380 Foothill Blvd, Fontana, CA 92335, USA', 'Fontana', 'CA', '92335', 'Landscaping', 3.9, 18, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, '荷竹園 G & M Nursery', NULL, NULL, '(714) 244-5980', '10151 Cleveland Ave, Riverside, CA 92503, USA', 'Riverside', 'CA', '92503', 'Landscaping', 4.1, 10, 'https://www.facebook.com/lotusbamboogarden', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'C&J Gardening Center', NULL, NULL, '(626) 522-5552', '8681 Grove Ave, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 4.3, 57, 'https://cjgardeningcenter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'J-House Lawn Care and Landscaping', NULL, NULL, '(909) 232-6501', '14945 Yucca Ave unit A, Fontana, CA 92335, USA', 'Fontana', 'CA', '92335', 'Landscaping', 4.4, 68, 'https://www.yardbook.com/new_quote/0a42bc492b2488a6a900430986bd1839df487dad', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LawnStarter Lawn Care Service', NULL, NULL, '(951) 543-4285', '4580 Belford Way, Riverside, CA 92507, USA', 'Riverside', 'CA', '92507', 'Landscaping', 4.4, 85, 'https://www.lawnstarter.com/riverside-ca-lawn-care?utm_source=google&utm_medium=GLocal&utm_campaign=RiversideLocal', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Louie''s Nursery #2', NULL, NULL, '(866) 568-2153', '16310 Porter Ave, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 4.4, 234, 'http://www.louiesnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Adam Hall''s Plant Nursery', NULL, NULL, '(951) 674-9422', '28095 Alessandro Blvd, Moreno Valley, CA 92555, USA', 'Moreno Valley', 'CA', '92555', 'Landscaping', 4.5, 153, 'http://adamhallsnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'La Madrina''s Nursery', NULL, NULL, '(909) 688-3288', '7154 Jurupa Rd, Riverside, CA 92509, USA', 'Riverside', 'CA', '92509', 'Landscaping', 4.5, 58, 'https://www.facebook.com/LaMadrina0894/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ortega''s Jr Tree Care LLC', NULL, NULL, '(951) 316-2083', '5896 Norwood Ave, Riverside, CA 92505, USA', 'Riverside', 'CA', '92505', 'Landscaping', 4.8, 82, 'http://www.ortegasjrtreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Fernando Tree Services', NULL, NULL, '(909) 382-1246', '1773 Genevieve St, San Bernardino, CA 92405, USA', 'San Bernardino', 'CA', '92405', 'Landscaping', 4.8, 144, 'http://fernandostreeservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'HLS Tree Service', NULL, NULL, '(909) 279-5191', '1308 Alessandro Rd, Redlands, CA 92373, USA', 'Redlands', 'CA', '92373', 'Landscaping', 4.8, 100, 'https://hlstreetrimming.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Bonnett Irrigation', NULL, NULL, '(951) 688-2100', '3230 Madison St, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 4.8, 139, 'https://bonnett-irrigation.shoplightspeed.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Blue Rock Materials Garden Center', NULL, NULL, '(951) 242-8080', '28221 Kalmia Ave, Moreno Valley, CA 92555, USA', 'Moreno Valley', 'CA', '92555', 'Landscaping', 4.8, 81, 'https://bluerockmaterials.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Parkview Nursery', NULL, NULL, '(951) 784-6777', '4377 Chicago Ave, Riverside, CA 92507, USA', 'Riverside', 'CA', '92507', 'Landscaping', 4.8, 174, 'https://parkviewnurseries.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Parkview Nursery', NULL, NULL, '(951) 351-6900', '3841 Jackson St, Riverside, CA 92503, USA', 'Riverside', 'CA', '92503', 'Landscaping', 4.8, 237, 'http://parkviewnurseries.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'The Grower''s Depot', NULL, NULL, '(909) 381-9992', '453 S I St, San Bernardino, CA 92410, USA', 'San Bernardino', 'CA', '92410', 'Landscaping', 4.8, 194, 'http://www.thegrowersdepot.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Oasis Turf & Hardscape', NULL, NULL, '(888) 627-4780', '11801 Pierce St Ste 200, Riverside, CA 92505, USA', 'Riverside', 'CA', '92505', 'Landscaping', 4.9, 324, 'https://www.oasisturfca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orozco Landscaping Services', NULL, NULL, '(951) 623-9813', '175 Peppertree Dr, Perris, CA 92571, USA', 'Perris', 'CA', '92571', 'Landscaping', 4.9, 85, 'https://www.orozcolandscapingservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'MCA Tree Service Inc', NULL, NULL, '(909) 202-3351', '15407 Iris Dr, Fontana, CA 92335, USA', 'Fontana', 'CA', '92335', 'Landscaping', 4.9, 64, 'https://mcatreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'D&N Tree Care Inc', NULL, NULL, '(909) 678-5193', '1448 E Elma Ct, Ontario, CA 91764, USA', 'Ontario', 'CA', '91764', 'Landscaping', 4.9, 52, 'https://dntreecareinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Melendez Tree Service', NULL, NULL, '(714) 576-2792', '14099 Knowlwood Ct, Corona, CA 92880, USA', 'Corona', 'CA', '92880', 'Landscaping', 5, 84, 'https://melendeztree.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Utility Plumbing Services', NULL, NULL, '(888) 778-8734', '10700 Jersey Blvd #220, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 5, 199, 'https://utilityplumbingservices.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp-listing', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'CJS LANDSCAPE SOLUTIONS', NULL, NULL, '(858) 899-3817', '2034 Balboa Ave, San Diego, CA 92109, USA', 'San Diego', 'CA', '92109', 'Landscaping', 4.1, 17, 'http://cjslandscapesolutions.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ultra Landscaping', NULL, NULL, '(619) 749-6365', '12254 Lakeshore Dr, Lakeside, CA 92040, USA', 'Lakeside', 'CA', '92040', 'Landscaping', 4.2, 10, 'https://www.ultralandscapingsandiego.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'North Park Nursery', NULL, NULL, '(619) 795-1855', '2335 University Ave, San Diego, CA 92104, USA', 'San Diego', 'CA', '92104', 'Landscaping', 4.3, 112, 'http://northparknursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Everde Growers - Miramar Farm and Landscape Center', NULL, NULL, '(858) 552-0592', '5400 Governor Dr, San Diego, CA 92122, USA', 'San Diego', 'CA', '92122', 'Landscaping', 4.3, 84, 'https://everde.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LawnStarter', NULL, NULL, '(858) 943-2121', '5613 Campanile Way, San Diego, CA 92115, USA', 'San Diego', 'CA', '92115', 'Landscaping', 4.6, 252, 'https://www.lawnstarter.com/san-diego-ca-lawn-care?utm_source=google&utm_medium=GLocal&utm_campaign=SanDiegoLocal', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Terra Bella Nursery', NULL, NULL, '(619) 585-1118', '3535 Camino del Rio W, San Diego, CA 92110, USA', 'San Diego', 'CA', '92110', 'Landscaping', 4.7, 225, 'https://www.terrabellanursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Terra Bella Nursery, Inc.', NULL, NULL, '(619) 585-1118', '302 Hollister St, San Diego, CA 92154, USA', 'San Diego', 'CA', '92154', 'Landscaping', 4.7, 217, 'http://www.terrabellanursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Point Loma Native Plant Garden', NULL, NULL, '(619) 297-7380', '2275 Mendocino Blvd, San Diego, CA 92107, USA', 'San Diego', 'CA', '92107', 'Landscaping', 4.7, 52, 'http://sandiegoriver.org/point_loma.html', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Planter Paradise Inc', NULL, NULL, '(619) 440-6563', '1146 E Chase Ave, El Cajon, CA 92020, USA', 'El Cajon', 'CA', '92020', 'Landscaping', 4.7, 251, 'https://planter-paradise-inc.com-place.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Designs 4 You Remodeling', NULL, NULL, '(619) 914-6645', '9434 Chesapeake Dr Suite 1211, San Diego, CA 92123, USA', 'San Diego', 'CA', '92123', 'Landscaping', 4.8, 170, 'https://www.designs4yousd.com/?utm_campaign=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mueller Landscape Inc', NULL, NULL, '(619) 391-3887', '11774 Hi Ridge Rd, Lakeside, CA 92040, USA', 'Lakeside', 'CA', '92040', 'Landscaping', 4.8, 243, 'https://muellerlandscapeinc.com/?utm_source=google&utm_medium=organic&utm_campaign=profile+link', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Walter Andersen Nursery', NULL, NULL, '(619) 224-8271', '3642 Enterprise St, San Diego, CA 92110, USA', 'San Diego', 'CA', '92110', 'Landscaping', 4.8, 455, 'http://www.walterandersen.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Hunter''s Nursery Inc', NULL, NULL, '(619) 463-9341', '3110 Sweetwater Rd, Lemon Grove, CA 91945, USA', 'Lemon Grove', 'CA', '91945', 'Landscaping', 4.8, 152, 'http://www.huntersnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Gardens Nursery', NULL, NULL, '(858) 483-7846', '4910 Cass St, San Diego, CA 92109, USA', 'San Diego', 'CA', '92109', 'Landscaping', 4.8, 169, 'http://www.greengardenssd.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'City Farmers Nursery', NULL, NULL, '(619) 284-6358', '3110 Euclid Ave, San Diego, CA 92105, USA', 'San Diego', 'CA', '92105', 'Landscaping', 4.8, 363, 'http://www.cityfarmersnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rancho Valhalla Nursery', NULL, NULL, '(619) 590-1025', '1998 E Chase Ave A, El Cajon, CA 92020, USA', 'El Cajon', 'CA', '92020', 'Landscaping', 4.8, 108, 'https://ranchovalhallanursery.wordpress.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rose and Cactus Gardens', NULL, NULL, '(619) 239-0512', 'San Diego, CA 92104, USA', 'San Diego', 'CA', '92104', 'Landscaping', 4.8, 104, 'https://www.balboapark.org/gardens/rose-garden', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Walter Andersen Nursery-Poway', NULL, NULL, '(858) 513-4900', '12755 Danielson Ct, Poway, CA 92064, USA', 'Poway', 'CA', '92064', 'Landscaping', 4.8, 882, 'http://www.walterandersen.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Coffee', NULL, NULL, '(619) 500-8004', '2611 Congress St, San Diego, CA 92110, USA', 'San Diego', 'CA', '92110', 'Landscaping', 4.8, 212, 'https://gardencoffegogo.site/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'CM Precision Tree and Landscape Maintenance Inc', NULL, NULL, '(619) 815-4058', '4401 Twain Ave, San Diego, CA 92120, USA', 'San Diego', 'CA', '92120', 'Landscaping', 5, 182, 'https://treeserviceinsandiego.com/?utm_campaign=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tree Loyalty LLC', NULL, NULL, '(619) 372-5084', 'PO Box 123, 7770 Regents Rd #113, La Jolla, CA 92037, USA', 'San Diego', 'CA', '92037', 'Landscaping', 5, 85, 'http://www.treeloyalty.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tree Service San Diego', NULL, NULL, '(858) 201-5554', '5187 San Aquario Dr, San Diego, CA 92109, USA', 'San Diego', 'CA', '92109', 'Landscaping', 5, 59, 'https://treeservicesandiegoca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'ESCOBAR TREE SERVICE & STUMP GRINDER', NULL, NULL, '(619) 771-8418', '3596 Chamoune Ave, San Diego, CA 92105, USA', 'San Diego', 'CA', '92105', 'Landscaping', 5, 94, 'https://escobartreeservicestumpgrinder.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Higuera Tree Care', NULL, NULL, '(619) 300-1340', '187 Mace St Suite H, Chula Vista, CA 91911, USA', 'Chula Vista', 'CA', '91911', 'Landscaping', 5, 100, 'https://www.higueratreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sego Nursery Inc', NULL, NULL, '(818) 763-5711', '12126 Burbank Blvd, Valley Village, CA 91607, USA', 'Los Angeles', 'CA', '91607', 'Landscaping', 4.2, 166, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rolling Greens Beverly Grove', NULL, NULL, '(310) 559-8656', '7505 Beverly Blvd, Los Angeles, CA 90036, USA', 'Los Angeles', 'CA', '90036', 'Landscaping', 4.3, 113, 'https://www.rollinggreens.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Dream Garden', NULL, NULL, '(323) 465-0161', '6751 Sunset Blvd, Los Angeles, CA 90028, USA', 'Los Angeles', 'CA', '90028', 'Landscaping', 4.3, 72, 'https://artshopla.wixsite.com/thedreamgarden', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rolling Greens Culver City', NULL, NULL, '(310) 559-8656', '9528 Jefferson Blvd, Culver City, CA 90232, USA', 'Culver City', 'CA', '90232', 'Landscaping', 4.6, 113, 'https://www.rollinggreens.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'California Cactus Center', NULL, NULL, '(626) 795-2788', '216 S Rosemead Blvd, Pasadena, CA 91107, USA', 'Pasadena', 'CA', '91107', 'Landscaping', 4.6, 94, 'http://cactuscenter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lincoln Ave. Nursery', NULL, NULL, '(626) 792-2138', '804 Lincoln Ave, Pasadena, CA 91103, USA', 'Pasadena', 'CA', '91103', 'Landscaping', 4.7, 201, 'https://lincolnavenuenursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sunset Boulevard Nursery', NULL, NULL, '(323) 661-1642', '4368 Sunset Blvd, Los Angeles, CA 90029, USA', 'Los Angeles', 'CA', '90029', 'Landscaping', 4.7, 226, 'http://www.sunsetblvdnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Picture Build', NULL, NULL, '(818) 514-8764', '12410 Foothill Blvd Unit U, Sylmar, CA 91342, USA', 'Los Angeles', 'CA', '91342', 'Landscaping', 4.8, 75, 'https://www.picturebuild.com/?utm_campaign=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'American Eagle Tree Service', NULL, NULL, '(818) 457-0891', '12110 Gager St, Sylmar, CA 91342, USA', 'Los Angeles', 'CA', '91342', 'Landscaping', 4.9, 66, 'https://jesusamericaneagle.wixsite.com/americaneagletreeser', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tansy', NULL, NULL, '(800) 580-0541', '2120 W Magnolia Blvd, Burbank, CA 91506, USA', 'Burbank', 'CA', '91506', 'Landscaping', 4.9, 107, 'https://shoptansy.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Maria’s Garden Center', NULL, NULL, '(310) 527-7750', '20300 S Figueroa St, Carson, CA 90745, USA', 'Carson', 'CA', '90745', 'Landscaping', 4.5, 79, 'http://www.mariasgardencenter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'C&S Garden Center', NULL, NULL, '(424) 435-5506', '4167 Marine Ave, Lawndale, CA 90260, USA', 'Lawndale', 'CA', '90260', 'Landscaping', 4.9, 51, 'http://www.csgardencenter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Greenplace Inc', NULL, NULL, '(714) 399-7718', '2151 Pacific Ave A205, Costa Mesa, CA 92627, USA', 'Costa Mesa', 'CA', '92627', 'Landscaping', 5, 73, 'https://greenplaceusa.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Los Feliz Nursery', NULL, NULL, '(909) 461-7435', '4182 Descanso Ave, Chino Hills, CA 91709, USA', 'Chino Hills', 'CA', '91709', 'Landscaping', 3.9, 10, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Van Ness Water Gardens', NULL, NULL, '(909) 982-2425', '2460 N Euclid Ave, Upland, CA 91784, USA', 'Upland', 'CA', '91784', 'Landscaping', 4.7, 61, 'http://www.vnwg.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Vivid Landscape', NULL, NULL, '(626) 654-3766', '1860 W 9th St, Upland, CA 91786, USA', 'Upland', 'CA', '91786', 'Landscaping', 4.8, 54, 'https://www.vividlandscapeinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Smith Landscape', NULL, NULL, '(909) 456-9123', '154 W Foothill Blvd Unit 356, Upland, CA 91786, USA', 'Upland', 'CA', '91786', 'Landscaping', 4.8, 50, 'https://www.smithlandscapemasonry.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Glendora Gardens Nursery', NULL, NULL, '(626) 914-6718', '1132 S Grand Ave, Glendora, CA 91740, USA', 'Glendora', 'CA', '91740', 'Landscaping', 4.8, 307, 'http://www.glendoragardens.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tom Day Tree Service Inc', NULL, NULL, '(909) 629-6960', '275 Sierra Pl, Upland, CA 91786, USA', 'Upland', 'CA', '91786', 'Landscaping', 4.9, 60, 'https://tomdaytreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Plant Safari', NULL, NULL, '(909) 946-1104', '653 N Central Ave, Upland, CA 91786, USA', 'Upland', 'CA', '91786', 'Landscaping', 4.9, 221, 'https://www.plantsafari.biz/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Paredes Nursery, Inc.', NULL, NULL, '(909) 875-2589', '138 S Meridian Ave, Rialto, CA 92376, USA', 'Rialto', 'CA', '92376', 'Landscaping', 3.8, 13, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Yoshi''s Lawnmower', NULL, NULL, '(951) 684-0292', '3350 Mary St, Riverside, CA 92506, USA', 'Riverside', 'CA', '92506', 'Landscaping', 4, 23, NULL, 'new'::lead_status, 'hot'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Richie''s Lawn & Sprinkler Service', NULL, NULL, '(909) 360-8989', '11660 Church St, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 4.1, 23, 'https://rlss.aimhighwebsites.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'South Bay Sprinklers', NULL, NULL, '(310) 378-7606', '4001 W 242nd St, Torrance, CA 90505, USA', 'Torrance', 'CA', '90505', 'Landscaping', 4.2, 6, 'http://southbaysprinklers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Center | The Home Depot', NULL, NULL, '(714) 539-0319', '10801 Garden Grove Blvd, Garden Grove, CA 92843, USA', 'Garden Grove', 'CA', '92843', 'Landscaping', 4.3, 40, 'https://www.homedepot.com/l/Garden-Grove/CA/Garden-Grove/92843/6639/garden-center?emt=GCGMBGoogleMaps', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Unique Tree service', NULL, NULL, '(714) 402-0169', '747 N Philadelphia St, Anaheim, CA 92805, USA', 'Anaheim', 'CA', '92805', 'Landscaping', 4.4, 25, 'https://uniquetreeservicei.wixsite.com/website', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rosewood Landscape, Inc.', NULL, NULL, '(424) 306-1177', '318 Tejon Pl, Palos Verdes Estates, CA 90274, USA', 'Palos Verdes Estates', 'CA', '90274', 'Landscaping', 4.5, 41, 'https://www.rosewoodlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Los Angeles CA Tree Service', NULL, NULL, '(323) 736-4900', '360 Burnside Ave #11K, Los Angeles, CA 90036, USA', 'Los Angeles', 'CA', '90036', 'Landscaping', 4.7, 30, 'https://losangelescatreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'C&A Tree Care Services Inc', NULL, NULL, '(714) 666-2590', '7082 Thomas St, Buena Park, CA 90621, USA', 'Buena Park', 'CA', '90621', 'Landscaping', 4.7, 39, 'https://www.catreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'JC Tree Care and Landscape', NULL, NULL, '(714) 675-0978', '107 W Delft Ave, Santa Ana, CA 92703, USA', 'Santa Ana', 'CA', '92703', 'Landscaping', 4.8, 47, 'http://www.jctreecareandlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Four Seasons Landscaping', NULL, NULL, '(323) 375-8000', '6337 Santa Fe Ave, Huntington Park, CA 90255, USA', 'Huntington Park', 'CA', '90255', 'Landscaping', 4.9, 32, 'https://www.fourseasonsla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Luna Landscape Co', NULL, NULL, '(626) 862-2110', '15407 Garo St, Hacienda Heights, CA 91745, USA', 'Hacienda Heights', 'CA', '91745', 'Landscaping', 4.9, 42, 'https://www.lunalandscapeco.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Titan Pavers Los Angeles - Paver Installation', NULL, NULL, '(818) 826-2327', '425 S Fairfax Ave #309, Los Angeles, CA 90036, USA', 'Los Angeles', 'CA', '90036', 'Landscaping', 4.9, 41, 'https://titanpavers.com/paver-installation-los-angeles/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Excellence landscaping and Maintenance', NULL, NULL, '(323) 691-4607', '11312 Buell St, Downey, CA 90241, USA', 'Downey', 'CA', '90241', 'Landscaping', 5, 35, 'https://excellencelandscapingservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Beach Cities Tree Care Inc', NULL, NULL, '(424) 310-9392', '1106 Barbara St, Torrance, CA 90505, USA', 'Torrance', 'CA', '90505', 'Landscaping', 5, 31, 'http://www.beachcitiestreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Stacker Landscaping + Concrete', NULL, NULL, '(626) 506-0018', '13131 Judith St, Baldwin Park, CA 91706, USA', 'Baldwin Park', 'CA', '91706', 'Landscaping', 4, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Your Way Tree Service Inc.', NULL, NULL, '(818) 882-2335', '12318 Branford St, Sun Valley, CA 91352, USA', 'Los Angeles', 'CA', '91352', 'Landscaping', 4.4, 30, 'https://yourwaytreeserviceinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Johnson Tree Service', NULL, NULL, '(626) 447-5239', '401 Montana St, Monrovia, CA 91016, USA', 'Monrovia', 'CA', '91016', 'Landscaping', 4.5, 37, 'https://treeservice-sangabrielvalley.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Deibys Landscape & concrete inc.', NULL, NULL, '(562) 331-2863', '12155 Eastman St, Cerritos, CA 90703, USA', 'Cerritos', 'CA', '90703', 'Landscaping', 4.6, 43, 'http://www.cerritoslandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Grounds Landscape Services', NULL, NULL, '(323) 452-9945', '5401 W Adams Blvd, Los Angeles, CA 90016, USA', 'Los Angeles', 'CA', '90016', 'Landscaping', 4.8, 29, 'http://www.greengrounds.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Colibri Landscape & Design', NULL, NULL, '(818) 730-7339', '4949 Tyrone Ave, Sherman Oaks, CA 91423, USA', 'Los Angeles', 'CA', '91423', 'Landscaping', 4.9, 42, 'https://colibrilandscapedesign.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'A Sandoval Tree Service', NULL, NULL, '(818) 455-3368', '13375 Wingo St, Arleta, CA 91331, USA', 'Los Angeles', 'CA', '91331', 'Landscaping', 4.9, 45, 'https://www.asandovaltreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Jimmie’s Tree Service Inc.', NULL, NULL, '(562) 423-6202', 'Long Beach, CA 90805, USA', 'Long Beach', 'CA', '90805', 'Landscaping', 4.9, 39, 'http://www.jimmiestreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Artscape Gardens', NULL, NULL, '(323) 510-8305', '4654 Carnegie St, Los Angeles, CA 90032, USA', 'Los Angeles', 'CA', '90032', 'Landscaping', 4.9, 37, 'http://artscapegardens.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'HB Landscape Design LLC', NULL, NULL, '(310) 254-0937', 'Federal Ave, Los Angeles, CA 90025, USA', 'Los Angeles', 'CA', '90025', 'Landscaping', 4.9, 42, 'http://www.hblandscapedesign.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lush Gardens Inc', NULL, NULL, '(818) 245-4447', '14622 Ventura Blvd #760, Sherman Oaks, CA 91403, USA', 'Los Angeles', 'CA', '91403', 'Landscaping', 4.9, 32, 'https://lushgardensinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Works Landscape Service', NULL, NULL, '(310) 930-5353', '2444 Chelsea Pl, Santa Monica, CA 90404, USA', 'Santa Monica', 'CA', '90404', 'Landscaping', 5, 39, 'http://www.landscapingtreela.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Splendor Landscaping - Pasadena Landscape & Garden Design', NULL, NULL, '(626) 710-2227', '1963 Santa Rosa Ave, Pasadena, CA 91104, USA', 'Pasadena', 'CA', '91104', 'Landscaping', 5, 26, 'https://greensplendorlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lonestar Builders CA', NULL, NULL, '(323) 633-7766', '467 Arnaz Dr, Los Angeles, CA 90048, USA', 'Los Angeles', 'CA', '90048', 'Landscaping', 5, 32, 'https://lonestarbuildersca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Barba Landscape & Design', NULL, NULL, '(310) 877-4008', '710 Marine St, Santa Monica, CA 90405, USA', 'Santa Monica', 'CA', '90405', 'Landscaping', 5, 40, 'https://www.barbalandscapedesign.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Hye Turf Designs', NULL, NULL, '(818) 817-1488', '6429 Mammoth Ave, Van Nuys, CA 91401, USA', 'Los Angeles', 'CA', '91401', 'Landscaping', 5, 33, 'https://www.hyeturfdesigns.com/?y_source=1_MTA1MTY2OTI4OS03MTUtbG9jYXRpb24ud2Vic2l0ZQ%3D%3D', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Scapes La', NULL, NULL, '(818) 505-3477', '12822 Sherman Way, North Hollywood, CA 91605, USA', 'Los Angeles', 'CA', '91605', 'Landscaping', 5, 34, 'http://scapesla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Serenity Gardening & Landscaping Services', NULL, NULL, '(626) 956-3891', '18654 Altario St, La Puente, CA 91744, USA', 'La Puente', 'CA', '91744', 'Landscaping', 3.9, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Brita''s Old Town Gardens', NULL, NULL, '(562) 430-5019', '225 Main St A, Seal Beach, CA 90740, USA', 'Seal Beach', 'CA', '90740', 'Landscaping', 4.2, 33, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'California Greenhouses - House Plant Nursery', NULL, NULL, '(949) 552-9619', '3350 Warner Ave, Irvine, CA 92606, USA', 'Irvine', 'CA', '92606', 'Landscaping', 4.4, 34, 'http://www.calgreenhouses.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Paez Tree Service', NULL, NULL, '(714) 926-9413', '1705 S State College Blvd, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 4.6, 42, 'https://www.paeztreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'OC Sprinkler Doctor', NULL, NULL, '(714) 818-9644', '3721 Franklin Ave APT B, Fullerton, CA 92833, USA', 'Fullerton', 'CA', '92833', 'Landscaping', 4.8, 49, 'http://sprinklerdoctoroc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Peterson''s Tree Works Inc', NULL, NULL, '(714) 771-4243', '605 N Rancho Santiago Blvd, Orange, CA 92869, USA', 'Orange', 'CA', '92869', 'Landscaping', 4.9, 48, 'http://www.petersonstreeworks.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Richard Diaz Landscape', NULL, NULL, '(714) 673-2643', '633 N Heatherstone Dr, Orange, CA 92869, USA', 'Orange', 'CA', '92869', 'Landscaping', 4.9, 29, 'https://richarddiazlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mejia’s Tree Service', NULL, NULL, '(909) 236-9836', '1773 Fleming St, Pomona, CA 91766, USA', 'Pomona', 'CA', '91766', 'Landscaping', 5, 26, 'http://mejiastreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Reliable Tree Service', NULL, NULL, '(714) 528-1092', '18032 Lemon Dr #204, Yorba Linda, CA 92886, USA', 'Yorba Linda', 'CA', '92886', 'Landscaping', 5, 40, 'https://www.reliabletreeserv.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'OC West Landscape', NULL, NULL, '(949) 939-6639', '8583 Irvine Center Dr Suite 370, Irvine, CA 92618, USA', 'Irvine', 'CA', '92618', 'Landscaping', 5, 34, 'http://ocwest.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tavera''s Custom Landscape', NULL, NULL, '(714) 396-4552', '2720 E Walnut Ave UNIT 61, Orange, CA 92867, USA', 'Orange', 'CA', '92867', 'Landscaping', 5, 47, 'https://taverascustomlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'W BROTHERS LANDSCAPE, Inc.', NULL, NULL, '(855) 927-6757', '159 N Pixley St, Orange, CA 92868, USA', 'Orange', 'CA', '92868', 'Landscaping', 5, 27, 'http://wbroslandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Signature Landscape', NULL, NULL, '(949) 755-8636', '25862 Jamon Ln, Mission Viejo, CA 92691, USA', 'Mission Viejo', 'CA', '92691', 'Landscaping', 4.8, 45, 'https://www.signaturelandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Coastal Arbor Tree Service Inc', NULL, NULL, '(949) 392-3100', '32932 Avenida Descanso #4412, San Juan Capistrano, CA 92675, USA', 'San Juan Capistrano', 'CA', '92675', 'Landscaping', 5, 29, 'https://coastalarbortreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lucky Smartscape', NULL, NULL, '(833) 243-8999', '999 Corporate Dr Suite 100 #3425, Ladera Ranch, CA 92694, USA', 'Ladera Ranch', 'CA', '92694', 'Landscaping', 5, 30, 'http://luckysmartscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lifetime Outdoor Living', NULL, NULL, '(949) 919-0339', '1968 S Coast Hwy Suite 570, Laguna Beach, CA 92651, USA', 'Laguna Beach', 'CA', '92651', 'Landscaping', 5, 47, 'https://lifetimeoutdoorliving.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'J&M Tree Service Moreno Valley', NULL, NULL, '(951) 524-7131', '12410 Graham St, Moreno Valley, CA 92553, USA', 'Moreno Valley', 'CA', '92553', 'Landscaping', 4.2, 5, 'http://www.riversidetreecare.com/tree-service-moreno-valley', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pena Nursery', NULL, NULL, '(909) 875-0594', '10545 Spruce Ave, Bloomington, CA 92316, USA', 'Bloomington', 'CA', '92316', 'Landscaping', 4.2, 30, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Meza’s landscaping supplies', NULL, NULL, '(951) 570-0309', '21740 Elmwood St, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 4.4, 48, 'https://www.mesaslandscapingsupplies.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Valley Pacific Landscape, Inc', NULL, NULL, '(951) 741-5146', '11698 Capitol Dr, Riverside, CA 92503, USA', 'Riverside', 'CA', '92503', 'Landscaping', 4.5, 26, 'https://www.valleypacificlandscapinginc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'O&B LANDSCAPE', NULL, NULL, '(951) 732-0369', '2130 N Arrowhead Ave, San Bernardino, CA 92405, USA', 'San Bernardino', 'CA', '92405', 'Landscaping', 4.5, 30, 'http://www.oblandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'dthree landscape', NULL, NULL, '(909) 638-9298', 'Norco, CA 92860, USA', 'Norco', 'CA', '92860', 'Landscaping', 4.7, 29, 'http://dthreelandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Kens tree Service', NULL, NULL, '(951) 212-0936', '31105 Lakeview Ave E, Nuevo, CA 92567, USA', 'Nuevo', 'CA', '92567', 'Landscaping', 4.8, 26, 'https://kenstreeservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Sky Irrigation', NULL, NULL, '(951) 259-2100', '682 Spinnaker Dr, Perris, CA 92571, USA', 'Perris', 'CA', '92571', 'Landscaping', 4.8, 37, 'http://www.greenskyirrigation.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Perris Hydroponics', NULL, NULL, '(909) 639-4769', '351 Wilkerson Ave UNIT D, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 4.8, 37, 'https://perrishydroponics.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Goodman’s landscape', NULL, NULL, '(951) 238-5042', '24350 Hernandez St, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 4.9, 36, 'https://www.goodmanlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Modern Landscape', NULL, NULL, '(951) 462-2276', '700 E Redlands Blvd, Redlands, CA 92373, USA', 'Redlands', 'CA', '92373', 'Landscaping', 4.9, 26, 'https://modernlandscape.net/about-us/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Paz Landscape & Concrete', NULL, NULL, '(951) 785-8274', '6725 Capistrano Way, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 5, 35, 'http://www.pazlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lorenzo''s Landscaping', NULL, NULL, '(951) 941-3151', '2310 5th St, Riverside, CA 92507, USA', 'Riverside', 'CA', '92507', 'Landscaping', 5, 25, 'http://lorenzo-landscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Houston''s Landscaping', NULL, NULL, '(909) 521-1272', '29177 Stevens Ave, Moreno Valley, CA 92555, USA', 'Moreno Valley', 'CA', '92555', 'Landscaping', 5, 44, 'https://www.houstons-landscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Schubert Landscaping and Irrigation repair', NULL, NULL, '(909) 862-4477', '7745 Boulder Ave, Highland, CA 92346, USA', 'Highland', 'CA', '92346', 'Landscaping', 5, 41, 'http://schubertlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Cruz Sons Concrete & Tree Service', NULL, NULL, '(909) 515-3230', '18876 Lisa Ln, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 5, 30, 'https://www.cruzsonsconcretetreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Horizon Landscaping Co', NULL, NULL, '(951) 837-5781', '1784 Auburn Ct, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 5, 39, 'https://sopi1.my.canva.site/greenhorizonlandscapingco', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'JB Landscape', NULL, NULL, '(951) 454-5096', '23106 Claystone Ave, Corona, CA 92883, USA', 'Corona', 'CA', '92883', 'Landscaping', 5, 33, 'http://jblandscapeca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Agustin''s Irrigation Service', NULL, NULL, '(619) 670-7933', '10879 Wagon Wheel Dr, Spring Valley, CA 91978, USA', 'Spring Valley', 'CA', '91978', 'Landscaping', 4.5, 30, 'http://agustinirrigationservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ace Mega Succulents', NULL, NULL, '(619) 646-9026', '8070 Mt Vernon St, Lemon Grove, CA 91945, USA', 'Lemon Grove', 'CA', '91945', 'Landscaping', 4.6, 46, 'http://www.acemegasucculents.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ong Nursery', NULL, NULL, '(858) 277-8167', '2528 Crandall Dr, San Diego, CA 92111, USA', 'San Diego', 'CA', '92111', 'Landscaping', 4.6, 49, 'http://www.ongnursery.com/index.html', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lowe''s', NULL, NULL, '(619) 212-4100', '9416 Mission Gorge Rd, Santee, CA 92071, USA', 'Santee', 'CA', '92071', 'Landscaping', 4.6, 29, 'https://www.lowes.com/l/gardencenter.html?cm_mmc=YEXT-_-GC', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'John''s Lawn & Garden Landscaping', NULL, NULL, '(619) 852-8458', '4223 Genesee Ave, San Diego, CA 92117, USA', 'San Diego', 'CA', '92117', 'Landscaping', 4.7, 47, 'https://www.johnslawngarden.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'ArborSD Tree Service', NULL, NULL, '(858) 609-7034', '3834 Pendiente Ct APT S207, San Diego, CA 92124, USA', 'San Diego', 'CA', '92124', 'Landscaping', 4.8, 29, 'https://sandiegotreeservice.co/?utm_source=googlebusinessprofile&utm_medium=organic&utm_campaign=Google+Business+Profile', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Rabbit Professional Lawn Care', NULL, NULL, '(858) 888-2471', '6920 Miramar Rd, San Diego, CA 92121, USA', 'San Diego', 'CA', '92121', 'Landscaping', 4.9, 45, 'http://greenrabbitlawn.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tijuana Irrigation Supply', NULL, NULL, '664 904 9642', 'C. San Ignacio 8532, Campestre Murua, 22455 Tijuana, B.C., Mexico', 'Campestre Murua', 'B.C.', '22455', 'Landscaping', 4.9, 28, 'http://www.tijuanairrigationsupply.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rock N Block - Turf N Hardscapes - San Diego', NULL, NULL, '(619) 431-4706', '3517 Camino del Rio S #215, San Diego, CA 92108, USA', 'San Diego', 'CA', '92108', 'Landscaping', 5, 40, 'https://rocknblocklandscape.com/locations/san-diego/?utm_campaign=gmb&utm_medium=organic&utm_source=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Stepping Stone Landscape Design', NULL, NULL, '(619) 762-8988', '1455 Frazee Rd Suite 500, San Diego, CA 92108, USA', 'San Diego', 'CA', '92108', 'Landscaping', 5, 27, 'https://steppingstonelandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'I.B Gardener & Junk Removal Services', NULL, NULL, '(619) 354-8054', '600 Emory St, Imperial Beach, CA 91932, USA', 'Imperial Beach', 'CA', '91932', 'Landscaping', 5, 25, 'https://www.facebook.com/ibgardener?mibextid=ZbWKwL', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Coronado Best Turf', NULL, NULL, '(619) 500-8873', '4231 Balboa Ave Suite 1054, San Diego, CA 92117, USA', 'San Diego', 'CA', '92117', 'Landscaping', 5, 34, 'http://www.coronadoturf.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'HLE Landscape & Design', NULL, NULL, '(619) 320-5197', '8105 Lemon Ave, La Mesa, CA 91941, USA', 'La Mesa', 'CA', '91941', 'Landscaping', 5, 26, 'https://hlelandscapeanddesign.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Botanically Crafted Landscapes', NULL, NULL, '(619) 383-4396', '4470 Monahan Rd, La Mesa, CA 91941, USA', 'La Mesa', 'CA', '91941', 'Landscaping', 5, 28, 'http://botanicallycrafted.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Aldape G Landscaping Inc', NULL, NULL, '(619) 646-1046', '6435 Tooley St, San Diego, CA 92114, USA', 'San Diego', 'CA', '92114', 'Landscaping', 5, 27, 'https://aldapeglandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'San Diego Worm Farm', NULL, NULL, '(619) 933-7117', '6649 Richard St, San Diego, CA 92115, USA', 'San Diego', 'CA', '92115', 'Landscaping', 5, 44, 'http://sandiegowormfarm.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Reveles Landscaping & Tree Service', NULL, NULL, '(818) 233-4816', '750 N San Vicente Blvd, West Hollywood, CA 90069, USA', 'West Hollywood', 'CA', '90069', 'Landscaping', 4.2, 5, 'https://www.revelesenterprises.com/revelesexteriors', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Temple Garden Center', NULL, NULL, '(626) 452-0133', '11314 Lower Azusa Rd, El Monte, CA 91732, USA', 'El Monte', 'CA', '91732', 'Landscaping', 4.2, 37, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Shalbro Construction & Roofing', NULL, NULL, '(323) 433-6784', '907 Flower St, Los Angeles, CA 90015, USA', 'Los Angeles', 'CA', '90015', 'Landscaping', 5, 31, 'https://www.shalbroconstructionandroofing.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Worx Inc.', NULL, NULL, '(626) 383-5682', 'Calais st, Baldwin Park, CA 91706, USA', 'Baldwin Park', 'CA', '91706', 'Landscaping', 5, 31, 'http://www.gardenworxlandscapes.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Peter''s Garden Center', NULL, NULL, '(310) 372-2288', '814 N Pacific Coast Hwy, Redondo Beach, CA 90277, USA', 'Redondo Beach', 'CA', '90277', 'Landscaping', 4.8, 42, 'https://www.instagram.com/petersgardencenter/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Hawthorne Tree Service', NULL, NULL, '(310) 598-3574', '11719 Wilkie Ave, Hawthorne, CA 90250, USA', 'Hawthorne', 'CA', '90250', 'Landscaping', 4.9, 30, 'https://www.hawthornetreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Toro Nursery', NULL, NULL, '(310) 715-1982', '17585 Crenshaw Blvd, Torrance, CA 90504, USA', 'Torrance', 'CA', '90504', 'Landscaping', 4.9, 48, 'http://toronursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Finley''s Tree & Landcare', NULL, NULL, '(310) 326-9818', '1209 W 228th St, Torrance, CA 90502, USA', 'Torrance', 'CA', '90502', 'Landscaping', 5, 44, 'https://www.finleystreeandlandcare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Maverick Drains', NULL, NULL, '(323) 742-4665', '10516 Main St, Los Angeles, CA 90003, USA', 'Los Angeles', 'CA', '90003', 'Landscaping', 5, 35, 'http://www.maverickdraininc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'JLG Tree Service - Tree Removal OC', NULL, NULL, '(714) 770-1850', '1440 S State College Blvd Suite 3D, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 4.9, 49, 'https://www.jlgtreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Vargas Tree Services Inc', NULL, NULL, '(714) 630-5337', '1035 S Chantilly St, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 4.9, 32, 'http://www.vargastreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Black Diamond Paver Stones & Landscape, Inc.', NULL, NULL, '(949) 352-4759', '7545 Irvine Center Dr Ste 200, Irvine, CA 92618, USA', 'Irvine', 'CA', '92618', 'Landscaping', 4.9, 35, 'https://blackdiamondlandscape.com/orange-county/?utm_source=Google&utm_medium=GMB&utm_campaign=OrangeCountyIrvine', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Simple Outdoor Living', NULL, NULL, '(714) 388-5878', '17875 Von Karman Ave suit 150, Irvine, CA 92614, USA', 'Irvine', 'CA', '92614', 'Landscaping', 4.9, 45, 'http://www.simpleoutdoorliving.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Awakenings', NULL, NULL, '(626) 295-1620', '458 W Monterey Ave, Pomona, CA 91768, USA', 'Pomona', 'CA', '91768', 'Landscaping', 4.9, 37, 'http://gardenawakeningsllc.squarespace.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'South County Landscapes', NULL, NULL, '(949) 637-1159', '31221 Calle Del Campo, San Juan Capistrano, CA 92675, USA', 'San Juan Capistrano', 'CA', '92675', 'Landscaping', 4.9, 42, 'https://southcountylandscapes.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Standard Design Group Nursery Partnership with Highland Garden Center', NULL, NULL, '(805) 515-4315', '600 E 19th St, Upland, CA 91784, USA', 'Upland', 'CA', '91784', 'Landscaping', 4.5, 47, 'http://www.thestandarddesigngroup.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Natural Earth Sustainable Landscape & Design', NULL, NULL, '(909) 398-1235', '1420 N Claremont Blvd #200-C, Claremont, CA 91711, USA', 'Claremont', 'CA', '91711', 'Landscaping', 4.6, 32, 'https://naturalearthla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Norens Nursery', NULL, NULL, '(909) 331-6133', '201 W Bonita Ave, Claremont, CA 91711, USA', 'Claremont', 'CA', '91711', 'Landscaping', 4.7, 41, 'http://norensnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garrison Foothill Nursery', NULL, NULL, '(909) 949-9878', '679 E 16th St, Upland, CA 91784, USA', 'Upland', 'CA', '91784', 'Landscaping', 4.9, 28, 'http://socalflora.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Bentson Landscape', NULL, NULL, '(909) 480-9477', 'W 24th St, Upland, CA 91784, USA', 'Upland', 'CA', '91784', 'Landscaping', 5, 26, 'https://bentsonlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'SoCal Nursery', NULL, NULL, '(951) 295-3525', '9312 Ben Nevis Blvd, Riverside, CA 92509, USA', 'Riverside', 'CA', '92509', 'Landscaping', 4.2, 31, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Center @ The Home Depot', NULL, NULL, '(949) 646-4220', '2300 Harbor Blvd, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 4.5, 18, 'https://www.homedepot.com/l/Costa-Mesa/CA/Costa-Mesa/92626/6664/garden-center?emt=GCGMBGoogleMaps', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pacific Coast Landscaping', NULL, NULL, '(714) 773-4865', '3730 W Commonwealth Ave, Fullerton, CA 92833, USA', 'Fullerton', 'CA', '92833', 'Landscaping', 4.6, 19, 'http://www.pacificcoastlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Brothers Landscape Services', NULL, NULL, '(714) 683-4173', '838 Marian Way, Anaheim, CA 92804, USA', 'Anaheim', 'CA', '92804', 'Landscaping', 4.6, 10, 'http://brotherslandscapeoc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lakewood Nursery', NULL, NULL, '(714) 828-9464', '4114 Lincoln Ave, Cypress, CA 90630, USA', 'Cypress', 'CA', '90630', 'Landscaping', 4.6, 119, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Supergreen Landscape', NULL, NULL, '(323) 930-1572', '1838 S La Brea Ave, Los Angeles, CA 90019, USA', 'Los Angeles', 'CA', '90019', 'Landscaping', 4.7, 12, 'http://supergreenlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Firestone Nursery', NULL, NULL, '(323) 385-8945', '1990 Firestone Blvd, Los Angeles, CA 90001, USA', 'Los Angeles', 'CA', '90001', 'Landscaping', 4.7, 22, 'https://firestonenursery.top/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'West Hollywood Landscaping & Hardscaping', NULL, NULL, '(818) 646-4197', '750 N San Vicente Blvd, West Hollywood, CA 90069, USA', 'West Hollywood', 'CA', '90069', 'Landscaping', 4.8, 88, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Cortez Tree Service and Landscaping', NULL, NULL, '(626) 327-6574', '1107 E Larkwood St, West Covina, CA 91790, USA', 'West Covina', 'CA', '91790', 'Landscaping', 4.8, 18, 'https://www.corteztreesvce.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'REYNOSO TREE SERVICE LLC- Reliable Tree Service - Hawthorne', NULL, NULL, '(424) 207-6878', '12700 S Inglewood Ave # 2222, Hawthorne, CA 90251, USA', 'Hawthorne', 'CA', '90251', 'Landscaping', 4.8, 20, 'http://reynosotreeservicellc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Shades of Green Tree Service', NULL, NULL, '(626) 523-3000', '5024 Tierra Antigua Dr, Whittier, CA 90601, USA', 'Whittier', 'CA', '90601', 'Landscaping', 4.8, 15, 'http://shadesofgreentreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Bamboo Nursery & Garden Supplies', NULL, NULL, '(310) 635-1590', '15600 Atlantic Ave, Compton, CA 90221, USA', 'Compton', 'CA', '90221', 'Landscaping', 4.9, 18, 'https://www.instagram.com/bamboo_nursery/profilecard/?igsh=NTc4MTIwNjQ2YQ==', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ruelas Landscaping Inc.', NULL, NULL, '(323) 919-2918', '3336 S La Cienega Blvd Unit 122, Los Angeles, CA 90016, USA', 'Los Angeles', 'CA', '90016', 'Landscaping', 5, 20, 'http://www.ruelaslandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rivera Tree Service, Inc.', NULL, NULL, '(626) 392-7419', '1239 Millbury Ave, La Puente, CA 91746, USA', 'La Puente', 'CA', '91746', 'Landscaping', 5, 24, 'https://www.riveratreeserviceinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'M&M Tree Service Inc.', NULL, NULL, '(626) 322-4994', '14110 Barrydale St, La Puente, CA 91746, USA', 'La Puente', 'CA', '91746', 'Landscaping', 5, 21, 'http://mmtreeserviceinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'AJP LANDSCAPE INC', NULL, NULL, '(323) 420-7758', '4828 St Charles Pl, Los Angeles, CA 90019, USA', 'Los Angeles', 'CA', '90019', 'Landscaping', 5, 19, 'http://www.ajplandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'San Agustin Landscape', NULL, NULL, '(323) 316-5979', '3655 Torrance Blvd STE 300, Torrance, CA 90503, USA', 'Torrance', 'CA', '90503', 'Landscaping', 5, 18, 'https://sanagustinlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ramirez Growers', NULL, NULL, '(310) 291-7308', '19881 Bloomfield Ave, Cerritos, CA 90703, USA', 'Cerritos', 'CA', '90703', 'Landscaping', 5, 22, 'https://ramirezgrowers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'La Crescenta Nursery', NULL, NULL, '(818) 249-2448', '3654 La Crescenta Ave, Glendale, CA 91208, USA', 'Glendale', 'CA', '91208', 'Landscaping', 4.5, 70, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orta Garden Supply, Inc. (Nursery)', NULL, NULL, '(424) 258-6104', '3848 Sepulveda Blvd, Culver City, CA 90230, USA', 'Culver City', 'CA', '90230', 'Landscaping', 4.5, 102, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LawnStarter Landscaping', NULL, NULL, '(424) 324-2113', '1540 Vine St Apartment 346, Los Angeles, CA 90028, USA', 'Los Angeles', 'CA', '90028', 'Landscaping', 4.9, 11, 'https://www.lawnstarter.com/los-angeles-ca-landscaping?utm_source=google&utm_medium=GLocal&utm_campaign=LosAngelesLocal', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lynwood Tree Service', NULL, NULL, '(310) 997-4485', '3576 Mulford Ave, Lynwood, CA 90262, USA', 'Lynwood', 'CA', '90262', 'Landscaping', 4.9, 18, 'https://www.lynwoodtreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Burbank Irrigation Supply', NULL, NULL, '(818) 561-4000', '300 N Victory Blvd, Burbank, CA 91502, USA', 'Burbank', 'CA', '91502', 'Landscaping', 4.9, 12, 'http://burbankirrigationsupply.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Royal Tree Services', NULL, NULL, '(818) 477-7030', '10610 Rhodesia Ave, Sunland, CA 91040, USA', 'Los Angeles', 'CA', '91040', 'Landscaping', 5, 10, 'https://www.royaltrees.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Black Diamond Paver Stones & Landscape, Inc.', NULL, NULL, '(626) 800-3504', '155 N Lake Ave #800, Pasadena, CA 91101, USA', 'Pasadena', 'CA', '91101', 'Landscaping', 5, 10, 'https://blackdiamondlandscape.com/pasadena/?utm_source=Google&utm_medium=GMB&utm_campaign=Pasadena', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Creative Concepts Landscape Management', NULL, NULL, '(818) 248-7436', '2434 Mountain Ave, La Crescenta-Montrose, CA 91214, USA', 'La Crescenta-Montrose', 'CA', '91214', 'Landscaping', 5, 14, 'https://www.creativeconceptsla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'All County Landscape-Hardscape', NULL, NULL, '(888) 720-3316', '18375 Ventura Blvd #453, Tarzana, CA 91356, USA', 'Los Angeles', 'CA', '91356', 'Landscaping', 5, 23, 'http://landscape-hardscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Essence Tree and Landscape Inc.', NULL, NULL, '(818) 486-3916', '10818 Tuxford Pl, Sun Valley, CA 91352, USA', 'Los Angeles', 'CA', '91352', 'Landscaping', 5, 12, 'https://www.greenessencetreeandlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orange Coast College: Horticulture Garden Lab', NULL, NULL, '(714) 432-0202 ext. 22868', 'Adams Ave, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 4.5, 13, 'https://orangecoastcollege.edu/academics/math-sciences/horticulture/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rocha Landscaping', NULL, NULL, '(949) 285-7485', '6145 Chino Ave, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 4.6, 19, 'http://rocha-landscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Forest tree care inc.', NULL, NULL, '(909) 568-6919', '6180 Riverside Dr Ste C # 24, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 4.8, 14, 'https://foresttreecareinc.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Evergreen Nursery', NULL, NULL, '(714) 537-8877', '8592 Garden Grove Blvd, Garden Grove, CA 92844, USA', 'Garden Grove', 'CA', '92844', 'Landscaping', 4.8, 69, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'King''s Tree Service', NULL, NULL, '(626) 221-6471', '2232 Kathryn Ave, Pomona, CA 91766, USA', 'Pomona', 'CA', '91766', 'Landscaping', 4.9, 11, 'https://www.kingstreeservice.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Goldenwest Landscaping', NULL, NULL, '(949) 573-2352', '3012 Enterprise St, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 5, 14, 'http://goldenwestlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'A & S Tree Service', NULL, NULL, '(714) 718-4381', '142 N Holly St, Orange, CA 92868, USA', 'Orange', 'CA', '92868', 'Landscaping', 5, 20, 'http://www.aandstreeservice.site/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Aguilar Tree Service', NULL, NULL, '(909) 510-0053', '12992 Renato Ct, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 5, 14, 'https://aguilartreeservice.co/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Steven''s Garden', NULL, NULL, '(949) 481-2632', '28792 Camino Capistrano, Mission Viejo, CA 92675, USA', 'Mission Viejo', 'CA', '92675', 'Landscaping', 4.8, 19, 'http://stevensgardens.store/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Land Disview', NULL, NULL, '(949) 569-5887', '24172 Landisview Ave, Lake Forest, CA 92630, USA', 'Lake Forest', 'CA', '92630', 'Landscaping', 5, 20, 'https://landdisview.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Robyn''s Original Landscapes', NULL, NULL, '(949) 630-3312', '30025 Alicia Pkwy #231, Laguna Niguel, CA 92677, USA', 'Laguna Niguel', 'CA', '92677', 'Landscaping', 5, 19, 'http://www.robynsoriginal.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Vazquez Nursery', NULL, NULL, '(657) 204-9635', '17191 Beach Blvd, Huntington Beach, CA 92647, USA', 'Huntington Beach', 'CA', '92647', 'Landscaping', 5, 15, 'https://www.vazqueznursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gaspar Landscaping & Tree Service', NULL, NULL, '(951) 264-5966', '4366 Angelo St, Riverside, CA 92507, USA', 'Riverside', 'CA', '92507', 'Landscaping', 4.3, 18, 'https://riverside-calandscaper.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Al and Sons Tree Service', NULL, NULL, '(951) 737-6847', '18800 My Hwy, Corona, CA 92881, USA', 'Corona', 'CA', '92881', 'Landscaping', 4.5, 15, 'https://alandsonstreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Clements Landscape and Pool Construction', NULL, NULL, '(909) 481-3265', '8082 Surrey Ln, Rancho Cucamonga, CA 91701, USA', 'Rancho Cucamonga', 'CA', '91701', 'Landscaping', 4.6, 18, 'https://clementslandscape.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, '1 Neat Landscaping lawn maintenance n tree services', NULL, NULL, '(951) 732-5484', '17130 Van Buren Boulevard Unit #820, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 4.7, 12, 'https://1neatlawnandlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Bella Park Inc.', NULL, NULL, '(951) 226-5070', '4160 Temescal Canyon Rd Suite 401, Corona, CA 92883, USA', 'Corona', 'CA', '92883', 'Landscaping', 4.8, 23, 'https://bellaparkinc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Menifee Gardening & Sprinkler Repair', NULL, NULL, '(951) 821-0189', '30864 Sunset Lake Cir, Menifee, CA 92584, USA', 'Menifee', 'CA', '92584', 'Landscaping', 4.8, 144, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Alejandros Tree Service', NULL, NULL, '(909) 694-8945', '1073 N Sandalwood Ave, Rialto, CA 92376, USA', 'Rialto', 'CA', '92376', 'Landscaping', 4.9, 182, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'M1 Landscaping LLC', NULL, NULL, '(714) 439-9463', '1411 Rimpau Ave Ste 109, Corona, CA 92879, USA', 'Corona', 'CA', '92879', 'Landscaping', 5, 13, 'https://m1landscapingllc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lawn Care 4 U & Landscaping', NULL, NULL, '(951) 548-4002', 'Orange St, Riverside, CA 92501, USA', 'Riverside', 'CA', '92501', 'Landscaping', 5, 17, 'https://meek-speculoos-d93c9f.netlify.app/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tree Service of Rancho Cucamonga', NULL, NULL, '(909) 279-5191', '5845 Beryl St, Rancho Cucamonga, CA 91737, USA', 'Rancho Cucamonga', 'CA', '91737', 'Landscaping', 5, 21, 'https://hlstreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tree Service of Fontana', NULL, NULL, '(909) 900-7961', '15124 Macadamia Ct, Fontana, CA 92335, USA', 'Fontana', 'CA', '92335', 'Landscaping', 5, 19, 'https://treeserviceoffontana.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Millennial Landscape', NULL, NULL, '(323) 441-5129', '6433 Etiwanda Ave, Jurupa Valley, CA 91752, USA', 'Jurupa Valley', 'CA', '91752', 'Landscaping', 5, 14, 'https://millennialscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Save Aqua Landscapes LLC', NULL, NULL, '(909) 276-8957', '8977 Foothill Blvd STE D, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 5, 13, 'https://saveaqulandscaping.org/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Andrew Landscape & Construction INC', NULL, NULL, '(951) 780-1222', '14365 Laurel Dr, Riverside, CA 92503, USA', 'Riverside', 'CA', '92503', 'Landscaping', 5, 10, 'https://andrewlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Adam Hall''s Garden Center', NULL, NULL, '(951) 538-2730', '28095 Alessandro Blvd, Moreno Valley, CA 92555, USA', 'Moreno Valley', 'CA', '92555', 'Landscaping', 5, 20, 'http://adamhallsnursery.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Joel''s Tree Service', NULL, NULL, '(619) 636-9041', '1465 Platano Ct, Chula Vista, CA 91911, USA', 'Chula Vista', 'CA', '91911', 'Landscaping', 4.5, 18, 'http://www.joelstreeservice.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Quetzal Landscapes, Inc.', NULL, NULL, '(858) 222-1454', '7710 Balboa Ave #308, San Diego, CA 92111, USA', 'San Diego', 'CA', '92111', 'Landscaping', 4.6, 11, 'https://www.quetzallandscapes.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Blue Monarch', NULL, NULL, '(619) 908-9696', '3128 Martin Ave, San Diego, CA 92113, USA', 'San Diego', 'CA', '92113', 'Landscaping', 4.7, 23, 'https://bluemonarchcorp.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'El Centro Artesano', NULL, NULL, '(619) 297-2931', '2637 San Diego Ave, San Diego, CA 92110, USA', 'San Diego', 'CA', '92110', 'Landscaping', 4.7, 74, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Planet Tree Service', NULL, NULL, '(619) 771-8787', '659 Ellen Ln, El Cajon, CA 92019, USA', 'El Cajon', 'CA', '92019', 'Landscaping', 4.9, 55, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'DTS General Services LLC - Home Improvements', NULL, NULL, '(619) 863-3315', '1232 Tangelos Pl, Lemon Grove, CA 91945, USA', 'Lemon Grove', 'CA', '91945', 'Landscaping', 4.9, 68, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Llitoquii Plants', NULL, NULL, '(858) 284-7773', '2935 Ulric St, San Diego, CA 92111, USA', 'San Diego', 'CA', '92111', 'Landscaping', 4.9, 17, 'https://llitoquiiplants.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'El Jardín de Frida.', NULL, NULL, '664 202 2969', 'Fresnillo 2783-B, Col. Madero (Cacho), 22040 Tijuana, B.C., Mexico', 'Colonia Madero (Cacho)', 'B.C.', '22040', 'Landscaping', 4.9, 22, 'https://www.facebook.com/eljardindefridatj', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Go Greens Clean', NULL, NULL, '(858) 977-1818', '6453 Reflection Dr, San Diego, CA 92124, USA', 'San Diego', 'CA', '92124', 'Landscaping', 5, 15, 'https://gogreensclean.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'San Diego Tree Care', NULL, NULL, '(858) 530-8733', '9984 Scripps Ranch Blvd #303, San Diego, CA 92131, USA', 'San Diego', 'CA', '92131', 'Landscaping', 5, 11, 'http://sandiegotreecare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Synthetic Pros', NULL, NULL, '(619) 565-9513', '8924 Troy St, Spring Valley, CA 91977, USA', 'Spring Valley', 'CA', '91977', 'Landscaping', 5, 17, 'https://greensyntheticpros.com/?utm_campaign=gmb', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Viva Las Plantas Shop', NULL, NULL, '664 484 1123', 'P.º Ensenada 121-local 14 Sec, Playas de Tijuana, Terrazas de Mendoza, 22205 Tijuana, B.C., Mexico', 'Terrazas de Mendoza', 'B.C.', '22205', 'Landscaping', 5, 19, 'http://www.vivalasplantas.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Echo Garden Nursery', NULL, NULL, '(323) 274-4126', '4515 York Blvd, Los Angeles, CA 90041, USA', 'Los Angeles', 'CA', '90041', 'Landscaping', 4.3, 106, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Stratton Paving and Masonry', NULL, NULL, '(818) 394-8965', '12457 Ventura Blvd #342, Studio City, CA 91604, USA', 'Los Angeles', 'CA', '91604', 'Landscaping', 4.8, 76, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Nature''s Tree Service', NULL, NULL, '(626) 695-3430', '715 N Hyacinth Ave, West Covina, CA 91791, USA', 'West Covina', 'CA', '91791', 'Landscaping', 4.9, 15, 'https://www.naturestreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Thumb Gardens', NULL, NULL, '(310) 327-7851', '844 N Lucia Ave, Redondo Beach, CA 90277, USA', 'Redondo Beach', 'CA', '90277', 'Landscaping', 4.5, 20, 'http://www.farmtolawn.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Edgar Landscaping', NULL, NULL, '(562) 200-1252', '1058 N Ravenna Ave, Wilmington, CA 90744, USA', 'Los Angeles', 'CA', '90744', 'Landscaping', 4.6, 21, 'http://www.edgarlandscapingservices.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Yamada Company Inc', NULL, NULL, '(310) 327-5668', '706 W Gardena Blvd, Gardena, CA 90247, USA', 'Gardena', 'CA', '90247', 'Landscaping', 4.6, 153, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'O''Neill Masonry and Asphalt', NULL, NULL, '(424) 309-7990', '21707 Hawthorne Blvd #307, Torrance, CA 90503, USA', 'Torrance', 'CA', '90503', 'Landscaping', 4.8, 58, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ewing Outdoor Supply', NULL, NULL, '(310) 782-7821', '20526 Gramercy Pl, Torrance, CA 90501, USA', 'Torrance', 'CA', '90501', 'Landscaping', 4.9, 18, 'http://www.ewingoutdoorsupply.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Torrance Community Gardens', NULL, NULL, '(310) 781-7520', '4045 190th St, Torrance, CA 90504, USA', 'Torrance', 'CA', '90504', 'Landscaping', 4.9, 15, 'https://www.torranceca.gov/our-city/cultural-services/community-gardens', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'HERNANDEZ LAND AND HARDSCAPING', NULL, NULL, '(562) 661-0809', '1428 Chestnut Ave, Long Beach, CA 90813, USA', 'Long Beach', 'CA', '90813', 'Landscaping', 5, 20, 'https://www.hlandscapin.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'JN Arbor Care', NULL, NULL, '(310) 674-8888', '904 W Hyde Park Blvd, Inglewood, CA 90302, USA', 'Inglewood', 'CA', '90302', 'Landscaping', 5, 11, 'https://jnarborcare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Terrebonne Projects Inc', NULL, NULL, '(424) 625-8035', '2801 Ocean Park Blvd #1093, Santa Monica, CA 90405, USA', 'Santa Monica', 'CA', '90405', 'Landscaping', 5, 12, 'https://www.terre-bonne.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'DreamWork Landscape', NULL, NULL, '(310) 973-2100', '3126 Pacific Coast Hwy, Torrance, CA 90505, USA', 'Torrance', 'CA', '90505', 'Landscaping', 5, 14, 'https://www.dreamworklandscape.com/contact/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Arboreal Tree Trimming Irvine', NULL, NULL, '(714) 699-9151', '15333 Culver Dr 2287 Ste 340, Irvine, CA 92604, USA', 'Irvine', 'CA', '92604', 'Landscaping', 4.9, 19, 'https://www.treeserviceirvineca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lawn Master OC', NULL, NULL, '(714) 970-5296', '500 S Acacia Ave, Fullerton, CA 92831, USA', 'Fullerton', 'CA', '92831', 'Landscaping', 5, 22, 'https://lawnmasteroc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'So Cal Tree Trimming Inc.', NULL, NULL, '(714) 507-6376', '925 S Arden Pl, Anaheim, CA 92802, USA', 'Anaheim', 'CA', '92802', 'Landscaping', 5, 24, 'https://socaltreetrimming.godaddysites.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'MTC Landscape Contractor', NULL, NULL, '(951) 294-0420', '23152 Via Campo Verde, Laguna Woods, CA 92637, USA', 'Laguna Woods', 'CA', '92637', 'Landscaping', 4.7, 12, 'http://www.mtccompanies.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Dana Point Nursery', NULL, NULL, '(949) 496-5137', '34100 Pacific Coast Hwy, Dana Point, CA 92629, USA', 'Dana Point', 'CA', '92629', 'Landscaping', 4.7, 68, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Artisan Outdoor', NULL, NULL, '(949) 390-8181', '1653 B, Superior Ave, Costa Mesa, CA 92627, USA', 'Costa Mesa', 'CA', '92627', 'Landscaping', 4.8, 17, 'https://artisanoutdoor.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Luis Hernandez Landscaping', NULL, NULL, '(949) 514-3624', '1180 S Belhaven St, Anaheim, CA 92806, USA', 'Anaheim', 'CA', '92806', 'Landscaping', 5, 20, 'http://lhernandezlandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Southcal Landscape Corporation', NULL, NULL, '(657) 205-6490', '1300 Adams Ave Unit 16F, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 5, 11, 'https://south-cal-landscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'MBros Pool Construction', NULL, NULL, '(714) 392-1784', '2230 W Chapman Ave, Orange, CA 92868, USA', 'Orange', 'CA', '92868', 'Landscaping', 5, 11, 'https://www.mbrospoolconstruction.com/?utm_source=google&utm_medium=gbp', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Caliscapes OC', NULL, NULL, '(714) 348-4808', '11891 Hewes St Apt A, Orange, CA 92869, USA', 'Orange', 'CA', '92869', 'Landscaping', 5, 21, 'http://www.caliscapesoc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'I M Landscaping', NULL, NULL, '(909) 236-6607', '9844 Galena Ave, Montclair, CA 91763, USA', 'Montclair', 'CA', '91763', 'Landscaping', 4.3, 12, 'https://imlandscapingtree.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Guerrero’s Gardening', NULL, NULL, '(840) 345-3750', '668 Laurel Ave, Pomona, CA 91768, USA', 'Pomona', 'CA', '91768', 'Landscaping', 5, 17, 'http://dguerrero0816.wixsite.com/guerreros', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mercado''s Nursery Corp', NULL, NULL, '(909) 823-3774', '9790 59th St, Jurupa Valley, CA 91752, USA', 'Jurupa Valley', 'CA', '91752', 'Landscaping', 4.5, 71, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Highland - Landscaping South El Monte', NULL, NULL, '(626) 569-7433', '1230 Santa Anita Ave, South El Monte, CA 91733, USA', 'South El Monte', 'CA', '91733', 'Landscaping', 4.3, 6, 'https://www.ziprecruiter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gill Hardscape', NULL, NULL, '(562) 276-8910', '201 College Park Dr, Seal Beach, CA 90740, USA', 'Seal Beach', 'CA', '90740', 'Landscaping', 4.4, 7, 'http://www.gillhardscape.com/contact.htm', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pacific Coast Pavers', NULL, NULL, '(949) 701-2888', '1585 Berenice Dr, Brea, CA 92821, USA', 'Brea', 'CA', '92821', 'Landscaping', 4.7, 9, 'https://pcpavers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Maztek Landscaping', NULL, NULL, '(562) 376-1691', '5408 Woodruff Ave, Lakewood, CA 90713, USA', 'Lakewood', 'CA', '90713', 'Landscaping', 5, 8, 'http://mazteklandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Diaz Landscaping Services', NULL, NULL, '(323) 683-8082', '1865 1/2 W 25th St, Los Angeles, CA 90018, USA', 'Los Angeles', 'CA', '90018', 'Landscaping', 5, 5, 'https://www.diaz-landscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Joaquin’s Landscaping', NULL, NULL, '(323) 592-1098', '2328 1/2 Carmona Ave, Los Angeles, CA 90016, USA', 'Los Angeles', 'CA', '90016', 'Landscaping', 5, 6, 'http://joaquinslandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, '4Ever Green Landscape', NULL, NULL, '(714) 723-8222', '17232 Oak Ln, Huntington Beach, CA 92647, USA', 'Huntington Beach', 'CA', '92647', 'Landscaping', 5, 7, 'http://landscape4ever.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'GW Tree Service', NULL, NULL, '(562) 360-2396', '12544 Persing Dr, Whittier, CA 90606, USA', 'Whittier', 'CA', '90606', 'Landscaping', 5, 6, 'https://treeservicegw.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'East LA Tree Service', NULL, NULL, '(323) 970-3006', '4557 E 3rd St, Los Angeles, CA 90022, USA', 'Los Angeles', 'CA', '90022', 'Landscaping', 5, 6, 'https://www.eastlosangelestreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Fullerton Landscapers', NULL, NULL, '(657) 441-0348', '1440 N Harbor Blvd #900, Fullerton, CA 92835, USA', 'Fullerton', 'CA', '92835', 'Landscaping', 5, 6, 'https://fullertonlandscapers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mark Talmo Landscape', NULL, NULL, '(714) 391-6618', '8762 Charford Dr, Huntington Beach, CA 92646, USA', 'Huntington Beach', 'CA', '92646', 'Landscaping', 5, 8, 'http://www.marktalmolandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'United Garden and Wholesale Inc', NULL, NULL, '(818) 922-2004', '7561 Woodman Pl #1545, Van Nuys, CA 91405, USA', 'Los Angeles', 'CA', '91405', 'Landscaping', 4.3, 41, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'L.A. Los Primos Landscaping', NULL, NULL, '(323) 519-3752', '1212 S Amantha Ave, Compton, CA 90220, USA', 'Compton', 'CA', '90220', 'Landscaping', 4.4, 9, 'https://onebrisco.wixsite.com/losangeleslosprimosl', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'BA True Gardens', NULL, NULL, '(213) 327-8696', '1532 W 54th St, Los Angeles, CA 90062, USA', 'Los Angeles', 'CA', '90062', 'Landscaping', 4.4, 8, 'https://batruegardenslandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Garden Center', NULL, NULL, '(818) 352-4466', '6324 Foothill Blvd, Tujunga, CA 91042, USA', 'Los Angeles', 'CA', '91042', 'Landscaping', 4.8, 5, 'http://www.doitcenter.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Republic Landscapes, Inc.', NULL, NULL, '(818) 616-1860', '13743 Ventura Blvd #220, Sherman Oaks, CA 91423, USA', 'Los Angeles', 'CA', '91423', 'Landscaping', 4.9, 8, 'https://www.greenrepubliclandscapes.com/?utm_source=google&utm_medium=mybusiness', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Go Green Us Landscaping', NULL, NULL, '(323) 328-2320', '821 N Humphreys Ave, East Los Angeles, CA 90022, USA', 'East Los Angeles', 'CA', '90022', 'Landscaping', 5, 6, 'https://gogreenuslandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'North Hollywood Landscapers', NULL, NULL, '(213) 589-2691', '6240 Laurel Canyon Blvd ste 110, North Hollywood, CA 91606, USA', 'Los Angeles', 'CA', '91606', 'Landscaping', 5, 7, 'https://northhollywoodlandscapers.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'CHAMAN Inc.', NULL, NULL, '(424) 204-3879', '4344 W 178th St, Torrance, CA 90504, USA', 'Torrance', 'CA', '90504', 'Landscaping', 5, 6, 'http://www.chamaninc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Glendale Landscapers', NULL, NULL, '(747) 209-1704', '655 N Central Ave #1700, Glendale, CA 91203, USA', 'Glendale', 'CA', '91203', 'Landscaping', 5, 7, 'https://glendalelandscapers.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orange County Sprinkler Repair', NULL, NULL, '(714) 313-8911', '260 South Pacific St, Tustin, CA 92780, USA', 'Tustin', 'CA', '92780', 'Landscaping', 4.7, 46, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'BG Tree Service and Landscape', NULL, NULL, '(714) 472-7585', '902 Freeman St, Santa Ana, CA 92703, USA', 'Santa Ana', 'CA', '92703', 'Landscaping', 5, 6, 'https://www.bgtreeserviceandlandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tree Service Experts Santa Ana', NULL, NULL, '(657) 332-0999', '1217 E Wakeham Ave, Santa Ana, CA 92705, USA', 'Santa Ana', 'CA', '92705', 'Landscaping', 5, 6, 'https://www.thelocaltreeexperts.com/ca/santa-ana/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'TerraTrail Landscaping & Paving', NULL, NULL, '(714) 248-0693', '4848 Lakeview Ave, Yorba Linda, CA 92886, USA', 'Yorba Linda', 'CA', '92886', 'Landscaping', 5, 5, 'http://terratraillandscaping.website/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Orozco''s Lawncare Solutions', NULL, NULL, '(949) 283-2320', '1830 E Fairway Dr, Orange, CA 92866, USA', 'Orange', 'CA', '92866', 'Landscaping', 5, 6, 'https://orozcoslawncaresolutions.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'EverGrow Landscape Supply', NULL, NULL, '(714) 251-6116', '1310 Logan Ave Unit A, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 5, 5, 'https://evergrowlandscapesupply.com/?utm_source=google&utm_medium=googlebusinessprofile&utm_campaign=gbp', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'R & C Nursery and Growers', NULL, NULL, '(951) 314-6279', '10901 Wells Ave, Riverside, CA 92505, USA', 'Riverside', 'CA', '92505', 'Landscaping', 4.2, 6, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Y & M Nursery', NULL, NULL, '(909) 721-6664', '16450 Washington St, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 4.3, 25, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Diaz Landscape', NULL, NULL, '(909) 775-3108', '1146 E Deodar St, Ontario, CA 91764, USA', 'Ontario', 'CA', '91764', 'Landscaping', 4.5, 43, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Marquez Landscaping', NULL, NULL, '(951) 655-0260', '30956 9th St, Nuevo, CA 92567, USA', 'Nuevo', 'CA', '92567', 'Landscaping', 4.7, 7, 'https://www.marquezlandscapinginc.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ontario Paving', NULL, NULL, '(909) 752-0834', '1351 S Grove Ave STE 106, Ontario, CA 91761, USA', 'Ontario', 'CA', '91761', 'Landscaping', 4.8, 6, 'https://ontariopaving.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gutierrez Tree Service', NULL, NULL, '(909) 417-8869', '12430 Reche Canyon Rd, Colton, CA 92324, USA', 'Colton', 'CA', '92324', 'Landscaping', 5, 34, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'kevins tree service', NULL, NULL, '(909) 638-8979', '18324 10th St, Bloomington, CA 92316, USA', 'Bloomington', 'CA', '92316', 'Landscaping', 5, 6, 'https://www.kevinstreeserviceca.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Arbor Enterprise Tree Service', NULL, NULL, '(951) 599-8733', '11194 Spruce Ave, Bloomington, CA 92316, USA', 'Bloomington', 'CA', '92316', 'Landscaping', 5, 5, 'http://www.arborenterprise.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rancho Cucamonga Landscapers', NULL, NULL, '(909) 752-0838', '10681 Foothill Blvd Suite 400, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 5, 6, 'https://ranchocucamongalandscapers.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ontario Landscapers', NULL, NULL, '(909) 752-0832', '3400 Inland Empire Blvd suite 10, Ontario, CA 91764, USA', 'Ontario', 'CA', '91764', 'Landscaping', 5, 6, 'https://ontariolandscapers.net/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Lemon Grove Community Garden', NULL, NULL, '(858) 859-2992', 'Lemon Grove, CA 91945, USA', 'Lemon Grove', 'CA', '91945', 'Landscaping', 4.6, 5, 'http://www.lemongrovecommunitygarden.us/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Rancho San Diego Nursery Inc.', NULL, NULL, '(619) 401-1151', '2031 Jamacha Rd, El Cajon, CA 92019, USA', 'El Cajon', 'CA', '92019', 'Landscaping', 4.7, 35, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'The Home Depot (Garden Center)', NULL, NULL, '(619) 575-1900', '525 Saturn Blvd, San Diego, CA 92154, USA', 'San Diego', 'CA', '92154', 'Landscaping', 4.8, 5, 'https://www.homedepot.com/l/Imperial-Beach/CA/San-Diego/92154/671/garden-center?emt=GCGMBGoogleMaps', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Vivero Jardín', NULL, NULL, '664 121 6329', 'Del Pino 3508, Cd Jardin, 22610 Tijuana, B.C., Mexico', 'Ciudad Jardin', 'B.C.', '22610', 'Landscaping', 4.8, 49, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Kreative Landscaping', NULL, NULL, '(858) 333-7051', '2535 Fenton Pkwy, San Diego, CA 92108, USA', 'San Diego', 'CA', '92108', 'Landscaping', 5, 6, 'http://www.kreativelandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Pro Lawn Care of Bonita', NULL, NULL, '(619) 404-4777', '5172 Bonita Rd, Bonita, CA 91902, USA', 'Bonita', 'CA', '91902', 'Landscaping', 5, 7, 'https://nerislandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'San Diego Garden Supply', NULL, NULL, '(619) 312-2642', '208 Greenfield Dr Suite M/N, El Cajon, CA 92020, USA', 'El Cajon', 'CA', '92020', 'Landscaping', 5, 9, 'https://www.sdgardensupply.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'KimThai Garden', NULL, NULL, '(323) 388-3871', '901 N Broadway, Los Angeles, CA 90012, USA', 'Los Angeles', 'CA', '90012', 'Landscaping', 4.8, 28, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Hall Landscape Design', NULL, NULL, '(909) 752-0773', '2402 Elmgrove St, Los Angeles, CA 90031, USA', 'Los Angeles', 'CA', '90031', 'Landscaping', 5, 31, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'LunaBella Tree Svc & Landscape LLC', NULL, NULL, '(323) 770-9858', 'n/a, Los Angeles, CA 90006, USA', 'Los Angeles', 'CA', '90006', 'Landscaping', 4.5, 8, 'https://www.lunabellalandscaping.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Tips Landscape', NULL, NULL, '(818) 418-9244', '703 W Caldwell St, Compton, CA 90220, USA', 'Compton', 'CA', '90220', 'Landscaping', 5, 8, 'http://greentipsla.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'EC Irrigation Repair', NULL, NULL, '(310) 930-5347', '2124 E Piru St, Compton, CA 90222, USA', 'Compton', 'CA', '90222', 'Landscaping', 5, 6, 'http://www.ecirrigationrepair.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ruben Guerrero Tree Services', NULL, NULL, '(714) 630-4736', '1839 W Random Dr, Anaheim, CA 92804, USA', 'Anaheim', 'CA', '92804', 'Landscaping', 4.8, 6, 'http://www.rubenguerrerotreeservice.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'My Tree Experts', NULL, NULL, '(714) 455-3636', '825 N Redondo Dr E, Anaheim, CA 92801, USA', 'Anaheim', 'CA', '92801', 'Landscaping', 4.9, 7, 'http://mytreeexperts.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Betterment Tree Health Care', NULL, NULL, '(714) 905-6444', '7131 Yorktown Ave, Huntington Beach, CA 92648, USA', 'Huntington Beach', 'CA', '92648', 'Landscaping', 4.9, 32, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tochihuitl Landscape', NULL, NULL, '(714) 924-6329', '5772 Garden Grove Blvd unit 526, Westminster, CA 92683, USA', 'Westminster', 'CA', '92683', 'Landscaping', 5, 6, 'http://tochihuitllandscape.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Bluegrass Landscape & Irrigation', NULL, NULL, '(909) 545-0474', '4934 Rosewood St, Montclair, CA 91763, USA', 'Montclair', 'CA', '91763', 'Landscaping', 4.9, 7, 'http://www.bluegrasslandcare.com/', 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Modern Irrigation', NULL, NULL, '(909) 946-6951', '1450 W 9th St, Upland, CA 91786, USA', 'Upland', 'CA', '91786', 'Landscaping', 4.8, 30, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ralph''s Nursery', NULL, NULL, '(951) 963-0121', '2178 Kern St, San Bernardino, CA 92407, USA', 'San Bernardino', 'CA', '92407', 'Landscaping', 4.6, 32, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gonzalez & Sons Gardening and Landscaping Services', NULL, NULL, '(323) 428-2781', '1532 S Curson Ave, Los Angeles, CA 90019, USA', 'Los Angeles', 'CA', '90019', 'Landscaping', 4.4, 15, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Ezcutz lawncare', NULL, NULL, '(213) 257-5328', '1112 S Oxford Ave, Los Angeles, CA 90006, USA', 'Los Angeles', 'CA', '90006', 'Landscaping', 4.7, 13, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Miguel''s Lawn Service', NULL, NULL, '(310) 874-8399', 'home not business no visitors, 16318 S Essey Ave, Compton, CA 90221, USA', 'Compton', 'CA', '90221', 'Landscaping', 4.7, 12, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'California Beauty Nursery & Flower Shop', NULL, NULL, '(323) 830-7019', '2439 S Atlantic Blvd, Commerce, CA 90040, USA', 'Commerce', 'CA', '90040', 'Landscaping', 4.7, 20, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Acotillo Tree Service Inc', NULL, NULL, '(323) 314-6294', '2355 Westwood Blvd, Los Angeles, CA 90064, USA', 'Los Angeles', 'CA', '90064', 'Landscaping', 4.8, 24, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Luna’s lanscaping', NULL, NULL, '(310) 507-4933', '625 E 99th St, Inglewood, CA 90301, USA', 'Inglewood', 'CA', '90301', 'Landscaping', 5, 10, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gabriel''s Landscaping And Tree Service', NULL, NULL, '(310) 294-4891', '8705 S 10th Ave, Inglewood, CA 90305, USA', 'Inglewood', 'CA', '90305', 'Landscaping', 5, 11, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Cruz Landscape', NULL, NULL, '(323) 840-6271', '1323 Fedora St, Los Angeles, CA 90006, USA', 'Los Angeles', 'CA', '90006', 'Landscaping', 5, 24, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Tomoike Landscaping & Irrigation', NULL, NULL, '(310) 630-9650', '23122 Kent Ave, Torrance, CA 90505, USA', 'Torrance', 'CA', '90505', 'Landscaping', 5, 10, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Mench''s Sprinklers', NULL, NULL, '(818) 731-5152', '7771 Allott Ave, Van Nuys, CA 91402, USA', 'Los Angeles', 'CA', '91402', 'Landscaping', 4.8, 19, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'The Staghorn Garden', NULL, NULL, '(310) 961-0808', '2919 and 2923 Wilshire Blvd, Santa Monica, CA 90403, USA', 'Santa Monica', 'CA', '90403', 'Landscaping', 4.9, 22, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Sod & Turf Pros', NULL, NULL, '(818) 457-0453', '12007 Peoria St, Sun Valley, CA 91352, USA', 'Los Angeles', 'CA', '91352', 'Landscaping', 5, 24, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Golden Tree care', NULL, NULL, '(714) 574-4227', '1133 S Ross St, Santa Ana, CA 92707, USA', 'Santa Ana', 'CA', '92707', 'Landscaping', 5, 11, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'AG Nursery', NULL, NULL, '(714) 761-2148', '8735 Crescent Ave, Buena Park, CA 90620, USA', 'Buena Park', 'CA', '90620', 'Landscaping', 4.6, 14, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'A&M landscaping', NULL, NULL, '(951) 388-4084', '2562 Sepulveda Ave, San Bernardino, CA 92404, USA', 'San Bernardino', 'CA', '92404', 'Landscaping', 4.3, 18, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gavilan Springs', NULL, NULL, '(951) 575-6573', '18400 Santa Rosa Mine Rd, Perris, CA 92570, USA', 'Perris', 'CA', '92570', 'Landscaping', 4.5, 11, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'America''s Irrigation & Landscaping', NULL, NULL, '(888) 530-9994', '9950 Indiana Ave #15, Riverside, CA 92503, USA', 'Riverside', 'CA', '92503', 'Landscaping', 4.7, 19, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Manalisco Nurseries', NULL, NULL, '(909) 673-9737', '7659 E Riverside Dr, Ontario, CA 91761, USA', 'Ontario', 'CA', '91761', 'Landscaping', 4.7, 22, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Gardening & house cleaning services M&M', NULL, NULL, '(951) 531-6952', '6290 Cosmos St, Eastvale, CA 92880, USA', 'Eastvale', 'CA', '92880', 'Landscaping', 4.8, 21, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Julio C Munoz Sprinkler Repair', NULL, NULL, '(909) 791-9143', '6925 Oleander Ave, Fontana, CA 92336, USA', 'Fontana', 'CA', '92336', 'Landscaping', 4.8, 18, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Davidson tree service', NULL, NULL, '(909) 699-3841', '631 N Park Ave, Rialto, CA 92376, USA', 'Rialto', 'CA', '92376', 'Landscaping', 5, 11, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Spine N Shine', NULL, NULL, '(909) 264-5856', '3293 N E St, San Bernardino, CA 92405, USA', 'San Bernardino', 'CA', '92405', 'Landscaping', 5, 21, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Higuera''s Tree Service', NULL, NULL, '(619) 569-4962', '2047 Ensenada St, Lemon Grove, CA 91945, USA', 'Lemon Grove', 'CA', '91945', 'Landscaping', 4.8, 15, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Coastal Tree Work', NULL, NULL, '(760) 815-0367', '1955 Titus St, San Diego, CA 92110, USA', 'San Diego', 'CA', '92110', 'Landscaping', 5, 16, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Carrillos Gardening Services', NULL, NULL, '(310) 422-8981', '5450 W Slauson Ave MBII-16, 5450 S Slauson Ave, Culver City, CA 90230, USA', 'Culver City', 'CA', '90230', 'Landscaping', 4.8, 19, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'D L Long Landscaping', NULL, NULL, '(909) 628-5531', '5475 G St, Chino, CA 91710, USA', 'Chino', 'CA', '91710', 'Landscaping', 4.4, 14, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Jeff Buchanan Tree Services', NULL, NULL, '(714) 738-4652', '3730 W Commonwealth Ave, Fullerton, CA 92833, USA', 'Fullerton', 'CA', '92833', 'Landscaping', 4.4, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Betos Lawn Services', NULL, NULL, '(562) 221-9764', '11903 Gonsalves St, Cerritos, CA 90703, USA', 'Cerritos', 'CA', '90703', 'Landscaping', 5, 5, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'J. Lopez Tree Service', NULL, NULL, '(714) 392-6481', '1860 Glenoaks Ave, Anaheim, CA 92801, USA', 'Anaheim', 'CA', '92801', 'Landscaping', 5, 8, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Green Vision Inc.', NULL, NULL, '(818) 600-4505', '13743 Ventura Blvd #220, Sherman Oaks, CA 91423, USA', 'Los Angeles', 'CA', '91423', 'Landscaping', 4.6, 9, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'OCEANSIDE LANDSCAPING inc', NULL, NULL, '(714) 243-7515', '14832 Hunter Ln, Midway City, CA 92655, USA', 'Midway City', 'CA', '92655', 'Landscaping', 5, 9, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Merchant Landscape Services', NULL, NULL, '(909) 981-1022', '8847 E 9th St, Rancho Cucamonga, CA 91730, USA', 'Rancho Cucamonga', 'CA', '91730', 'Landscaping', 4.8, 6, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Prowess Landscaping Maintenance Inc.', NULL, NULL, '(951) 743-8864', '14637 Rosea Ct, Moreno Valley, CA 92555, USA', 'Moreno Valley', 'CA', '92555', 'Landscaping', 5, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Momia’s Nursery', NULL, NULL, '(909) 630-6671', '4930 Pedley Rd, Riverside, CA 92509, USA', 'Riverside', 'CA', '92509', 'Landscaping', 5, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Accurate Irrigation Services', NULL, NULL, '(619) 741-5296', '216 Garfield Ave, El Cajon, CA 92020, USA', 'El Cajon', 'CA', '92020', 'Landscaping', 5, 5, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'JUAN''S GARDEN SERVICE', NULL, NULL, '(310) 427-4672', '1537 E O St, Wilmington, CA 90744, USA', 'Los Angeles', 'CA', '90744', 'Landscaping', 4.4, 7, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'J.Ruiz Landscaping supply/dump/dompe', NULL, NULL, '(424) 362-4748', '6800 S Victoria Ave, Los Angeles, CA 90043, USA', 'Los Angeles', 'CA', '90043', 'Landscaping', 5, 6, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Abeja Nursery', NULL, NULL, '(310) 324-1523', '18301 Ermanita Ave, Torrance, CA 90504, USA', 'Torrance', 'CA', '90504', 'Landscaping', 5, 9, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'Costa Mesa Emergency Sprinkler Repair Co.', NULL, NULL, '(657) 600-6515', '3187 Airway Ave, Costa Mesa, CA 92626, USA', 'Costa Mesa', 'CA', '92626', 'Landscaping', 5, 6, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'La Habra Tree Services', NULL, NULL, '(714) 364-5246', '131 E Imperial Hwy, La Habra, CA 90631, USA', 'La Habra', 'CA', '90631', 'Landscaping', 4.8, 6, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)
VALUES (admin_id, 'HS LAWN MAINTENANCE', NULL, NULL, '(909) 519-6026', '3847 Madison St, Riverside, CA 92504, USA', 'Riverside', 'CA', '92504', 'Landscaping', 5, 5, NULL, 'new'::lead_status, 'warm'::lead_score, NULL);

END $$;

-- Verify import
SELECT COUNT(*) as total_leads FROM leads;
