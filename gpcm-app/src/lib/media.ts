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
}

export type MediaSort = 'latest' | 'name';

/** Human-readable date for a sermon video/audio card — prefers the sermon date over the upload date. */
export function formatSermonDate(item: Pick<MediaItem, 'sermonDate' | 'createdAt'>): string {
  const raw = item.sermonDate || item.createdAt;
  if (!raw) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Converts a YouTube watch/share/shorts URL into an embeddable iframe URL. */
export function youtubeEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    let videoId = '';
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else if (u.pathname.includes('/shorts/')) {
      videoId = u.pathname.split('/shorts/')[1] || '';
    } else if (u.pathname.includes('/embed/')) {
      return url;
    } else if (u.searchParams.get('v')) {
      videoId = u.searchParams.get('v') || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  } catch {
    return url;
  }
}
