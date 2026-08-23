-- GPCM INT'L – Supabase schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- (If you already ran an earlier version of this file, run
--  supabase/migrations/002_status_and_sermons.sql instead — it upgrades
--  an existing table in place.)

-- 1) Media metadata
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  original_name text not null,
  url text not null,
  storage_path text, -- null for source='youtube' (no uploaded file)
  type text not null check (type in ('image', 'video', 'audio')),
  category text not null default 'gallery'
    check (category in ('gallery', 'leader', 'sermon_video', 'sermon_audio', 'other')),
  source text not null default 'upload' check (source in ('upload', 'youtube')),
  youtube_url text,
  thumbnail_url text,
  downloadable boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  title text,
  description text,
  "order" int not null default 0,
  hidden boolean not null default false, -- deprecated, kept for compatibility; use `status`
  created_at timestamptz not null default now()
);

create index if not exists media_category_idx on public.media (category);
create index if not exists media_status_idx on public.media (status);

-- 2) RLS
alter table public.media enable row level security;

-- Public can read only published media
drop policy if exists "Public read visible media" on public.media;
create policy "Public read visible media"
  on public.media for select
  using (status = 'published');

-- Authenticated admins can do everything
drop policy if exists "Admin full access" on public.media;
create policy "Admin full access"
  on public.media for all
  to authenticated
  using (true)
  with check (true);

-- 3) Storage bucket (run after creating bucket `media` in Dashboard → Storage)
-- Bucket name: media
-- Public: YES (for public URLs on the site)

-- Storage policies (bucket must exist first)
-- Allow public read
drop policy if exists "Public read media files" on storage.objects;
create policy "Public read media files"
  on storage.objects for select
  using (bucket_id = 'media');

-- Authenticated upload/update/delete
drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
