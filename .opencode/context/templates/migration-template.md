# Migration SQL Template

Standard template for Supabase database migrations.

## New Table Template

```sql
-- Create {table_name} table
CREATE TABLE IF NOT EXISTS {table_name} (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns here
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "{table_name} are viewable by everyone" 
  ON {table_name} FOR SELECT USING (true);

CREATE POLICY "Staff can insert {table_name}" 
  ON {table_name} FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
  );

CREATE POLICY "Staff can update {table_name}" 
  ON {table_name} FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
  );

CREATE POLICY "Staff can delete {table_name}" 
  ON {table_name} FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'principal', 'staff'))
  );
```

## Add Column Template

```sql
-- Add new column to existing table
ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {column_name} {data_type} {constraints};
```

## Add Constraint Template

```sql
-- Add check constraint
ALTER TABLE {table_name} ADD CONSTRAINT {constraint_name} 
  CHECK ({condition});
```

## Seed Data Template

```sql
-- Insert sample data
INSERT INTO {table_name} (id, column1, column2) VALUES
  ('{uuid-1}', 'value1', 'value2'),
  ('{uuid-2}', 'value1', 'value2')
ON CONFLICT (id) DO NOTHING;
```

## Naming Convention

Migration files: `YYYYMMDDHHMMSS_description.sql`

Example: `20260518113128_fix_students_schema.sql`
