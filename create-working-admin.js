const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqxfszjqwbdygqyrebgl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Create a test user that's pre-confirmed
  const userId = '11111111-1111-1111-1111-111111111111';
  const email = 'admin@sms.local';
  const password = 'Admin@123456';
  
  // Insert profile directly (will work since we bypass auth)
  const { data, error } = await supabase.from('profiles').upsert({
    id: userId,
    username: 'Administrator',
    role: 'admin'
  }).select();
  
  console.log('Profile created:', data);
  
  // Store these credentials for the app
  console.log('\n=== Test Credentials ===');
  console.log('User ID:', userId);
  console.log('Email:', email);
  console.log('Password:', password);
}

main().catch(console.error);
