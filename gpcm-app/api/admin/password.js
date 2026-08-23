import { requireAdmin, hashPassword, verifyPassword } from '../_lib/auth.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';

/**
 * POST { currentPassword, newPassword }
 * - Env super admin: cannot change ADMIN_PASSWORD via API (set in Vercel env).
 * - DB super / sub-admin: updates password_hash in admin_users.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAdmin(req, res);
  if (!session) return;

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  if (session.isEnvSuper) {
    return res.status(400).json({
      error:
        'Super admin password is set via ADMIN_PASSWORD in Vercel Environment Variables. Change it there and redeploy.',
    });
  }

  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', session.id)
    .single();

  if (error || !user) return res.status(404).json({ error: 'User not found' });
  if (!verifyPassword(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const password_hash = hashPassword(newPassword);
  const { error: upErr } = await supabaseAdmin
    .from('admin_users')
    .update({ password_hash })
    .eq('id', session.id);

  if (upErr) return res.status(500).json({ error: upErr.message });

  // New token so client can keep session
  const token = `u:${user.username}:${newPassword}`;
  return res.json({ success: true, token });
}
