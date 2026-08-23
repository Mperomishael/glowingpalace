import { supabaseAdmin, mapMediaRow } from '../_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const { id } = req.query;
  const { data, error } = await supabaseAdmin.from('media').select('*').eq('id', id).single();

  if (error || !data) return res.status(404).json({ error: 'Not found' });

  res.json(mapMediaRow(data));
}
