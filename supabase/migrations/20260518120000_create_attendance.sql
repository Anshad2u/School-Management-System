-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text,
  marked_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, date)
);

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Attendance is viewable by staff and teachers" 
  ON attendance FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff', 'teacher'))
  );

CREATE POLICY "Staff and teachers can insert attendance" 
  ON attendance FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff', 'teacher'))
  );

CREATE POLICY "Staff and teachers can update attendance" 
  ON attendance FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff', 'teacher'))
  );

CREATE POLICY "Staff and teachers can delete attendance" 
  ON attendance FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff', 'teacher'))
  );
