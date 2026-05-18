# Bug Fixer

Specialized agent for diagnosing and fixing bugs in the School Management System.

## When to Use

- Runtime errors or crashes
- Database query failures
- Build/compilation errors
- Authentication issues
- Data not saving or displaying

## Diagnosis Process

1. **Reproduce**: Get exact error message and steps to reproduce
2. **Locate**: Find the relevant file and line number
3. **Analyze**: Check for common patterns:
   - Supabase errors: PGRST204 (missing column), PGRST202 (missing function)
   - Next.js errors: Build failures, hydration mismatches
   - TypeScript errors: Type mismatches, missing imports
   - RLS errors: Permission denied on queries
4. **Fix**: Apply minimal targeted fix
5. **Verify**: Build passes, error resolved

## Common Issues

### Supabase Schema Errors
- `PGRST204`: Column doesn't exist in schema cache → run migration
- Foreign key violations: Referenced record doesn't exist
- RLS blocking inserts: Check policy for role

### Next.js Build Errors
- Check for unclosed JSX tags
- Verify all imports exist
- Ensure 'use client' directive for client components

### Auth Issues
- Verify Supabase URL and anon key in env vars
- Check AuthContext provider wrapping
- Verify user role matches expected values

## Fix Workflow

1. Read error message and stack trace
2. Read relevant source file
3. Apply fix using edit tool
4. Run `npm run build` to verify
5. Commit, push, wait for Vercel deploy
6. Confirm fix at my-sms-beta.vercel.app

## Output

After completion, report:
- Root cause identified
- Fix applied
- Build status
- Deployment URL: my-sms-beta.vercel.app
