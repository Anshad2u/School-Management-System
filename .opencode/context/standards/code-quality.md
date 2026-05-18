# Code Quality Standards

## TypeScript Rules

- No `any` types — use proper interfaces or `unknown`
- All component props must be typed
- Use `React.FormEvent` for form handlers
- Use optional chaining `?.` for nullable values
- Use non-null assertion `!` only for env vars known to exist

## React Rules

- Always use `'use client'` directive for interactive components
- Prefer `useState` over refs for reactive state
- Use `useEffect` only for side effects (data fetching, subscriptions)
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback` when passed as props

## Supabase Rules

- Never hardcode Supabase credentials — use env vars
- Always handle errors: `if (error) throw error`
- Use `.select().single()` when expecting one row
- Use `.select('column1, column2')` to fetch only needed columns
- Respect RLS policies — don't rely on service role in client code
- Use `Prefer: return=representation` header for insert/update to get back inserted data

## UI Rules

- Use shadcn/ui components over raw HTML where available
- Follow Tailwind spacing scale (no arbitrary values unless necessary)
- Mobile-first responsive design (base → sm → md → lg)
- Use semantic HTML: `<form>`, `<label>`, `<button>`, `<nav>`, etc.
- Accessible: all inputs have associated labels, buttons have descriptive text

## Security Rules

- NEVER commit `.env.local` to git (already in .gitignore)
- NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- NEVER log sensitive data (tokens, passwords, PII)
- Validate all user input with zod schemas
- Use parameterized queries (Supabase handles this)

## File Organization

- One component per file
- Keep files under 200 lines
- Group related components in directories
- Use kebab-case for directories, PascalCase for components
- Use lowercase for page routes

## Testing Standards

- Build must pass before committing: `npm run build`
- Lint must pass: `npm run lint`
- Test critical user flows manually after deployment
- Verify database changes with direct queries
