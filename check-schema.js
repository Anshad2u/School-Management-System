const https = require('https');

const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQxOTI5NiwiZXhwIjoyMDkzOTk1Mjk2fQ._GMrW6lUOW9CK-aBT4uZ4kT5Y8pQnHHOAQGkd_wQYw4';

function query(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    const opts = {
      hostname: 'lqxfszjqwbdygqyrebgl.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: 'Bearer ' + key
      }
    };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Triggers on students ===');
  console.log(await query("SELECT trigger_name, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_table = 'students'"));

  console.log('\n=== Columns on students ===');
  console.log(await query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'students' ORDER BY ordinal_position"));

  console.log('\n=== Columns on fees ===');
  console.log(await query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'fees' ORDER BY ordinal_position"));

  console.log('\n=== Columns on profiles ===');
  console.log(await query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position"));

  console.log('\n=== RLS policies on students ===');
  console.log(await query("SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'students'"));
}

main().catch(console.error);
