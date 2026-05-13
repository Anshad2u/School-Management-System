# Context: Gem Stone Salafi School Management System

## Core Entities

| Term | Definition |
|------|------------|
| **School Settings** | Configuration entity storing school identity, contact, timing, and branding data. Single record (id=1). |
| **Contact Info** | Fields: `contact_phone`, `contact_email`, `address_line`, `city`, `state`, `postal_code`, `country`, `website_url` |
| **School Timings** | Per-day operating hours: `monday_start`, `monday_end`, `tuesday_start`, `tuesday_end`, etc. |
| **Branding** | Visual identity: `logo_url`, `motto`, `primary_color`, `secondary_color` |

## Roles

| Role | Permissions |
|------|-------------|
| **student** | View own data |
| **teacher** | View own students, manage grade book |
| **staff** | Basic administrative access |
| **principal** | Full access including school settings |
| **admin** | Full access including school settings |

## Relationships

- School Settings (1) → Profiles (many) - each user belongs to one school
- Profiles have roles determining access levels