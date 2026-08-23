import { requireAdmin, hashPassword } from '../_lib/auth.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    isSuper: row.is_super,
    canUpload: row.can_upload,
    canPublish: row.can_publish,
    canEdit: row.can_edit,
    active: row.active,
    createdAt: row.created_at,
  };
}

export default async function handler(req, res) {
  const session = await requireAdmin(req, res, 'super');
  if (!session) return;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, display_name, is_super, can_upload, can_publish, can_edit, active, created_at')
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json((data || []).map(publicUser));
  }

  if (req.method === 'POST') {
    const {
      username,
      password,
      displayName,
      canUpload = true,
      canPublish = false,
      canEdit = false,
      isSuper = false,
    } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        username: String(username).trim().toLowerCase(),
        password_hash: hashPassword(password),
        display_name: displayName || username,
        is_super: !!isSuper,
        can_upload: !!canUpload || !!isSuper,
        can_publish: !!canPublish || !!isSuper,
        can_edit: !!canEdit || !!isSuper,
        active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Username already exists' });
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(publicUser(data));
  }

  if (req.method === 'PATCH') {
    const { id, ...rest } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required' });

    const updates = {};
    if (rest.displayName !== undefined) updates.display_name = rest.displayName;
    if (rest.canUpload !== undefined) updates.can_upload = !!rest.canUpload;
    if (rest.canPublish !== undefined) updates.can_publish = !!rest.canPublish;
    if (rest.canEdit !== undefined) updates.can_edit = !!rest.canEdit;
    if (rest.isSuper !== undefined) updates.is_super = !!rest.isSuper;
    if (rest.active !== undefined) updates.active = !!rest.active;
    if (rest.password) {
      if (String(rest.password).length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      updates.password_hash = hashPassword(rest.password);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(publicUser(data));
  }

  if (req.method === 'DELETE') {
    const id = req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    if (id === session.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    const { error } = await supabaseAdmin.from('admin_users').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
