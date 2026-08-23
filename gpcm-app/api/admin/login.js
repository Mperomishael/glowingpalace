import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { verifyPassword } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, username } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;

  // Super admin via env password (username optional / "superadmin")
  if (expected && password === expected && (!username || username === 'superadmin' || username === 'admin')) {
    return res.json({
      token: expected,
      user: {
        username: 'superadmin',
        displayName: 'Super Admin',
        isSuper: true,
        canUpload: true,
        canPublish: true,
        canEdit: true,
      },
    });
  }

  // Sub-admin from admin_users table
  if (username && password) {
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .maybeSingle();

    if (!error && user && verifyPassword(password, user.password_hash)) {
      const token = `u:${username}:${password}`;
      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name || user.username,
          isSuper: !!user.is_super,
          canUpload: !!user.can_upload || !!user.is_super,
          canPublish: !!user.can_publish || !!user.is_super,
          canEdit: !!user.can_edit || !!user.is_super,
        },
      });
    }
  }

  // Also try username-less login against admin_users if only password sent
  // (skip — require username for sub-admins)

  if (!expected) {
    console.error('ADMIN_PASSWORD is not set in the environment.');
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_PASSWORD not set' });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
}
