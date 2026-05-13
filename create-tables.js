// Auto-create tables - run with: node create-tables.js YOUR_PASSWORD
const { Client } = require('pg');

const PASSWORD = process.argv[2];
if (!PASSWORD) {
  console.log('Usage: node create-tables.js YOUR_DATABASE_PASSWORD');
  console.log('Get password from: Supabase Dashboard → Settings → Database');
  process.exit(1);
}

const client = new Client({
  host: 'db.lqxfszjqwbdygqyrebgl.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase...');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        grade TEXT,
        age INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        teacher_id UUID REFERENCES profiles(id),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES profiles(id),
        amount NUMERIC,
        status TEXT CHECK (status IN ('paid', 'pending', 'overdue')),
        due_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID REFERENCES profiles(id),
        following_id UUID REFERENCES profiles(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
      ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
      
      INSERT INTO courses (name, description) VALUES 
        ('Mathematics', 'Algebra and Calculus'),
        ('Science', 'Physics and Chemistry'),
        ('English', 'Grammar and Literature')
      ON CONFLICT DO NOTHING;
    `;
    
    await client.query(sql);
    console.log('✅ Tables created successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();