-- Add missing columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS admission_date timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_name text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS contact_number text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'withdrawn'));

-- Add RLS policies for students
DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
CREATE POLICY "Students are viewable by everyone" ON students FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff can insert students" ON students;
CREATE POLICY "Staff can insert students" ON students FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
);
DROP POLICY IF EXISTS "Staff can update students" ON students;
CREATE POLICY "Staff can update students" ON students FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
);
DROP POLICY IF EXISTS "Staff can delete students" ON students;
CREATE POLICY "Staff can delete students" ON students FOR DELETE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
);

-- Insert sample students for testing
INSERT INTO students (id, name, grade, age, admission_date, date_of_birth, parent_name, contact_number, status) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Ahmed Khan', 'Grade 3', 9, NOW() - INTERVAL '6 months', '2016-03-15', 'Farhan Khan', '+91 98765 43210', 'active'),
  ('11111111-1111-1111-1111-111111111002', 'Aisha Begum', 'Grade 5', 11, NOW() - INTERVAL '1 year', '2014-07-22', 'Rashid Begum', '+91 98765 43211', 'active'),
  ('11111111-1111-1111-1111-111111111003', 'Omar Farooq', 'Grade 1', 7, NOW() - INTERVAL '3 months', '2018-11-08', 'Sana Farooq', '+91 98765 43212', 'active'),
  ('11111111-1111-1111-1111-111111111004', 'Fatima Zahra', 'Grade 7', 13, NOW() - INTERVAL '2 years', '2012-01-30', 'Imran Zahra', '+91 98765 43213', 'active'),
  ('11111111-1111-1111-1111-111111111005', 'Yusuf Ali', 'Grade 2', 8, NOW() - INTERVAL '4 months', '2017-05-12', 'Maryam Ali', '+91 98765 43214', 'active'),
  ('11111111-1111-1111-1111-111111111006', 'Maryam Siddiqui', 'Grade 6', 12, NOW() - INTERVAL '1 year', '2013-09-25', 'Tariq Siddiqui', '+91 98765 43215', 'active'),
  ('11111111-1111-1111-1111-111111111007', 'Bilal Hussain', 'Grade 4', 10, NOW() - INTERVAL '8 months', '2015-12-03', 'Nadia Hussain', '+91 98765 43216', 'active'),
  ('11111111-1111-1111-1111-111111111008', 'Khadija Noor', 'Grade 8', 14, NOW() - INTERVAL '3 years', '2011-04-18', 'Asif Noor', '+91 98765 43217', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample teachers for testing
INSERT INTO teachers (id, name, subject, qualification, experience) VALUES
  ('22222222-2222-2222-2222-222222222001', 'Ustadh Muhammad Ibrahim', 'Quran & Tajweed', 'Hafiz with Ijazah', 12),
  ('22222222-2222-2222-2222-222222222002', 'Ustadha Amina Hassan', 'Arabic Language', 'MA Arabic Literature', 8),
  ('22222222-2222-2222-2222-222222222003', 'Ustadh Abdul Rahman', 'Islamic Studies', 'BSc Islamic Studies', 10),
  ('22222222-2222-2222-2222-222222222004', 'Ustadha Zainab Khan', 'Mathematics', 'MSc Mathematics', 6),
  ('22222222-2222-2222-2222-222222222005', 'Ustadh Hassan Ali', 'Science', 'BSc Physics', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses for testing
INSERT INTO courses (id, name, description) VALUES
  ('33333333-3333-3333-3333-333333333001', 'Quran Recitation', 'Daily Quran recitation with proper Tajweed rules'),
  ('33333333-3333-3333-3333-333333333002', 'Arabic Grammar', 'Foundational Arabic grammar and vocabulary'),
  ('33333333-3333-3333-3333-333333333003', 'Hadith Studies', 'Study of authentic Hadith collections'),
  ('33333333-3333-3333-3333-333333333004', 'Mathematics', 'Grade-level mathematics curriculum'),
  ('33333333-3333-3333-3333-333333333005', 'General Science', 'Introduction to Physics, Chemistry, and Biology')
ON CONFLICT (id) DO NOTHING;
