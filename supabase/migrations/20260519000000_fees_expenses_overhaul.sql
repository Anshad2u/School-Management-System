-- Add fee categories and receipt tracking to fees table
ALTER TABLE fees ADD COLUMN IF NOT EXISTS category text DEFAULT 'other';
ALTER TABLE fees ADD COLUMN IF NOT EXISTS payment_date timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE fees ADD COLUMN IF NOT EXISTS receipt_number text;
ALTER TABLE fees ADD COLUMN IF NOT EXISTS notes text;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  description text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  receipt_url text,
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expenses viewable by admin/principal" 
  ON expenses FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal'))
  );

CREATE POLICY "Admin/principal can insert expenses" 
  ON expenses FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal'))
  );

CREATE POLICY "Admin/principal can update expenses" 
  ON expenses FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal'))
  );

CREATE POLICY "Admin/principal can delete expenses" 
  ON expenses FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal'))
  );

-- Seed demo fee data
DO $$
DECLARE
  profile_ids uuid[];
  student_names text[];
  fee_id uuid;
  receipt text;
  idx integer;
BEGIN
  -- Get student profile IDs (profiles with role='student')
  SELECT array_agg(id), array_agg(username) INTO profile_ids, student_names
  FROM profiles WHERE role = 'student' LIMIT 8;
  
  IF profile_ids IS NOT NULL AND array_length(profile_ids, 1) > 0 THEN
    -- Admission fees
    FOR i IN 1..array_length(profile_ids, 1) LOOP
      receipt := 'ADM-' || to_char(now(), 'YYYY') || '-' || LPAD(i::text, 4, '0');
      INSERT INTO fees (student_id, amount, status, category, payment_date, receipt_number, notes)
      VALUES (profile_ids[i], 5000, 'paid', 'Admission Fee', now() - (i || ' days')::interval, receipt, 'Annual admission fee');
    END LOOP;

    -- Tuition fees (quarters 1-4)
    FOR q IN 1..4 LOOP
      FOR i IN 1..array_length(profile_ids, 1) LOOP
        receipt := 'TUI-Q' || q || '-' || to_char(now(), 'YYYY') || '-' || LPAD(i::text, 4, '0');
        INSERT INTO fees (student_id, amount, status, category, payment_date, receipt_number, notes)
        VALUES (profile_ids[i], 3000, 'paid', 'Tuition Fee Q' || q, now() - ((q * 30 + i) || ' days')::interval, receipt, 'Tuition fee quarter ' || q);
      END LOOP;
    END LOOP;

    -- Uniform fees
    FOR i IN 1..LEAST(array_length(profile_ids, 1), 5) LOOP
      receipt := 'UNI-' || to_char(now(), 'YYYY') || '-' || LPAD(i::text, 4, '0');
      INSERT INTO fees (student_id, amount, status, category, payment_date, receipt_number, notes)
      VALUES (profile_ids[i], 1500, 'paid', 'Uniform Fee', now() - ((60 + i) || ' days')::interval, receipt, 'School uniform set');
    END LOOP;

    -- Book fees
    FOR i IN 1..LEAST(array_length(profile_ids, 1), 5) LOOP
      receipt := 'BOK-' || to_char(now(), 'YYYY') || '-' || LPAD(i::text, 4, '0');
      INSERT INTO fees (student_id, amount, status, category, payment_date, receipt_number, notes)
      VALUES (profile_ids[i], 800, 'paid', 'Books Fee', now() - ((50 + i) || ' days')::interval, receipt, 'Textbooks and supplies');
    END LOOP;
  END IF;
END $$;

-- Seed demo expenses
INSERT INTO expenses (category, amount, description, expense_date) VALUES
  ('Salary', 45000, 'Teacher salaries - May', CURRENT_DATE - INTERVAL '5 days'),
  ('Salary', 15000, 'Staff salaries - May', CURRENT_DATE - INTERVAL '5 days'),
  ('Utilities', 8500, 'Electricity bill', CURRENT_DATE - INTERVAL '10 days'),
  ('Utilities', 3200, 'Water bill', CURRENT_DATE - INTERVAL '10 days'),
  ('Maintenance', 12000, 'Classroom repairs', CURRENT_DATE - INTERVAL '15 days'),
  ('Supplies', 6500, 'Office supplies', CURRENT_DATE - INTERVAL '20 days'),
  ('Supplies', 4800, 'Cleaning supplies', CURRENT_DATE - INTERVAL '20 days'),
  ('Transport', 7000, 'Bus fuel', CURRENT_DATE - INTERVAL '8 days'),
  ('Technology', 15000, 'Computer maintenance', CURRENT_DATE - INTERVAL '25 days'),
  ('Events', 9500, 'Annual day preparation', CURRENT_DATE - INTERVAL '12 days'),
  ('Insurance', 18000, 'School insurance premium', CURRENT_DATE - INTERVAL '30 days'),
  ('Miscellaneous', 2500, 'Guest speaker honorarium', CURRENT_DATE - INTERVAL '18 days')
ON CONFLICT DO NOTHING;
