const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA');

async function main() {
  // Check profiles table
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(5);
  console.log('Profiles table (first 5):', profiles);
  
  // Check if we can query with the email
  const { data: byEmail } = await supabase.from('profiles').select('*').eq('username', 'anshadputtur');
  console.log('By username:', byEmail);
}

main().catch(console.error);
