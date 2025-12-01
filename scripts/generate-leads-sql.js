const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../public/leads_2025-11-30_16-55-45.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

function parseCSVLine(line) {
  const result = [];
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

function escapeSQL(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function mapLeadQuality(quality) {
  switch (quality?.toUpperCase()) {
    case 'HIGH': return 'hot';
    case 'MEDIUM': return 'warm';
    case 'LOW': return 'cold';
    default: return 'warm';
  }
}

const lines = csvContent.split('\n');
const headers = parseCSVLine(lines[0]);

console.log('-- GreenLine AI Leads Import');
console.log('-- Run this in Supabase SQL Editor');
console.log('-- First, get your admin user_id:');
console.log("-- SELECT id FROM auth.users WHERE email = 'Gugo2942@gmail.com';");
console.log('');
console.log('-- Replace YOUR_USER_ID below with the actual UUID');
console.log('');
console.log('DO $$');
console.log('DECLARE');
console.log("  admin_id UUID := (SELECT id FROM auth.users WHERE email = 'Gugo2942@gmail.com');");
console.log('BEGIN');
console.log('');

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const values = parseCSVLine(line);

  const businessName = values[1] || '';
  const phone = values[2] || '';
  const rating = values[3] ? parseFloat(values[3]) : null;
  const reviewCount = values[4] ? parseInt(values[4]) : null;
  const address = values[5] || '';
  const city = values[6] || '';
  const state = values[7] || '';
  const zip = values[8] || '';
  const website = values[9] || '';
  const leadQuality = values[11] || 'MEDIUM';
  const ownerName = values[13] || '';
  const ownerEmail = values[14] || '';
  const contactEmail = values[15] || '';
  const notes = values[17] || '';

  const email = ownerEmail || contactEmail || null;
  const score = mapLeadQuality(leadQuality);

  console.log(`INSERT INTO leads (user_id, business_name, contact_name, email, phone, address, city, state, zip, industry, google_rating, review_count, website, status, score, notes)`);
  console.log(`VALUES (admin_id, ${escapeSQL(businessName)}, ${escapeSQL(ownerName) === 'NULL' ? 'NULL' : escapeSQL(ownerName)}, ${escapeSQL(email) === "''" ? 'NULL' : escapeSQL(email)}, ${escapeSQL(phone)}, ${escapeSQL(address)}, ${escapeSQL(city)}, ${escapeSQL(state)}, ${escapeSQL(zip)}, 'Landscaping', ${rating || 'NULL'}, ${reviewCount || 'NULL'}, ${escapeSQL(website) === "''" ? 'NULL' : escapeSQL(website)}, 'new', '${score}', ${escapeSQL(notes) === "''" ? 'NULL' : escapeSQL(notes)});`);
  console.log('');
}

console.log('END $$;');
console.log('');
console.log('-- Verify import');
console.log('SELECT COUNT(*) as total_leads FROM leads;');
