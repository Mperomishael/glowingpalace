import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { requireAdmin } from '../_lib/auth.js';
import { supabaseAdmin, MEDIA_BUCKET, mapMediaRow } from '../_lib/supabaseAdmin.js';

const AUDIO_EXTS = ['.mp3', '.m4a', '.wav', '.aac', '.ogg', '.flac', '.webm'];
const VIDEO_EXTS = ['.mp4', '.webm', '.mov'];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const DOC_EXTS = ['.pdf'];

const MIME_BY_EXT = {
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const mime = (file.mimetype || '').toLowerCase();
    const okExt = [...IMAGE_EXTS, ...VIDEO_EXTS, ...AUDIO_EXTS, ...DOC_EXTS].includes(ext);
    const okMime =
      mime.startsWith('image/') ||
      mime.startsWith('video/') ||
      mime.startsWith('audio/') ||
      mime === 'application/pdf' ||
      mime === 'application/octet-stream' ||
      mime === '';
    if (okExt || okMime) cb(null, true);
    else cb(new Error(`File type not allowed (${ext || mime || 'unknown'}). Use JPG, PNG, MP4, MP3, M4A, WAV, or PDF.`));
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

function resolveType(mimetype, ext) {
  const mime = (mimetype || '').toLowerCase();
  if (mime.startsWith('video/') || VIDEO_EXTS.includes(ext)) return 'video';
  if (mime.startsWith('audio/') || AUDIO_EXTS.includes(ext)) return 'audio';
  if (mime === 'application/pdf' || DOC_EXTS.includes(ext)) return 'document';
  return 'image';
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

  if (!req.file) return res.status(400).json({ error: 'No file received' });

  const original = req.file.originalname || 'file';
  let ext = path.extname(original).toLowerCase();
  // Some phones send audio without extension
  if (!ext && (req.file.mimetype || '').startsWith('audio/')) {
    if (req.file.mimetype.includes('mpeg')) ext = '.mp3';
    else if (req.file.mimetype.includes('mp4') || req.file.mimetype.includes('m4a')) ext = '.m4a';
    else if (req.file.mimetype.includes('wav')) ext = '.wav';
    else ext = '.mp3';
  }

  const contentType = MIME_BY_EXT[ext] || req.file.mimetype || 'application/octet-stream';
  const filename = `${Date.now()}-${nanoid(8)}${ext || ''}`;
  const storagePath = filename;

  const { error: uploadErr } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, req.file.buffer, {
      contentType,
      upsert: false,
    });

  if (uploadErr) {
    return res.status(500).json({
      error: uploadErr.message || 'Storage upload failed',
      hint: 'Check Supabase storage bucket policies and file size (serverless limit ~4.5MB on Vercel Hobby).',
    });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

  const type = resolveType(req.file.mimetype, ext);
  const category = req.body.category || (type === 'document' ? 'book' : type === 'audio' ? 'sermon_audio' : 'gallery');
  const downloadable = req.body.downloadable !== 'false';
  const sermonDate = req.body.sermonDate || req.body.sermon_date || null;
  const title = req.body.title || null;
  const description = req.body.description || null;
  const thumbnailUrl = req.body.thumbnailUrl || req.body.thumbnail_url || null;
  const orderVal =
    req.body.order !== undefined && req.body.order !== '' ? parseInt(req.body.order, 10) : null;

  const { count } = await supabaseAdmin.from('media').select('*', { count: 'exact', head: true });

  const insertRow = {
    filename,
    original_name: original,
    url: publicUrlData.publicUrl,
    storage_path: storagePath,
    type,
    category,
    source: 'upload',
    downloadable,
    status: 'pending',
    title,
    description,
    thumbnail_url: thumbnailUrl,
    order: Number.isFinite(orderVal) ? orderVal : count ?? 100,
  };
  if (sermonDate) insertRow.sermon_date = sermonDate;
  else if (type === 'video' || type === 'audio') {
    insertRow.sermon_date = new Date().toISOString().slice(0, 10);
  }

  const { data: row, error: insertErr } = await supabaseAdmin.from('media').insert(insertRow).select().single();

  if (insertErr) return res.status(500).json({ error: insertErr.message });

  res.status(201).json(mapMediaRow(row));
}
