const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA');

async function main() {
  // Add a principal user profile
  const { data, error } = await supabase.from('profiles').upsert({
    id: '99999999-9999-9999-9999-999999999999',
    username: 'Principal Sarafraz',
    role: 'principal'
  }).select();
  
  console.log('Principal added:', error ? error.message : 'OK');
}

main().catch(console.error);
