-- Migration: Convert school_settings id from bigint to uuid
-- Run this in Supabase SQL editor

-- First, drop the existing row(s) if any
DELETE FROM school_settings;

-- Alter column type
ALTER TABLE school_settings 
ALTER COLUMN id TYPE uuid USING '11111111-1111-1111-1111-111111111111'::uuid;

-- Set default value
ALTER TABLE school_settings 
ALTER COLUMN id SET DEFAULT '11111111-1111-1111-1111-111111111111'::uuid;

-- Verify
SELECT id, name FROM school_settings LIMIT 1;