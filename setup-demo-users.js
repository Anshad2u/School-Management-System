const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA');

async function main() {
  // Create demo users with confirmed emails
  const demoUsers = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
      username: 'Principal Ahmed',
      role: 'principal',
      email: 'principal@sms.local'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002',
      username: 'Teacher Sarafraz',
      role: 'teacher',
      email: 'sarafraz@sms.local'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-000000000003',
      username: 'Admin User',
      role: 'admin',
      email: 'admin@sms.local'
    }
  ];

  for (const u of demoUsers) {
    const { data, error } = await supabase.from('profiles').upsert({
      id: u.id,
      username: u.username,
      role: u.role
    }).select();
    console.log(`Created ${u.username}:`, error ? error.message : 'OK');
  }

  // Create a school_finances record
  const { data, error } = await supabase.from('school_finances').upsert({
    id: '11111111-1111-1111-1111-111111111111',
    type: 'balance',
    amount: 50000,
    current_balance: 50000
  }).select();
  console.log('School finances:', error ? error.message : 'OK');
}

main().catch(console.error);
