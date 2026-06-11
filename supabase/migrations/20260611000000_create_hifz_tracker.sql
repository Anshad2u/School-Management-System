-- Create Hifz tracker tables

CREATE TABLE IF NOT EXISTS hifz_mutoon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS hifz_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode IN ('quran', 'mutoon')),
  tracker_item text NOT NULL,
  status text NOT NULL CHECK (status IN ('not_started', 'learning', 'memorized', 'reviewed')),
  grade integer CHECK (grade >= 0 AND grade <= 100),
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes text,
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable row level security
ALTER TABLE hifz_mutoon ENABLE ROW LEVEL SECURITY;
ALTER TABLE hifz_records ENABLE ROW LEVEL SECURITY;

-- Policies for hifz_mutoon
CREATE POLICY "Allow anyone to select hifz mutoon" ON hifz_mutoon FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert hifz mutoon" ON hifz_mutoon FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policies for hifz_records
CREATE POLICY "Allow authenticated users to select hifz records" ON hifz_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to insert hifz records" ON hifz_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update hifz records" ON hifz_records FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Seed commonly memorized mutoon examples
INSERT INTO hifz_mutoon (name, description) VALUES
  ('Al-Ajrumiyyah', 'Foundational Arabic grammar poem commonly learned by students.'),
  ('Al-Jazariyyah', 'Classic Arabic grammar poem used in early Islamic studies.'),
  ('Al-Shatibiyyah', 'Quran recitation poem often memorized in tajweed classes.'),
  ('Qasidah Al-Burdah', 'Traditional poem in praise of the Prophet Muhammad.')
ON CONFLICT (name) DO NOTHING;
