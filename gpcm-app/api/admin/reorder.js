import { requireAdmin } from '../_lib/auth.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }

  const updates = orderedIds.map((id, index) =>
    supabaseAdmin.from('media').update({ order: index }).eq('id', id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) return res.status(500).json({ error: failed.error.message });

  res.json({ success: true });
}
