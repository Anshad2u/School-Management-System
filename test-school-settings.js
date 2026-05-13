// Test script to verify school_settings table structure
// Run in browser console after logging into app

async function testSchoolSettings() {
  const supabase = window.supabase || (await import('@/lib/supabase')).supabase;
  
  // Check what columns exist
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Query error:', error);
    return;
  }
  
  console.log('Table columns:', data?.[0] ? Object.keys(data[0]) : 'No rows');
  
  // Try to insert test row if table is empty
  if (!data || data.length === 0) {
    const { error: insertError } = await supabase
      .from('school_settings')
      .insert({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Test School',
        address: 'Test Address'
      });
    
    if (insertError) {
      console.error('Insert error:', insertError.message);
    } else {
      console.log('Test row inserted');
    }
  }
}

testSchoolSettings();