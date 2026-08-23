import crypto from 'crypto';
import { supabaseAdmin } from './supabaseAdmin.js';

/** PBKDF2 password hashing (no extra npm deps). Format: salt:hash */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!password || !stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  if (hash.length !== verify.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Resolve admin session from x-admin-token header.
 * - Legacy super: token === ADMIN_PASSWORD
 * - Sub-admin: token === "u:<username>:<password>" (plain, verified against DB each request)
 */
export async function getAdminSession(req) {
  const token = req.headers['x-admin-token'];
  if (!token || typeof token !== 'string') return null;

  const expected = process.env.ADMIN_PASSWORD;
  if (expected && token === expected) {
    return {
      id: 'env-super',
      username: 'superadmin',
      displayName: 'Super Admin',
      isSuper: true,
      canUpload: true,
      canPublish: true,
      canEdit: true,
      isEnvSuper: true,
    };
  }

  if (token.startsWith('u:')) {
    const rest = token.slice(2);
    const sep = rest.indexOf(':');
    if (sep <= 0) return null;
    const username = rest.slice(0, sep);
    const password = rest.slice(sep + 1);
    if (!username || !password) return null;

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .maybeSingle();

    if (error || !user) return null;
    if (!verifyPassword(password, user.password_hash)) return null;

    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name || user.username,
      isSuper: !!user.is_super,
      canUpload: !!user.can_upload || !!user.is_super,
      canPublish: !!user.can_publish || !!user.is_super,
      canEdit: !!user.can_edit || !!user.is_super,
      isEnvSuper: false,
    };
  }

  return null;
}

export async function requireAdmin(req, res, permission) {
  const session = await getAdminSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  if (permission === 'upload' && !session.canUpload) {
    res.status(403).json({ error: 'No upload permission' });
    return null;
  }
  if (permission === 'publish' && !session.canPublish) {
    res.status(403).json({ error: 'No publish permission' });
    return null;
  }
  if (permission === 'edit' && !session.canEdit) {
    res.status(403).json({ error: 'No edit permission' });
    return null;
  }
  if (permission === 'super' && !session.isSuper) {
    res.status(403).json({ error: 'Super admin only' });
    return null;
  }
  return session;
}

/** Sync helper kept for older call sites that expect boolean (no permission). */
export function checkAdminToken(req) {
  const token = req.headers['x-admin-token'];
  const expected = process.env.ADMIN_PASSWORD;
  if (expected && token === expected) return true;
  if (typeof token === 'string' && token.startsWith('u:')) return true; // full check is async
  return false;
}
