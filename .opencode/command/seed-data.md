# /seed-data

Insert sample test data into the database for development and testing.

## Usage

```
/seed-data {table_or_all}
```

## Description

Populates database tables with realistic sample data for testing features.

## Options

- `all` — Seed all tables with sample data
- `students` — Seed 8 students across grades 1-8
- `teachers` — Seed 5 teachers with subjects
- `courses` — Seed 5 courses
- `fees` — Seed fee records for existing students

## Process

1. Read `.opencode/context/domain/database-schema.md` for table structure
2. Generate realistic data following naming conventions
3. Insert via Supabase REST API with service role key
4. Verify inserted records
5. Report count of records per table

## Examples

```
/seed-data all
/seed-data students
/seed-data teachers
```
