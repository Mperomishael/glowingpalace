-- GPCM INT'L — Migration 002
-- Run in Supabase SQL Editor AFTER schema.sql has already been applied once.
-- Adds: publish/reject workflow, YouTube video sermons, thumbnails, download flag.

-- 1) New columns
alter table public.media add column if not exists status text not null default 'published'
  check (status in ('pending', 'published', 'rejected'));

alter table public.media add column if not exists source text not null default 'upload'
  check (source in ('upload', 'youtube'));

alter table public.media add column if not exists youtube_url text;
alter table public.media add column if not exists thumbnail_url text;
alter table public.media add column if not exists downloadable boolean not null default true;

-- storage_path is only meaningful for uploaded files, not YouTube links
alter table public.media alter column storage_path drop not null;

-- 2) Backfill status from the old `hidden` boolean, then drop it
update public.media set status = case when hidden then 'rejected' else 'published' end
  where status = 'published'; -- only touch rows still at the default

alter table public.media drop column if exists hidden;

-- 3) Index for admin tab queries
create index if not exists media_status_idx on public.media (status);

-- 4) Public read policy now keys off status, not hidden
drop policy if exists "Public read visible media" on public.media;
create policy "Public read visible media"
  on public.media for select
  using (status = 'published');
