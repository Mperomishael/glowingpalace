import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing Supabase server env vars. Need VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

export const supabaseAdmin = createClient(url || '', serviceKey || '', {
  auth: { persistSession: false },
});

export const MEDIA_BUCKET = 'media';

export function mapMediaRow(row) {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    url: row.url,
    type: row.type,
    category: row.category,
    source: row.source,
    youtubeUrl: row.youtube_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    downloadable: row.downloadable,
    status: row.status,
    title: row.title ?? undefined,
    description: row.description ?? undefined,
    order: row.order,
    sermonDate: row.sermon_date ?? undefined,
    createdAt: row.created_at,
    storagePath: row.storage_path ?? undefined,
  };
}

export function extractYoutubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url?.match(p);
    if (m) return m[1];
  }
  return null;
}
