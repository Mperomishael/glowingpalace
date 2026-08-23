import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anon!)
  : null;

export type MediaRow = {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  storage_path: string | null;
  type: 'image' | 'video' | 'audio' | 'document';
  category: string;
  source: 'upload' | 'youtube';
  youtube_url: string | null;
  thumbnail_url: string | null;
  downloadable: boolean;
  status: 'pending' | 'published' | 'rejected';
  title: string | null;
  description: string | null;
  order: number;
  sermon_date: string | null;
  created_at: string;
};

/** Map DB row → front-end MediaItem shape */
export function mapMediaRow(row: MediaRow) {
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
