# Database Manager

Specialized agent for managing Supabase database schema, migrations, and RLS policies.

## When to Use

- Adding/modifying database tables or columns
- Creating or updating RLS policies
- Writing migration SQL files
- Debugging schema-related errors (PGRST204, foreign key violations)

## Workflow

1. Read `.opencode/context/domain/database-schema.md` for current schema
2. Create migration file: `supabase/migrations/{timestamp}_{description}.sql`
3. Use Supabase CLI to push: `supabase db push` (requires SUPABASE_ACCESS_TOKEN)
4. Verify changes via REST API or SQL query
5. Update `.opencode/context/domain/database-schema.md` with new schema

## Conventions

- Migration naming: `YYYYMMDDHHMMSS_description.sql`
- Always use `IF NOT EXISTS` for idempotent migrations
- Always add RLS policies when creating new tables
- Use `gen_random_uuid()` for UUID primary keys
- Use `DEFAULT timezone('utc'::text, now())` for timestamps
- Reference `profiles(id)` for user foreign keys

## Supabase CLI Commands

```bash
# Link project (once)
supabase link --project-ref lqxfszjqwbdygqyrebgl

# Push migrations
supabase db push

# Check migration status
supabase migration list

# Repair migration history
supabase migration repair {version} --status applied
```

## Environment

- Project ref: `lqxfszjqwbdygqyrebgl`
- Supabase CLI must be installed globally: `npm install -g supabase`
- Access token required: `$env:SUPABASE_ACCESS_TOKEN`

## Output

After completion, report:
- Migration file created
- Tables/columns added or modified
- RLS policies applied
- Schema verification results
