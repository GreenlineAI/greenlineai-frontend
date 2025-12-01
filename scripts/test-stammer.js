#!/usr/bin/env node

/**
 * Simple Stammer AI Test - Direct API Call
 * Tests if Stammer integration is working
 */

console.log('🧪 Testing Stammer AI Integration');
console.log('═══════════════════════════════\n');

const testCall = {
  phoneNumber: '+14083654503', // Your demo number
  leadId: 'test-lead-123',
  campaignId: 'test-campaign',
  metadata: {
    business_name: 'Test Business',
    contact_name: 'John',
    business_type: 'landscaping',
    city: 'San Francisco',
    state: 'CA',
  },
};

console.log('📞 Making test call to:', testCall.phoneNumber);
console.log('📋 Business:', testCall.metadata.business_name);
console.log('🏢 Type:', testCall.metadata.business_type);
console.log('\n⏳ Initiating call via Stammer AI...\n');

fetch('https://greenlineai-frontend.pages.dev/api/calls/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testCall),
})
  .then(async (response) => {
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }
    
    const data = await response.json();
    console.log('\n✅ SUCCESS! Call initiated!\n');
    console.log('📊 Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n🎧 Next steps:');
    console.log('1. Answer the call on', testCall.phoneNumber);
    console.log('2. Test the conversation flow');
    console.log('3. Check call logs: https://greenlineai-frontend.pages.dev/dashboard/calls');
    console.log('4. Listen to recording in Stammer dashboard');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ FAILED:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check if Stammer API key is correct in wrangler.toml');
    console.error('2. Verify agent ID is valid');
    console.error('3. Check Cloudflare deployment status');
    console.error('4. Review Cloudflare Functions logs');
    process.exit(1);
  });
