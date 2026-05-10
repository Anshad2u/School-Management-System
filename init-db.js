// Database initialization script for new Supabase project
// Run this in browser console or create as an API route

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lqxfszjqwbdygqyrebgl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGZzempxd2JkeWdxeXJlYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTkyOTYsImV4cCI6MjA5Mzk5NTI5Nn0.-c0AYjfk6LpYY4RWqsCmZFo3aSoQDYRi4H1IN-dUUqA"

const supabase = createClient(supabaseUrl, supabaseKey)

// Create tables via SQL
async function initDatabase() {
  const sql = `
    -- Create profiles table (extends auth.users)
    create table if not exists profiles (
      id uuid primary key references auth.users on delete cascade,
      username text unique,
      phone_number text,
      role text check (role in ('admin', 'principal', 'teacher', 'staff', 'student', 'parent')),
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create announcements table
    create table if not exists announcements (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      content text,
      date timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create events table
    create table if not exists events (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      description text,
      date date not null
    );

    -- Create teachers table
    create table if not exists teachers (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      subject text,
      qualification text,
      experience integer
    );
  `

  const { error } = await supabase.rpc('exec_sql', { sql })
  if (error) console.error('Error:', error)
  else console.log('Tables created!')
}

initDatabase()