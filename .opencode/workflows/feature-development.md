# Feature Development Workflow

End-to-end workflow for building new features in the School Management System.

## Stages

### 1. Requirements
- Understand what the user wants to build
- Identify which database tables are involved
- Determine if schema changes are needed

### 2. Database (if needed)
- Create migration file in `supabase/migrations/`
- Push migration: `supabase db push`
- Verify schema changes
- Update `.opencode/context/domain/database-schema.md`

### 3. Implementation
- Create page at `src/app/{route}/page.tsx`
- Use page template from `.opencode/context/templates/page-template.md`
- Follow routing conventions from `.opencode/context/processes/routing-conventions.md`
- Use existing shadcn/ui components

### 4. Build Verification
- Run `npm run build`
- Fix any build errors

### 5. Deploy
- `git add -A`
- `git commit -m "feat: description"`
- `git push origin master`
- Wait 30 seconds for Vercel deploy
- Verify at my-sms-beta.vercel.app/{route}

## Decision Points

**Need database changes?**
- Yes → Route to @database-manager first
- No → Proceed to implementation

**New page or modify existing?**
- New → Create new directory under src/app/
- Modify → Edit existing file

**Client or server component?**
- Interactive (forms, state) → 'use client'
- Static content → Server component (default)
