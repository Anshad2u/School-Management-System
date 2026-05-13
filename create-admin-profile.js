const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA');

async function main() {
  // Sign in to get the user ID
  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email: 'anshadputtur@gmail.com',
    password: 'Admin@123456'
  });
  
  if (error) {
    console.log('Auth error:', error.message);
    return;
  }
  
  console.log('User ID:', auth.user?.id);
  
  // Create profile with valid columns only (no email in schema)
  const { data, error: profileErr } = await supabase.from('profiles').upsert({
    id: auth.user.id,
    username: 'anshadputtur',
    role: 'admin'
  }).select();
  
  if (profileErr) {
    console.log('Profile error:', profileErr);
  } else {
    console.log('Profile created:', data);
  }
  
  await supabase.auth.signOut();
}

main().catch(console.error);
