-- Create profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  phone_number text,
  role text check (role in ('admin', 'principal', 'teacher', 'staff', 'student', 'parent')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create announcements table
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create grades table
create table grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  subject text,
  grade text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create evaluations table
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id),
  student_id uuid references profiles(id),
  score integer,
  comments text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create teachers table
create table teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  qualification text,
  experience integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id),
  amount numeric,
  type text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create school_finances table
create table school_finances (
  id uuid primary key default gen_random_uuid(),
  type text,
  amount numeric,
  description text,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create school_settings table
create table school_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text,
  address text,
  phone text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create stories table
create table stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  author_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references stories(id),
  author_id uuid references profiles(id),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create resources table
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table announcements enable row level security;
alter table events enable row level security;
alter table grades enable row level security;
alter table evaluations enable row level security;
alter table teachers enable row level security;
alter table transactions enable row level security;
alter table school_finances enable row level security;
alter table school_settings enable row level security;
alter table stories enable row level security;
alter table comments enable row level security;
alter table resources enable row level security;

-- Create policies for profiles
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);