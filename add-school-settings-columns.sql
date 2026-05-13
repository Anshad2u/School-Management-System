-- Run this in Supabase SQL editor to add missing columns to school_settings table

-- Add contact fields
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS address_line text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS website_url text;

-- Add timing fields
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

-- Add branding fields
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS motto text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS primary_color text;
ALTER TABLE school_settings ADD COLUMN IF NOT EXISTS secondary_color text;