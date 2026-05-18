-- Add new columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS home_address text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url text;
