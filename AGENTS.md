# AI Agent Instructions

## Purpose
This repo uses AI-guided conventions for feature work, database changes, UI updates, and bug fixes. Agents should read the repository-specific `.opencode/` guidance and follow existing project patterns.

## Core guidance
- Stack: Next.js 16 + React 19 + TypeScript + Tailwind CSS + Supabase + shadcn/ui
- Local dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Key entry points: `src/app/layout.tsx`, `src/lib/supabase.ts`, `src/contexts/AuthContext.tsx`
- UI primitives: use `src/components/ui/*` and Tailwind classes
- Authentication/data: use the shared Supabase client in `src/lib/supabase.ts`
- Interactive pages: place under `src/app/{route}/page.tsx` and use `'use client'` when needed

## Supabase and environment variables
- Client env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`
- Do not expose the service role key in client-side code
- Respect Supabase RLS policies in all queries

## Project structure
- `src/app/` contains App Router pages for admissions, students, teachers, staff, school-settings, fees, grade-book, analytics, resources, stories, events, performance-evaluation, login, signup, and profile pages
- `src/components/` contains shared UI and layout components
- `src/contexts/` contains auth and sidebar state providers
- `src/lib/` contains shared utilities and the Supabase client

## Existing AI context docs
- Read `CONTEXT.md` before making domain-level changes
- Use `.opencode/agent/` for task routing and specialized behavior
- Use `.opencode/context/` for stack, routing, and schema conventions
- Use `.opencode/workflows/` for feature development and bug-fixing guidance

## Issue tracking and triage
- Issues tracked in GitHub Issues. See `docs/agents/issue-tracker.md`
- Triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`