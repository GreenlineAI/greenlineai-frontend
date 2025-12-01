/**
 * Cloudflare Worker Function - Import Leads from CSV
 * Path: /api/leads/import
 */

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

interface CSVRow {
  [key: string]: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the auth token from cookie or header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Get current user from Supabase
    const userResponse = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await userResponse.json();

    // Parse CSV file
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid data found in CSV' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform and insert leads
    const leads = rows.map(row => ({
      user_id: user.id,
      business_name: row.business_name || row['Business Name'] || 'Unknown Business',
      contact_name: row.contact_name || row['Contact Name'] || null,
      email: row.email || row['Email'] || null,
      phone: row.phone || row['Phone'] || null,
      address: row.address || row['Address'] || null,
      city: row.city || row['City'] || null,
      state: row.state || row['State'] || null,
      zip: row.zip || row['Zip'] || null,
      industry: row.industry || row['Industry'] || 'Other',
      google_rating: parseFloat(row.google_rating || row['Google Rating'] || '0') || null,
      review_count: parseInt(row.review_count || row['Review Count'] || '0') || null,
      website: row.website || row['Website'] || null,
      status: 'new',
      score: 'warm',
    }));

    // Insert into Supabase
    const insertResponse = await fetch(
      `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads`,
      {
        method: 'POST',
        headers: {
          'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(leads),
      }
    );

    if (!insertResponse.ok) {
      const error = await insertResponse.text();
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to import leads', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: leads.length,
        message: `Successfully imported ${leads.length} leads`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error importing leads:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to import leads',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
