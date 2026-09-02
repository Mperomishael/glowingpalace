import { useCallback, useEffect, useState } from "react";
import { fetchPublishedMedia } from "@/lib/fetch-media";
import { type MediaItem } from "@/lib/media";

let inflight: Promise<MediaItem[]> | null = null;

function loadAll(): Promise<MediaItem[]> {
  if (!inflight) {
    inflight = fetchPublishedMedia().catch((err) => {
      inflight = null;
      throw err;
    });
  }
  return inflight;
}

export function useMedia(category?: string, limit?: number) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      inflight = null;
      let items = await loadAll();
      if (category) items = items.filter((m) => m.category === category);
      if (limit && limit > 0) items = items.slice(0, limit);
      setMedia(items);
    } catch (err) {
      console.error("useMedia", err);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadAll()
      .then((all) => {
        if (cancelled) return;
        let items = category ? all.filter((m) => m.category === category) : all;
        if (limit && limit > 0) items = items.slice(0, limit);
        setMedia(items);
      })
      .catch((err) => {
        console.error("useMedia", err);
        if (!cancelled) setMedia([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, limit]);

  return { media, loading, refresh: fetchMedia };
}

export type { MediaItem } from "@/lib/media";
export { formatSermonDate } from "@/lib/media";