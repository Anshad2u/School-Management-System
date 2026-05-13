-- Run this in Supabase Dashboard → SQL Editor
-- This adds all missing columns to school_settings table

ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS address_line text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS monday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS monday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS tuesday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS tuesday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS wednesday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS wednesday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS thursday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS thursday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS friday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS friday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS saturday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS saturday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS sunday_start text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS sunday_end text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS motto text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#3b82f6';
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#64748b';

-- Update columns to match new interface (optional - rename old columns)
-- ALTER TABLE school_settings RENAME COLUMN school_name TO name;
-- ALTER TABLE school_settings RENAME COLUMN phone TO contact_phone;
-- ALTER TABLE school_settings RENAME COLUMN email TO contact_email;