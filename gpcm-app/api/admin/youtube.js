import { requireAdmin } from '../_lib/auth.js';
import { supabaseAdmin, mapMediaRow, extractYoutubeId } from '../_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const session = await requireAdmin(req, res, 'upload');
  if (!session) return;

  const { youtubeUrl, title, thumbnailUrl, sermonDate } = req.body || {};
  if (!youtubeUrl) return res.status(400).json({ error: 'youtubeUrl is required' });

  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) return res.status(400).json({ error: 'Could not read a video ID from that YouTube link' });

  const finalThumbnail = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const dateVal = sermonDate || new Date().toISOString().slice(0, 10);

  const { count } = await supabaseAdmin.from('media').select('*', { count: 'exact', head: true });

  const { data: row, error } = await supabaseAdmin
    .from('media')
    .insert({
      filename: `youtube-${videoId}`,
      original_name: title || `YouTube video ${videoId}`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      storage_path: null,
      type: 'video',
      category: 'sermon_video',
      source: 'youtube',
      youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: finalThumbnail,
      downloadable: false,
      status: 'pending',
      title: title || null,
      sermon_date: dateVal,
      order: count ?? 0,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(mapMediaRow(row));
}
