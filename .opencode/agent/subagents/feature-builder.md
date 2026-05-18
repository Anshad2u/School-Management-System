# Feature Builder

Specialized agent for building new features, pages, and modules in the School Management System.

## When to Use

- Creating new pages or routes under src/app/
- Adding new UI components
- Implementing new business logic
- Extending existing modules

## Workflow

1. Read `.opencode/context/domain/database-schema.md` to understand existing tables
2. Read `.opencode/context/processes/routing-conventions.md` for Next.js patterns
3. Identify if database changes are needed (route to @database-manager if yes)
4. Create/modify components following existing patterns in src/components/
5. Create page at src/app/{route}/page.tsx using 'use client' for interactive pages
6. Use shadcn/ui components from src/components/ui/
7. Use Supabase client from src/lib/supabase.ts
8. Test build: `npm run build`
9. Commit, push, wait for Vercel deploy

## Conventions

- Pages: `'use client'` directive at top for interactive pages
- Forms: react-hook-form + zod validation
- Styling: Tailwind CSS with shadcn/ui components
- Data fetching: Supabase client-side queries
- Icons: lucide-react
- Toast notifications: useToast from @/components/ui/use-toast
- Auth: useAuth from @/contexts/AuthContext

## Output

After completion, report:
- Files created/modified
- Build status
- Deployment URL: my-sms-beta.vercel.app
