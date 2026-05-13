const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzenF3YmR5Z3F5cmViZ2wiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjIxOTUzNywibmJmIjoxNzE2MjE5NTM3LCJleHAiOjE5NzE4OTU5Mzd9.5cWT-hG5gE3WQJz8I5ZgQ9hP9Y8tX3wK5pE8G7K0M2E');

async function main() {
  // Check profiles table
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, username, role').limit(10);
  console.log('Profiles:', profiles);
  
  // Check if admin user exists
  const { data: admin } = await supabase.from('profiles').select('*').eq('email', 'anshadputtur@gmail.com').single();
  console.log('Admin profile:', admin);
  
  // Check transactions table
  const { data: tx, error: txErr } = await supabase.from('transactions').select('*').limit(5);
  console.log('Transactions:', tx?.length || 0);
  
  // Check school_finances table
  const { data: fin, error: finErr } = await supabase.from('school_finances').select('*').limit(5);
  console.log('School finances:', fin);
}

main().catch(console.error);
