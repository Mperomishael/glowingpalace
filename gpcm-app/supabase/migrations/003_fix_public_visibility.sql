-- 003_fix_public_visibility.sql
-- Fixes: "upload/publish succeeds in admin, but item never appears on the
-- public site."
--
-- ROOT CAUSE
-- The admin panel talks to Supabase through the SERVICE ROLE key
-- (api/_lib/supabaseAdmin.js), which bypasses Row Level Security
-- entirely. So the admin UI will *always* show a successful publish,
-- no matter what your RLS policies say.
--
-- The public site, however, reads either:
--   a) directly from Supabase with the ANON key (src/hooks/useMedia.ts),
--      which IS subject to RLS, or
--   b) via /api/media.js — which also uses the service role, so if you
--      still see nothing there, it's not RLS, see the caching note below.
--
-- If the "Public read visible media" policy in schema.sql was never run
-- against your live project (or an earlier, broken version of it was),
-- Postgres RLS defaults to DENY ALL for the anon role. Every anon SELECT
-- silently returns an empty array — no error, which is exactly the
-- "shows successful but doesn't display" symptom.
--
-- Run this whole file in Supabase Dashboard → SQL Editor → New query.
-- It is idempotent — safe to run multiple times.

-- 1) Make sure RLS is actually ON (it's easy to forget after a table
--    edit in the dashboard UI, which can silently leave it off).
alter table public.media enable row level security;

-- 2) Re-create the public read policy from scratch so there's no way a
--    half-applied earlier version is lingering.
drop policy if exists "Public read visible media" on public.media;
create policy "Public read visible media"
  on public.media for select
  to anon, authenticated
  using (status = 'published');

-- 3) Re-create the admin (service role bypasses this anyway, but keep it
--    correct for any authenticated-JWT-based access too).
drop policy if exists "Admin full access" on public.media;
create policy "Admin full access"
  on public.media for all
  to authenticated
  using (true)
  with check (true);

-- 4) Storage: confirm the bucket itself is public and objects are
--    readable by anyone. If the `media` bucket was created as PRIVATE,
--    public URLs will 400/403 even though the DB row is published —
--    this looks identical to a "doesn't display" bug from the outside.
drop policy if exists "Public read media files" on storage.objects;
create policy "Public read media files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- 5) Sanity checks — run these separately and read the output:

-- 5a) Confirm RLS is on and exactly these 2 policies exist on `media`.
--     If you see 0 rows or a different set, that's your bug.
-- select polname, permissive, roles, cmd
-- from pg_policies where tablename = 'media';

-- 5b) Confirm the bucket is public (should return true).
-- select public from storage.buckets where id = 'media';

-- 5c) Simulate what the public site actually sees. Run this as the
--     `anon` role (Supabase SQL editor → "Run as" selector, or just
--     check that published rows > 0 here matches what's on the site).
-- select id, status, category, created_at from public.media
-- where status = 'published' order by created_at desc;
