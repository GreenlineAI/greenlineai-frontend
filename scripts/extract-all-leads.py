#!/usr/bin/env python3
"""
Extract all leads from import-leads.sql and create a Supabase-compatible SQL file
"""

import re

print("Reading import-leads.sql...")
with open('/workspaces/greenlineai-frontend/scripts/import-leads.sql', 'r') as f:
    content = f.read()

# Extract all VALUES clauses from INSERT statements
pattern = r"INSERT INTO leads \(user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes\)\s*VALUES \(admin_id,\s*([^;]+)\);"

matches = re.findall(pattern, content, re.DOTALL)
print(f"Found {len(matches)} lead records")

# Convert to VALUES format
values_list = []
for match in matches:
    # Clean up the values and remove admin_id reference
    cleaned = match.strip()
    # Replace enum casts
    cleaned = cleaned.replace("'new'::lead_status", "'new'")
    cleaned = cleaned.replace("'qualified'::lead_status", "'qualified'")
    cleaned = cleaned.replace("'contacted'::lead_status", "'contacted'")
    cleaned = cleaned.replace("'hot'::lead_score", "'hot'")
    cleaned = cleaned.replace("'warm'::lead_score", "'warm'")
    cleaned = cleaned.replace("'cold'::lead_score", "'cold'")
    values_list.append(f"    ({cleaned})")

# Build the complete SQL file
sql_content = f"""-- GreenLine AI Leads Import for Supabase UI
-- Run this in Supabase SQL Editor
-- 
-- INSTRUCTIONS:
-- This script will automatically find the user with email 'Gugo2942@gmail.com'
-- and import all {len(matches)} leads for that user.

BEGIN;

DO $$
DECLARE
  v_user_id UUID;
  v_inserted_count INTEGER;
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
{',\n'.join(values_list)}
  ) AS t(business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes);

  GET DIAGNOSTICS v_inserted_count = ROW_COUNT;
  RAISE NOTICE 'Successfully imported % leads for user %', v_inserted_count, v_user_id;
END $$;

COMMIT;

-- Verify the import
SELECT 
  COUNT(*) as total_leads_imported,
  user_id,
  (SELECT email FROM auth.users WHERE id = user_id) as user_email
FROM leads 
GROUP BY user_id;
"""

# Write the new SQL file
output_file = '/workspaces/greenlineai-frontend/scripts/import-leads-supabase.sql'
with open(output_file, 'w') as f:
    f.write(sql_content)

print(f"Created {output_file} with {len(matches)} leads")
print("File is ready to be run in Supabase SQL Editor!")
