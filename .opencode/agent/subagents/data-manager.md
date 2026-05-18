# Data Manager

Specialized agent for seeding test data, managing sample datasets, and data operations in the School Management System.

## When to Use

- Adding sample/test data for development
- Creating demo accounts for testing
- Populating tables with realistic data
- Data cleanup or migration tasks

## Available Tables for Seeding

| Table | Key Fields | Notes |
|-------|-----------|-------|
| students | id, name, grade, age, date_of_birth, parent_name, contact_number, status | UUID primary key |
| teachers | id, name, subject, qualification, experience | UUID primary key |
| courses | id, name, teacher_id, description | teacher_id references profiles(id) |
| profiles | id, username, phone_number, role | id references auth.users |
| fees | id, student_id, amount, status, due_date | student_id references profiles(id) |
| announcements | id, title, content, date | |
| events | id, name, description, date | |

## Seeding Conventions

- Use deterministic UUIDs for predictable references
- Use `ON CONFLICT (id) DO NOTHING` for idempotent inserts
- Include realistic Islamic school-appropriate names
- Cover all grades (1-8) and age ranges (6-14)
- Use Indian phone format: +91 XXXXX XXXXX

## Methods

### Via REST API (no auth needed)
```javascript
// POST to /rest/v1/{table} with service role key
const opts = {
  hostname: 'lqxfszjqwbdygqyrebgl.supabase.co',
  path: '/rest/v1/{table}',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: '{service_role_key}',
    Authorization: 'Bearer {service_role_key}',
    Prefer: 'return=representation'
  }
}
```

### Via Supabase CLI
```bash
supabase db push  # for migration-based seeding
```

## Sample Data Patterns

### Student Names
Ahmed Khan, Aisha Begum, Omar Farooq, Fatima Zahra, Yusuf Ali, Maryam Siddiqui, Bilal Hussain, Khadija Noor

### Teacher Names
Ustadh Muhammad Ibrahim, Ustadha Amina Hassan, Ustadh Abdul Rahman, Ustadha Zainab Khan

### Subjects
Quran & Tajweed, Arabic Language, Islamic Studies, Hadith Studies, Mathematics, Science, English

## Output

After completion, report:
- Records inserted per table
- Verification query results
- Any conflicts or errors
