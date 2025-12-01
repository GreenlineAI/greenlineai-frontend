/**
 * Create admin users via Supabase Admin API
 * This uses the service role key to create users with proper password hashing
 * 
 * Run with: npx tsx scripts/create-admin-via-api.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nggelyppkswqxycblvcb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZ2VseXBwa3N3cXh5Y2JsdmNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ4Nzc1MSwiZXhwIjoyMDgwMDYzNzUxfQ.aGG5sbpwIlNXLitRDjphwvEWNqQpPCpsbw2KBcZCkkw';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createOrUpdateAdmin(email: string, password: string) {
  console.log(`\nProcessing admin: ${email}`);
  
  // First, try to get the existing user
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  const existingUser = existingUsers.users.find(u => u.email === email);
  
  if (existingUser) {
    console.log(`User exists with ID: ${existingUser.id}`);
    
    // Update the password using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { 
        password: password,
        email_confirm: true
      }
    );
    
    if (error) {
      console.error('Error updating user:', error);
    } else {
      console.log('✅ Password updated successfully!');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);
    }
  } else {
    // Create new user
    console.log('User does not exist, creating new user...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: email === 'greenlineai@proton.me' ? 'GreenLine Admin' : 'Admin User'
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('✅ User created successfully!');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   User ID: ${data.user.id}`);
    }
  }
}

async function main() {
  console.log('🔧 Creating/Updating Admin Users via Supabase Admin API\n');
  console.log('This will properly hash passwords using Supabase\'s auth system\n');
  
  // Admin 1: greenlineai@proton.me (primary admin, no leads)
  await createOrUpdateAdmin('greenlineai@proton.me', 'Admin123!');
  
  // Admin 2: glugo2942@gmail.com (has 909 leads)
  await createOrUpdateAdmin('glugo2942@gmail.com', 'Admin123!');
  
  console.log('\n✨ Done! You can now login with:');
  console.log('   Email: greenlineai@proton.me or glugo2942@gmail.com');
  console.log('   Password: Admin123!');
}

main().catch(console.error);
