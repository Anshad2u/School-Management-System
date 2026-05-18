# Project Stack & Configuration

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.6 |
| UI Library | React | 19.2.6 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.1 |
| Components | shadcn/ui | latest |
| Icons | lucide-react | 0.469.0 |
| Charts | recharts | 2.15.0 |
| Database | Supabase (PostgreSQL) | latest |
| Forms | react-hook-form + zod | 7.54.2 / 3.24.1 |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admissions/         # Student enrollment
│   ├── analytics/          # Data dashboards
│   ├── announcements/      # School notices
│   ├── courses/            # Subject catalog
│   ├── events/             # Calendar
│   ├── fees/               # Fee management
│   ├── financial-management/
│   ├── grade-book/         # Grades
│   ├── login/              # Auth login
│   ├── performance-evaluation/
│   ├── profile/[id]/       # Dynamic user profiles
│   ├── resources/          # Learning materials
│   ├── school-settings/    # Configuration
│   ├── signup/             # Auth registration
│   ├── staff/              # Staff management
│   ├── stories/            # School stories
│   ├── students/           # Student directory
│   ├── teacher-qualifications/
│   └── teachers/           # Teacher directory
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── Sidebar.tsx         # Navigation sidebar
│   └── MobileSidebarWrapper.tsx
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── SidebarContext.tsx  # Sidebar toggle state
├── hooks/                  # Custom React hooks
└── lib/
    ├── supabase.ts         # Supabase client
    └── utils.ts            # cn() utility
```

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Client+Server | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Client+Server | Supabase anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | Server only | Supabase service role (bypasses RLS) |

## Key Files

- `src/lib/supabase.ts` — Supabase client initialization (uses env vars)
- `src/contexts/AuthContext.tsx` — Auth state management
- `src/app/layout.tsx` — Root layout with providers
- `src/app/page.tsx` — Home page (landing for guests, dashboard for users)
- `tailwind.config.ts` — Tailwind configuration
- `next.config.ts` — Next.js configuration

## Build & Deploy

```bash
npm run dev      # Local development (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

Deployment: Vercel auto-deploys on push to master.
Alias: my-sms-beta.vercel.app
