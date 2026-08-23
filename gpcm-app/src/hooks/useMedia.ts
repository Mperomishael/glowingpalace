import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, mapMediaRow } from '../lib/supabase';

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: string;
  source: 'upload' | 'youtube';
  youtubeUrl?: string;
  thumbnailUrl?: string;
  downloadable: boolean;
  status: 'pending' | 'published' | 'rejected';
  title?: string;
  description?: string;
  order: number;
  sermonDate?: string;
  createdAt: string;
  storagePath?: string;
}

/** Priority first (lower order = higher priority), then newest date. */
function sortByPriority(items: MediaItem[]): MediaItem[] {
  return [...items].sort((a, b) => {
    const oa = a.order ?? 999;
    const ob = b.order ?? 999;
    if (oa !== ob) return oa - ob;
    const da = a.sermonDate || a.createdAt || '';
    const db = b.sermonDate || b.createdAt || '';
    return db.localeCompare(da);
  });
}

async function fetchFromApi(category?: string): Promise<MediaItem[]> {
  const res = await fetch(`/api/media?_=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data: MediaItem[] = await res.json();
  const filtered = category ? data.filter((m) => m.category === category) : data;
  return sortByPriority(filtered);
}

export function useMedia(category?: string, limit?: number) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        let q = supabase
          .from('media')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('created_at', { ascending: false });

        if (category) q = q.eq('category', category);

        const { data, error } = await q;
        if (error) throw error;
        let items = sortByPriority((data ?? []).map(mapMediaRow));
        if (limit && limit > 0) items = items.slice(0, limit);
        setMedia(items);
      } else {
        let items = await fetchFromApi(category);
        if (limit && limit > 0) items = items.slice(0, limit);
        setMedia(items);
      }
    } catch (err) {
      console.error('useMedia', err);
      try {
        let items = await fetchFromApi(category);
        if (limit && limit > 0) items = items.slice(0, limit);
        setMedia(items);
      } catch {
        setMedia([]);
      }
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, refresh: fetchMedia };
}

export function formatSermonDate(item: MediaItem): string {
  const raw = item.sermonDate || item.createdAt;
  if (!raw) return '';
  try {
    const d = new Date(raw.includes('T') ? raw : `${raw}T12:00:00`);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return raw;
  }
}
