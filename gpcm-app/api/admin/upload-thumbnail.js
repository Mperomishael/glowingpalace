import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { requireAdmin } from '../_lib/auth.js';
import { supabaseAdmin, MEDIA_BUCKET } from '../_lib/supabaseAdmin.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB, this is just a thumbnail image
  fileFilter: (_, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP allowed for thumbnails'));
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const session = await requireAdmin(req, res, 'upload');
  if (!session) return;

  try {
    await runMiddleware(req, res, upload.single('file'));
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  if (!req.file) return res.status(400).json({ error: 'No file' });

  const ext = path.extname(req.file.originalname).toLowerCase();
  const storagePath = `thumbnails/${Date.now()}-${nanoid(8)}${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  res.status(201).json({ url: data.publicUrl });
}
