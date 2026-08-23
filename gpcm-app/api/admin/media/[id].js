import { requireAdmin } from '../../_lib/auth.js';
import { supabaseAdmin, mapMediaRow, MEDIA_BUCKET } from '../../_lib/supabaseAdmin.js';

const PATCHABLE = {
  category: 'category',
  status: 'status',
  order: 'order',
  originalName: 'original_name',
  title: 'title',
  description: 'description',
  youtubeUrl: 'youtube_url',
  thumbnailUrl: 'thumbnail_url',
  downloadable: 'downloadable',
  sermonDate: 'sermon_date',
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const isStatusOnly =
      req.body &&
      Object.keys(req.body).length === 1 &&
      req.body.status !== undefined;

    const session = await requireAdmin(
      req,
      res,
      isStatusOnly ? 'publish' : 'edit'
    );
    if (!session) return;

    // Publish also allowed if canPublish and only status changing
    if (isStatusOnly && !session.canPublish && !session.canEdit) {
      return res.status(403).json({ error: 'No publish permission' });
    }

    const updates = {};
    for (const [bodyKey, column] of Object.entries(PATCHABLE)) {
      if (req.body?.[bodyKey] !== undefined) updates[column] = req.body[bodyKey];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.json(mapMediaRow(data));
  }

  if (req.method === 'DELETE') {
    const session = await requireAdmin(req, res, 'edit');
    if (!session) return;

    const { data: item, error: fetchErr } = await supabaseAdmin
      .from('media')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchErr) return res.status(404).json({ error: 'Not found' });

    if (item?.storage_path) {
      await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([item.storage_path]);
    }

    const { error: delErr } = await supabaseAdmin.from('media').delete().eq('id', id);
    if (delErr) return res.status(500).json({ error: delErr.message });

    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
