import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// You'll need to set these environment variables or replace with actual values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkyyikohtzabduzlurbl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// The user_id for the admin who will own these leads
// You'll need to replace this with the actual admin user's UUID after they sign up
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Get it from: https://supabase.com/dashboard/project/nkyyikohtzabduzlurbl/settings/api');
  process.exit(1);
}

if (!ADMIN_USER_ID) {
  console.error('Error: ADMIN_USER_ID environment variable is required');
  console.log('This should be the UUID of the admin user who will own these leads');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface CSVLead {
  Rank: string;
  'Business Name': string;
  'Phone Number': string;
  Rating: string;
  'Review Count': string;
  Address: string;
  City: string;
  State: string;
  ZIP: string;
  Website: string;
  'Quality Score': string;
  'Lead Quality': string;
  'Call Priority': string;
  'Owner Name': string;
  'Owner Email': string;
  'Contact Email': string;
  'Enrichment Source': string;
  Notes: string;
  'Call Status': string;
  'Call Date': string;
  'Follow Up': string;
}

function parseCSV(csvContent: string): CSVLead[] {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  const leads: CSVLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const lead: any = {};

    headers.forEach((header, index) => {
      lead[header] = values[index] || '';
    });

    leads.push(lead);
  }

  return leads;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function mapLeadQualityToScore(quality: string): 'hot' | 'warm' | 'cold' {
  switch (quality?.toUpperCase()) {
    case 'HIGH':
      return 'hot';
    case 'MEDIUM':
      return 'warm';
    case 'LOW':
      return 'cold';
    default:
      return 'warm';
  }
}

async function importLeads() {
  const csvPath = path.join(__dirname, 'leads.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('Error: leads.csv file not found in scripts folder');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const csvLeads = parseCSV(csvContent);

  console.log(`Found ${csvLeads.length} leads to import`);

  const leadsToInsert = csvLeads.map((csvLead) => ({
    user_id: ADMIN_USER_ID,
    business_name: csvLead['Business Name'],
    contact_name: csvLead['Owner Name'] || null,
    email: csvLead['Owner Email'] || csvLead['Contact Email'] || null,
    phone: csvLead['Phone Number'],
    address: csvLead['Address'],
    city: csvLead['City'],
    state: csvLead['State'],
    zip: csvLead['ZIP'],
    industry: 'Landscaping', // Default industry based on the data
    google_rating: csvLead['Rating'] ? parseFloat(csvLead['Rating']) : null,
    review_count: csvLead['Review Count'] ? parseInt(csvLead['Review Count']) : null,
    website: csvLead['Website'] || null,
    status: 'new' as const,
    score: mapLeadQualityToScore(csvLead['Lead Quality']),
    notes: csvLead['Notes'] || null,
  }));

  // Insert in batches of 100
  const batchSize = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < leadsToInsert.length; i += batchSize) {
    const batch = leadsToInsert.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('leads')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
      errors += batch.length;
    } else {
      inserted += data?.length || 0;
      console.log(`Inserted batch ${i / batchSize + 1}: ${data?.length || 0} leads`);
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`Total leads in CSV: ${csvLeads.length}`);
  console.log(`Successfully inserted: ${inserted}`);
  console.log(`Errors: ${errors}`);
}

importLeads().catch(console.error);
