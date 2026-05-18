# Bug Fix Workflow

Systematic approach to diagnosing and fixing bugs.

## Steps

### 1. Reproduce
- Get exact error message from browser console or build output
- Identify the page/route where the error occurs
- Note the steps to trigger the error

### 2. Locate
- Search for error keywords in relevant files
- Check the stack trace for file and line number
- Read the identified file(s)

### 3. Diagnose
Common error patterns:

| Error | Cause | Fix |
|-------|-------|-----|
| PGRST204 | Column missing in schema | Run migration to add column |
| PGRST202 | RPC function missing | Check if function exists in DB |
| 401 Unauthorized | Auth token expired | Re-login or check auth flow |
| Build failed | Syntax/import error | Fix code, rebuild |
| RLS violation | Policy blocking access | Add/fix RLS policy |
| Foreign key violation | Referenced record missing | Insert parent record first |

### 4. Fix
- Apply minimal targeted change
- Do not refactor unrelated code

### 5. Verify
- `npm run build` passes locally
- Error no longer occurs
- No regressions in related features

### 6. Deploy
- Commit, push, wait for Vercel
- Verify at my-sms-beta.vercel.app
