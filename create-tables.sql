-- Create school_settings table
create table school_settings (
  id uuid primary key default gen_random_uuid(),
  name text,
  address text,
  description text,
  contact_phone text,
  contact_email text,
  address_line text,
  city text,
  state text,
  postal_code text,
  country text,
  website_url text,
  monday_start text,
  monday_end text,
  tuesday_start text,
  tuesday_end text,
  wednesday_start text,
  wednesday_end text,
  thursday_start text,
  thursday_end text,
  friday_start text,
  friday_end text,
  saturday_start text,
  saturday_end text,
  sunday_start text,
  sunday_end text,
  logo_url text,
  motto text,
  primary_color text default '#3b82f6',
  secondary_color text default '#64748b',
  updated_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid references profiles(id),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create fees table  
create table fees (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  amount numeric,
  status text check (status in ('paid', 'pending', 'overdue')),
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create follows table
create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references profiles(id),
  following_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table courses enable row level security;
alter table fees enable row level security;
alter table follows enable row level security;
