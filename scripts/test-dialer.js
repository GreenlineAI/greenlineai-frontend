#!/usr/bin/env node

/**
 * Manual Test Script for Auto-Dialer
 * 
 * Usage:
 *   npm run test-dialer           # Test with 1 call
 *   npm run test-dialer 5         # Test with 5 calls
 *   npm run test-dialer 10 --dry  # Dry run (no actual calls)
 */

const https = require('https');

const CONFIG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://greenlineai-frontend.pages.dev',
  USER_ID: process.env.AUTO_DIALER_USER_ID || '0b627f19-6ea2-469b-a596-84cab72190c9',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nggelyppkswqxycblvcb.supabase.co',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZ2VseXBwa3N3cXh5Y2JsdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODc3NTEsImV4cCI6MjA4MDA2Mzc1MX0.g3L2cnvCf67IePlaSdAlTBLx2c07xGj2rBsQ2KSHIRw',
};

// Parse args
const numCalls = parseInt(process.argv[2]) || 1;
const dryRun = process.argv.includes('--dry');

console.log('🧪 Auto-Dialer Test Script');
console.log('═══════════════════════════\n');
console.log(`Calls to make: ${numCalls}`);
console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}`);
console.log(`User ID: ${CONFIG.USER_ID}\n`);

async function getLeads(limit) {
  console.log('📋 Fetching leads from Supabase...');
  
  const url = `${CONFIG.SUPABASE_URL}/rest/v1/leads?user_id=eq.${CONFIG.USER_ID}&status=in.(new,no_answer)&order=created_at.asc&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': CONFIG.SUPABASE_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leads: ${response.statusText}`);
  }
  
  const leads = await response.json();
  console.log(`✅ Found ${leads.length} leads\n`);
  
  return leads;
}

async function makeCall(lead) {
  console.log(`📞 Calling: ${lead.business_name}`);
  console.log(`   Phone: ${lead.phone}`);
  console.log(`   Industry: ${lead.industry}`);
  console.log(`   Location: ${lead.city}, ${lead.state}`);
  
  if (dryRun) {
    console.log('   [DRY RUN - No actual call made]\n');
    return { success: true, dryRun: true };
  }
  
  try {
    const response = await fetch(`${CONFIG.SITE_URL}/api/calls/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: lead.phone,
        leadId: lead.id,
        campaignId: 'test-campaign',
        metadata: {
          business_name: lead.business_name,
          contact_name: lead.contact_name || 'Owner',
          business_type: lead.industry,
          city: lead.city,
          state: lead.state,
        },
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    const data = await response.json();
    console.log(`   ✅ Call initiated! Call ID: ${data.callId}\n`);
    
    return { success: true, callId: data.callId };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    // Get leads
    const leads = await getLeads(numCalls);
    
    if (leads.length === 0) {
      console.log('❌ No leads available to call');
      process.exit(1);
    }
    
    // Make calls
    const results = [];
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      console.log(`\n[${i + 1}/${leads.length}]`);
      
      const result = await makeCall(lead);
      results.push({ ...result, leadId: lead.id, businessName: lead.business_name });
      
      // Wait 5 seconds between calls
      if (i < leads.length - 1) {
        console.log('⏳ Waiting 5 seconds...\n');
        await sleep(5000);
      }
    }
    
    // Summary
    console.log('\n═══════════════════════════');
    console.log('📊 Test Results');
    console.log('═══════════════════════════\n');
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${results.length}\n`);
    
    if (failed > 0) {
      console.log('Failed calls:');
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.businessName}: ${r.error}`);
        });
    }
    
    if (!dryRun && successful > 0) {
      console.log(`\n🎧 View call logs: ${CONFIG.SITE_URL}/dashboard/calls`);
    }
    
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();
