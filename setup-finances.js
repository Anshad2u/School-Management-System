const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://lqxfszjqwbdygqyrebgl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA');

async function main() {
  // Insert with correct column name (amount instead of current_balance)
  const { data, error } = await supabase.from('school_finances').upsert({
    id: '11111111-1111-1111-1111-111111111111',
    type: 'balance',
    amount: 50000
  }).select();
  console.log('School finances:', error ? error.message : 'OK', data);
}

main().catch(console.error);
