# School Management System — AI Context

Context-aware AI system for the Gem Stone Salafi School Management System.

## Quick Reference

**Project**: Gem Stone Salafi School Management System
**Repo**: github.com/Anshad2u/School-Management-System
**Live**: my-sms-beta.vercel.app
**Stack**: Next.js 16 + React 19 + TypeScript + Supabase + Tailwind

## Structure

```
.opencode/
├── agent/
│   ├── sms-orchestrator.md          # Main coordinator
│   └── subagents/
│       ├── feature-builder.md       # New pages and features
│       ├── database-manager.md      # Schema and migrations
│       ├── ui-specialist.md         # Visual design and theming
│       ├── bug-fixer.md             # Error diagnosis and fixes
│       └── data-manager.md          # Test data seeding
├── context/
│   ├── domain/
│   │   ├── database-schema.md       # All tables and columns
│   │   └── project-stack.md         # Tech stack and config
│   ├── processes/
│   │   ├── routing-conventions.md   # Next.js patterns
│   │   └── deployment-workflow.md   # Git + Vercel process
│   ├── standards/
│   │   └── code-quality.md          # Coding standards
│   └── templates/
│       ├── page-template.md         # Page component templates
│       └── migration-template.md    # SQL migration templates
├── workflows/
│   ├── feature-development.md       # Build new features
│   └── bug-fix.md                   # Fix bugs systematically
└── command/
    ├── add-feature.md               # /add-feature
    ├── seed-data.md                 # /seed-data
    └── deploy.md                    # /deploy
```

## How It Works

1. **Orchestrator** (`sms-orchestrator.md`) receives your request
2. Routes to the appropriate **subagent** based on task type
3. Subagent reads relevant **context files** for domain knowledge
4. Follows the appropriate **workflow** for execution
5. Deploys and verifies at **my-sms-beta.vercel.app**

## Commands

| Command | Purpose |
|---------|---------|
| `/add-feature {name}` | Create a new page or module |
| `/seed-data {table}` | Insert sample test data |
| `/deploy` | Deploy current changes |

## Database

17 tables: students, teachers, profiles, courses, grades, fees, transactions, school_finances, evaluations, announcements, events, resources, stories, comments, follows, school_settings, test

## Roles

admin, principal, staff, teacher, student, parent
