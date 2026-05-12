#!/bin/bash
# Initialize Supabase database and create admin user

SUPABASE_URL="https://lqxfszjqwbdygqyrebgl.supabase.co"
SUPABASE_TOKEN="YOUR_SUPABASE_TOKEN_HERE"
PROJECT_REF="lqxfszjqwbdygqyrebgl"

echo "Setting up database schema..."

# Read and execute the SQL migration
SQL_FILE="/data/data/com.termux/files/home/my-sms/supabase/migrations/20000101000000_initial_schema.sql"

if [ -f "$SQL_FILE" ]; then
    echo "Found SQL file. Please run this in Supabase SQL Editor:"
    echo "https://supabase.com/dashboard/project/$PROJECT_REF/sql"
    cat "$SQL_FILE"
else
    echo "SQL file not found at $SQL_FILE"
fi