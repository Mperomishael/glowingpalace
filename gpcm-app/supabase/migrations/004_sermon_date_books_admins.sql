-- 004: sermon dates, books/tracts, multi-admin users
-- Run in Supabase SQL Editor after previous migrations.

-- 1) Sermon / media date (for ordering newest first)
alter table public.media
  add column if not exists sermon_date date;

update public.media
set sermon_date = (created_at at time zone 'utc')::date
where sermon_date is null;

-- 2) Expand category + type for books/tracts (PDF)
alter table public.media drop constraint if exists media_category_check;
alter table public.media add constraint media_category_check
  check (category in ('gallery', 'leader', 'sermon_video', 'sermon_audio', 'book', 'other'));

alter table public.media drop constraint if exists media_type_check;
alter table public.media add constraint media_type_check
  check (type in ('image', 'video', 'audio', 'document'));

-- 3) Admin users (sub-admins with permissions)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  display_name text,
  is_super boolean not null default false,
  can_upload boolean not null default true,
  can_publish boolean not null default false,
  can_edit boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- No public access; server uses service role only
drop policy if exists "No public admin_users" on public.admin_users;
create policy "No public admin_users"
  on public.admin_users for select
  using (false);

-- Optional: seed is done via API with ADMIN_PASSWORD, not here
