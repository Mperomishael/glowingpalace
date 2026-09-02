import type { MediaItem } from './media';

/** Fetches all published media (optionally filtered by category) from the serverless API. */
export async function fetchPublishedMedia(category?: string): Promise<MediaItem[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`/api/media${qs}`);
  if (!res.ok) {
    throw new Error(`Failed to load media (${res.status})`);
  }
  return res.json();
}
