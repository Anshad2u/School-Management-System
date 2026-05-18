# Task Context: Admission Form Enhancement

Session ID: 2026-05-18-admission-form-enhancement
Created: 2026-05-18T23:00:00Z
Status: in_progress

## Current Request
Add Student Photo Upload, Home Address, Gender, Emergency Contact fields to admission form. Add printable PDF admission form with parent signature section.

## Context Files (Standards to Follow)
- .opencode/context/standards/code-quality.md
- .opencode/context/domain/database-schema.md
- .opencode/context/templates/page-template.md
- .opencode/context/templates/migration-template.md

## Reference Files
- src/app/admissions/page.tsx
- src/lib/supabase.ts

## Components
1. DB Migration — Add columns to students table
2. Supabase Storage — Create student-photos bucket
3. Admission Form — Add new fields + photo upload
4. Printable Form — Print-friendly view with signature lines

## Constraints
- Use window.print() with print CSS (no extra deps)
- Photo upload to Supabase Storage
- A4 print layout with school header and signature lines

## Exit Criteria
- [ ] Migration pushed, new columns exist
- [ ] Storage bucket created
- [ ] Form has all new fields + photo upload
- [ ] Print button renders clean A4 admission form
- [ ] Build passes, deployed to Vercel
