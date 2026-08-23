import { supabaseAdmin, mapMediaRow } from './_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const category = req.query?.category;

  let q = supabaseAdmin
    .from('media')
    .select('*')
    .eq('status', 'published')
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category && typeof category === 'string') {
    q = q.eq('category', category);
  }

  const { data, error } = await q;

  if (error) return res.status(500).json({ error: error.message });

  res.json((data || []).map(mapMediaRow));
}
