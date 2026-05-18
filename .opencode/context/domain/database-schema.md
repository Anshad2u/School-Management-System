# Database Schema

Current database schema for Gem Stone Salafi School Management System.

## Tables

### students
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO | |
| grade | text | YES | |
| age | integer | YES | |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |
| admission_date | timestamptz | YES | timezone('utc'::text, now()) |
| date_of_birth | date | YES | |
| parent_name | text | YES | |
| contact_number | text | YES | |
| photo_url | text | YES | |
| status | text | YES | 'active' |

**Check constraint**: `status IN ('active', 'graduated', 'transferred', 'withdrawn')`

### teachers
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO | |
| subject | text | YES | |
| qualification | text | YES | |
| experience | integer | YES | |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |

### profiles
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | references auth.users |
| username | text | YES | unique |
| phone_number | text | YES | |
| role | text | YES | |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |

**Check constraint**: `role IN ('admin', 'principal', 'teacher', 'staff', 'student', 'parent')`

### courses
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO | |
| teacher_id | uuid | YES | references profiles(id) |
| description | text | YES | |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |

### grades
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | YES | references profiles(id) |
| subject | text | YES | |
| grade | text | YES | |
| date | timestamptz | NO | timezone('utc'::text, now()) |

### fees
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | YES | references profiles(id) |
| amount | numeric | YES | |
| status | text | YES | |
| due_date | date | YES | |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |

**Check constraint**: `status IN ('paid', 'pending', 'overdue')`

### school_settings
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| school_name | text | YES | |
| address | text | YES | |
| phone | text | YES | |
| email | text | YES | |
| address_line | text | YES | |
| city | text | YES | |
| state | text | YES | |
| postal_code | text | YES | |
| country | text | YES | |
| website_url | text | YES | |
| monday_start through sunday_end | text | YES | |
| logo_url | text | YES | |
| motto | text | YES | |
| primary_color | text | YES | '#3b82f6' |
| secondary_color | text | YES | '#64748b' |
| created_at | timestamptz | NO | timezone('utc'::text, now()) |

### Other Tables
- **announcements**: id, title, content, date, created_at
- **events**: id, name, description, date, created_at
- **transactions**: id, recipient_id (ref profiles), amount, type, date
- **school_finances**: id, type, amount, description, date
- **evaluations**: id, teacher_id (ref profiles), student_id (ref profiles), score, comments, date
- **resources**: id, title, url, description, created_at
- **stories**: id, title, content, author_id (ref profiles), created_at
- **comments**: id, post_id (ref stories), author_id (ref profiles), content, created_at
- **follows**: id, follower_id (ref profiles), following_id (ref profiles), created_at

## Relationships

```
profiles (1) ──┬── (many) grades
               ├── (many) evaluations (as teacher)
               ├── (many) evaluations (as student)
               ├── (many) fees
               ├── (many) transactions
               ├── (many) courses (as teacher)
               ├── (many) stories (as author)
               ├── (many) comments (as author)
               └── (many) follows (as follower/following)

students (1) ── (no FK relationships, standalone table)
```

## RLS Policies

All tables have Row Level Security enabled. Key policies:
- `profiles`: Viewable by everyone, users can insert/update own
- `students`: Viewable by everyone, staff/admin/principal can insert/update/delete
- Other tables: Varying read/write policies based on role
