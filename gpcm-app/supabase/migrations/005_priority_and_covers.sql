-- 005: Use media."order" as display priority (lower = higher priority / shows first).
-- thumbnail_url is the book cover (and optional gallery feature image).
-- No schema change required if order + thumbnail_url already exist.
-- This migration only documents + backfills sensible defaults.

update public.media
set "order" = 100
where "order" is null;

-- Optional: books without a cover keep thumbnail_url null until admin uploads one.
