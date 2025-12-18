/**
 * Next.js API Route - Import Leads from CSV
 * Path: /api/leads/import
 *
 * Handles CSV file uploads to import leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface CSVRow {
  [key: string]: string;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse CSV file
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid data found in CSV' }, { status: 400 });
    }

    // Transform and insert leads
    const leads = rows.map(row => ({
      user_id: user.id,
      business_name: row.business_name || row['Business Name'] || 'Unknown Business',
      contact_name: row.contact_name || row['Contact Name'] || null,
      email: row.email || row['Email'] || null,
      phone: row.phone || row['Phone'] || 'N/A',
      address: row.address || row['Address'] || null,
      city: row.city || row['City'] || 'Unknown',
      state: row.state || row['State'] || 'Unknown',
      zip: row.zip || row['Zip'] || null,
      industry: row.industry || row['Industry'] || 'Other',
      google_rating: parseFloat(row.google_rating || row['Google Rating'] || '0') || null,
      review_count: parseInt(row.review_count || row['Review Count'] || '0') || null,
      website: row.website || row['Website'] || null,
      status: 'new',
      score: 'warm',
    }));

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from('leads')
      .insert(leads);

    if (insertError) {
      console.error('[Leads Import] Error:', insertError);
      return NextResponse.json(
        { error: 'Failed to import leads', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      message: `Successfully imported ${leads.length} leads`,
    });

  } catch (error) {
    console.error('[Leads Import] Error:', error);
    return NextResponse.json(
      { error: 'Failed to import leads', details: String(error) },
      { status: 500 }
    );
  }
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index].trim();
      });
      rows.push(row);
    }
  }

  return rows;
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(v => v.replace(/^["']|["']$/g, ''));
}
