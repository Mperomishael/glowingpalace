// src/pages/AdminPage.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Upload, Trash2, Image as ImageIcon, Video, Headphones,
  UserSquare2, FolderOpen, Check, XCircle, Youtube, Film, Clock,
  BookOpen, Settings, UserPlus, KeyRound, ChevronDown, ChevronRight,
} from 'lucide-react';
import ImageCropModal from '../components/admin/ImageCropModal';
import AdminLogin from '../components/admin/AdminLogin';
import AdminNav from '../components/admin/AdminNav';
import UploadProgressOverlay from '../components/admin/UploadProgressOverlay';
import { useGlassFeedback } from '../components/admin/GlassFeedback';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: string;
  source: 'upload' | 'youtube';
  youtubeUrl?: string;
  thumbnailUrl?: string;
  downloadable: boolean;
  status: 'pending' | 'published' | 'rejected';
  title?: string;
  description?: string;
  order: number;
  sermonDate?: string;
  createdAt: string;
}

interface AdminUserInfo {
  id?: string;
  username: string;
  displayName?: string;
  isSuper: boolean;
  canUpload: boolean;
  canPublish: boolean;
  canEdit: boolean;
}

interface SubAdminRow {
  id: string;
  username: string;
  displayName?: string;
  isSuper: boolean;
  canUpload: boolean;
  canPublish: boolean;
  canEdit: boolean;
  active: boolean;
}

type TabKey = 'gallery' | 'leader' | 'sermon_video' | 'sermon_audio' | 'book' | 'other' | 'settings';

const TABS: { key: TabKey; label: string; icon: typeof ImageIcon; aspect?: number }[] = [
  { key: 'gallery', label: 'Gallery', icon: ImageIcon, aspect: 1 },
  { key: 'leader', label: 'Leader Photo', icon: UserSquare2, aspect: 4 / 5 },
  { key: 'sermon_video', label: 'Video Sermons', icon: Video },
  { key: 'sermon_audio', label: 'Audio Messages', icon: Headphones },
  { key: 'book', label: 'Books & Tracts', icon: BookOpen },
  { key: 'other', label: 'Other', icon: FolderOpen, aspect: 1 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

const STATUS_STYLES: Record<MediaItem['status'], string> = {
  pending: 'bg-admin-gold/15 text-admin-goldHover border-admin-gold/30',
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

/** POST a FormData payload with real upload-progress events (fetch can't do this reliably). */
function uploadWithProgress(
  url: string,
  form: FormData,
  headers: Record<string, string>,
  onProgress: (pct: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(xhr.responseText ? JSON.parse(xhr.responseText) : null);
        } catch {
          resolve(null);
        }
      } else {
        let message = 'Upload failed';
        try {
          message = JSON.parse(xhr.responseText)?.error || message;
        } catch {
          /* ignore */
        }
        reject(new Error(message));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

export default function AdminPage() {
  const { notify, confirmAction, FeedbackHost } = useGlassFeedback();

  const [token, setToken] = useState(localStorage.getItem('gpcm_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sermonDate, setSermonDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookDownloadable, setBookDownloadable] = useState(true);
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [bookPriority, setBookPriority] = useState('10');
  const [galleryView, setGalleryView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [gallerySort, setGallerySort] = useState<'priority' | 'newest' | 'oldest' | 'name'>('priority');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const bookCoverRef = useRef<HTMLInputElement>(null);
  const [adminUser, setAdminUser] = useState<AdminUserInfo | null>(() => {
    try {
      const raw = localStorage.getItem('gpcm_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [subAdmins, setSubAdmins] = useState<SubAdminRow[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    displayName: '',
    canUpload: true,
    canPublish: false,
    canEdit: false,
  });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<TabKey>('gallery');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // upload progress overlay state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'uploading' | 'processing' | 'done'>('uploading');
  const [uploadFileName, setUploadFileName] = useState('');

  // image crop flow
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [cropTargetCategory, setCropTargetCategory] = useState<TabKey>('gallery');

  // video sermon: file vs youtube
  const [videoMode, setVideoMode] = useState<'upload' | 'youtube'>('youtube');
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [ytThumbUrl, setYtThumbUrl] = useState('');
  const [ytThumbFile, setYtThumbFile] = useState<File | null>(null);

  // audio
  const [audioTitle, setAudioTitle] = useState('');
  const [audioDownloadable, setAudioDownloadable] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);
  const ytThumbRef = useRef<HTMLInputElement>(null);

  const headers = { 'x-admin-token': token };

  const fetchMedia = async (category: TabKey) => {
    if (category === 'settings') return;
    setLoadingList(true);
    const res = await fetch(`/api/admin/media?category=${category}`, { headers });
    if (res.ok) {
      setMedia(await res.json());
    } else if (res.status === 401) {
      setToken('');
      setAdminUser(null);
      localStorage.removeItem('gpcm_admin_token');
      localStorage.removeItem('gpcm_admin_user');
    }
    setLoadingList(false);
  };

  useEffect(() => {
    if (!token) return;
    if (tab === 'settings') {
      if (adminUser?.isSuper !== false) fetchUsers();
    } else {
      fetchMedia(tab);
    }
  }, [token, tab]);

  const login = async () => {
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, username: username.trim() || undefined }),
    });
    if (res.ok) {
      const body = await res.json();
      setToken(body.token);
      localStorage.setItem('gpcm_admin_token', body.token);
      if (body.user) {
        setAdminUser(body.user);
        localStorage.setItem('gpcm_admin_user', JSON.stringify(body.user));
      }
    } else {
      const body = await res.json().catch(() => ({}));
      setLoginError(body.error || 'Wrong password');
    }
  };

  const logout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem('gpcm_admin_token');
    localStorage.removeItem('gpcm_admin_user');
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users', { headers });
    if (res.ok) setSubAdmins(await res.json());
    else if (res.status === 403) setSubAdmins([]);
  };

  const createSubAdmin = async () => {
    if (!newUser.username || !newUser.password) return notify('Username and password required', 'error');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      notify('Sub-admin created', 'success');
      setNewUser({ username: '', password: '', displayName: '', canUpload: true, canPublish: false, canEdit: false });
      fetchUsers();
    } else {
      const err = await res.json().catch(() => ({}));
      notify(err.error || 'Failed to create', 'error');
    }
  };

  const patchSubAdmin = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    });
    if (res.ok) {
      notify('Updated', 'success');
      fetchUsers();
    } else {
      const err = await res.json().catch(() => ({}));
      notify(err.error || 'Update failed', 'error');
    }
  };

  const deleteSubAdmin = async (id: string) => {
    const ok = await confirmAction({
      title: 'Remove sub-admin?',
      message: 'They will no longer be able to log in.',
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
    notify(res.ok ? 'Removed' : 'Failed', res.ok ? 'success' : 'error');
    fetchUsers();
  };

  const changePassword = async () => {
    if (pwForm.next !== pwForm.confirm) return notify('New passwords do not match', 'error');
    if (pwForm.next.length < 6) return notify('Password must be at least 6 characters', 'error');
    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      if (body.token) {
        setToken(body.token);
        localStorage.setItem('gpcm_admin_token', body.token);
      }
      setPwForm({ current: '', next: '', confirm: '' });
      notify('Password changed', 'success');
    } else {
      notify(body.error || 'Could not change password', 'error');
    }
  };

  // ---------- image upload (with crop) ----------
  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const activeTab = TABS.find((t) => t.key === tab)!;
    setCropFile(file);
    setCropAspect(activeTab.aspect || 1);
    setCropTargetCategory(tab);
  };

  const uploadFile = async (file: File | Blob, filename: string, category: string, extra?: Record<string, string>) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadPhase('uploading');
    setUploadFileName(filename);

    const form = new FormData();
    form.append('file', file, filename);
    form.append('category', category);
    if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, v));

    try {
      await uploadWithProgress('/api/admin/upload', form, headers, setUploadProgress);
      setUploadPhase('processing');
      await fetchMedia(tab);
      setUploadPhase('done');
      notify('Uploaded! Tap “Publish” below to make it live on the site.', 'success');
      await new Promise((r) => setTimeout(r, 850));
    } catch (err: any) {
      notify(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onCropConfirm = async (blob: Blob) => {
    const name = (cropFile?.name || 'image').replace(/\.\w+$/, '.jpg');
    setCropFile(null);
    await uploadFile(blob, name, cropTargetCategory);
    if (fileRef.current) fileRef.current.value = '';
  };

  // ---------- video sermon: file upload ----------
  const onPickVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file, file.name, 'sermon_video', { sermonDate });
    if (fileRef.current) fileRef.current.value = '';
  };

  // ---------- video sermon: youtube link ----------
  const submitYoutube = async () => {
    if (!ytUrl.trim()) return notify('Paste a YouTube link first', 'error');
    setUploading(true);
    setUploadPhase('uploading');
    setUploadProgress(0);
    setUploadFileName(ytTitle.trim() || 'YouTube video');

    let thumbnailUrl = ytThumbUrl.trim();
    try {
      if (ytThumbFile) {
        const f = new FormData();
        f.append('file', ytThumbFile);
        const res = await uploadWithProgress('/api/admin/upload-thumbnail', f, headers, setUploadProgress);
        thumbnailUrl = res?.url || thumbnailUrl;
      } else {
        setUploadProgress(60);
      }

      setUploadPhase('processing');
      const res = await fetch('/api/admin/youtube', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: ytUrl.trim(), title: ytTitle.trim() || undefined, thumbnailUrl: thumbnailUrl || undefined, sermonDate: sermonDate || undefined }),
      });

      if (res.ok) {
        setYtUrl('');
        setYtTitle('');
        setYtThumbUrl('');
        setYtThumbFile(null);
        if (ytThumbRef.current) ytThumbRef.current.value = '';
        await fetchMedia(tab);
        setUploadPhase('done');
        notify('YouTube video added! Tap “Publish” to make it live.', 'success');
        await new Promise((r) => setTimeout(r, 850));
      } else {
        const err = await res.json().catch(() => ({}));
        notify(err.error || 'Could not add YouTube video', 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Thumbnail upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ---------- audio upload ----------
  const onPickAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Vercel serverless request body limit ~4.5MB on Hobby — warn early
    const maxMb = 4.2;
    if (file.size > maxMb * 1024 * 1024) {
      notify(
        `Audio is ${(file.size / 1024 / 1024).toFixed(1)}MB. Keep under ~${maxMb}MB for upload on this host (compress the MP3 or use a shorter clip).`,
        'error'
      );
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    const name = file.name.includes('.') ? file.name : `${file.name || 'audio'}.mp3`;
    await uploadFile(file, name, 'sermon_audio', {
      title: audioTitle.trim() || name,
      downloadable: String(audioDownloadable),
      sermonDate,
    });
    setAudioTitle('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ---------- shared actions ----------
  const setStatus = async (item: MediaItem, status: MediaItem['status']) => {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(status === 'published' ? 'Published — now live on the site.' : 'Marked as rejected.', 'success');
    } else {
      notify('Could not update status', 'error');
    }
    fetchMedia(tab);
  };

  const setPriority = async (item: MediaItem, order: number) => {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (res.ok) notify(`Priority set to ${order} (lower = shows first)`, 'success');
    else notify('Could not update priority', 'error');
    fetchMedia(tab);
  };

  const setCoverOnItem = async (item: MediaItem, file: File) => {
    try {
      const form = new FormData();
      form.append('file', file);
      const up = await uploadWithProgress('/api/admin/upload-thumbnail', form, headers, () => {});
      const url = up?.url;
      if (!url) throw new Error('No cover URL');
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ thumbnailUrl: url }),
      });
      if (res.ok) notify('Cover updated', 'success');
      else notify('Cover save failed', 'error');
      fetchMedia(tab);
    } catch (e: any) {
      notify(e.message || 'Cover upload failed', 'error');
    }
  };

  const deleteItem = async (id: string) => {
    const ok = await confirmAction({
      title: 'Delete permanently?',
      message: 'This removes the file and its record for good. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE', headers });
    notify(res.ok ? 'Deleted.' : 'Delete failed', res.ok ? 'success' : 'error');
    fetchMedia(tab);
  };

  // ---------- Login screen ----------
  if (!token) {
    return (
      <>
        <AdminLogin
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          loginError={loginError}
          onLogin={login}
        />
        <FeedbackHost />
      </>
    );
  }

  const activeTab = TABS.find((t) => t.key === tab)!;

  // ---------- Dashboard ----------
  return (
    <div className="min-h-screen bg-admin-milkSoft">
      <AdminNav title="GPCM Media Admin" tabs={TABS} activeTab={tab} onTabChange={(k) => setTab(k as TabKey)} onLogout={logout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Upload panel — changes shape per tab */}
        <div className="bg-white rounded-3xl border border-admin-purple/10 p-5 sm:p-8 mb-6 sm:mb-10 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-admin-purple mb-4">
            {tab === 'sermon_video' ? 'Add a Video Sermon' : tab === 'sermon_audio' ? 'Add an Audio Message' : tab === 'book' ? 'Upload Book / Tract (PDF)' : tab === 'settings' ? 'Admin settings' : `Upload to ${activeTab.label}`}
          </h2>

          {/* Image tabs */}
          {(tab === 'gallery' || tab === 'leader' || tab === 'other') && (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-admin-purple/20 hover:border-admin-gold rounded-2xl p-8 text-center transition-colors">
                <Upload className="mx-auto mb-2 text-admin-purple/40" size={28} />
                <p className="text-sm text-admin-purple/70">
                  {uploading ? 'Uploading…' : 'Tap to choose a JPG, PNG, or WEBP — you\u2019ll crop it before it publishes'}
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={onPickImage}
                disabled={uploading}
              />
            </label>
          )}

          {/* Video sermons */}
          {tab === 'sermon_video' && (
            <div>
              <label className="block text-xs font-medium text-admin-purple/60 mb-1">Sermon date (newest first on site)</label>
              <input type="date" value={sermonDate} onChange={(e) => setSermonDate(e.target.value)} className="mb-4 border border-admin-purple/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setVideoMode('youtube')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    videoMode === 'youtube' ? 'bg-admin-purple text-admin-milk border-admin-purple' : 'border-admin-purple/15 text-admin-purple/70'
                  }`}
                >
                  <Youtube size={15} /> YouTube link
                </button>
                <button
                  onClick={() => setVideoMode('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    videoMode === 'upload' ? 'bg-admin-purple text-admin-milk border-admin-purple' : 'border-admin-purple/15 text-admin-purple/70'
                  }`}
                >
                  <Film size={15} /> Upload file
                </button>
              </div>

              {videoMode === 'youtube' ? (
                <div className="space-y-3">
                  <input
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold"
                  />
                  <input
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    placeholder="Title (optional)"
                    className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold"
                  />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={ytThumbUrl}
                      onChange={(e) => setYtThumbUrl(e.target.value)}
                      placeholder="Custom thumbnail URL (optional)"
                      className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold"
                      disabled={!!ytThumbFile}
                    />
                    <label className="border border-dashed border-admin-purple/25 rounded-xl px-4 py-3 text-sm text-admin-purple/60 text-center cursor-pointer hover:border-admin-gold">
                      {ytThumbFile ? ytThumbFile.name : 'or upload a thumbnail image'}
                      <input
                        ref={ytThumbRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => setYtThumbFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-admin-purple/40">Leave the thumbnail blank to auto-use YouTube's own thumbnail.</p>
                  <button
                    onClick={submitYoutube}
                    disabled={uploading}
                    className="bg-admin-purple text-admin-milk px-6 py-3 rounded-xl font-semibold text-sm hover:bg-admin-purpleHover disabled:opacity-50 transition-colors"
                  >
                    {uploading ? 'Adding…' : 'Add Video Sermon'}
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-admin-purple/20 hover:border-admin-gold rounded-2xl p-8 text-center transition-colors">
                    <Upload className="mx-auto mb-2 text-admin-purple/40" size={28} />
                    <p className="text-sm text-admin-purple/70">{uploading ? 'Uploading…' : 'Tap to choose an MP4 or WEBM file'}</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".mp4,.webm"
                    className="hidden"
                    onChange={onPickVideoFile}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          )}

          {/* Audio messages */}
          {tab === 'sermon_audio' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-admin-purple/60">Sermon date</label>
              <input type="date" value={sermonDate} onChange={(e) => setSermonDate(e.target.value)} className="border border-admin-purple/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
              <input
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold"
              />
              <label className="flex items-center gap-2 text-sm text-admin-purple/70">
                <input
                  type="checkbox"
                  checked={audioDownloadable}
                  onChange={(e) => setAudioDownloadable(e.target.checked)}
                  className="accent-admin-gold"
                />
                Allow visitors to download this audio
              </label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-admin-purple/20 hover:border-admin-gold rounded-2xl p-8 text-center transition-colors">
                  <Upload className="mx-auto mb-2 text-admin-purple/40" size={28} />
                  <p className="text-sm text-admin-purple/70">{uploading ? 'Uploading…' : 'Tap to choose an MP3, M4A, or WAV file'}</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".mp3,.m4a,.wav,.aac,.ogg,audio/*"
                  className="hidden"
                  onChange={onPickAudio}
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {tab === 'book' && (
            <div className="space-y-3">
              <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Book / tract title (required for site display)" className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
              <textarea value={bookDesc} onChange={(e) => setBookDesc(e.target.value)} placeholder="Short description shown under the title" rows={2} className="w-full border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block text-xs text-admin-purple/60">
                  Priority (lower number = shows first)
                  <input type="number" min={0} value={bookPriority} onChange={(e) => setBookPriority(e.target.value)} className="mt-1 w-full border border-admin-purple/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                </label>
                <label className="flex items-center gap-2 text-sm text-admin-purple/70 self-end pb-2">
                  <input type="checkbox" checked={bookDownloadable} onChange={(e) => setBookDownloadable(e.target.checked)} className="accent-admin-gold" />
                  Allow PDF download
                </label>
              </div>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-admin-purple/20 hover:border-admin-gold rounded-2xl p-5 text-center transition-colors">
                  <p className="text-sm text-admin-purple/70 font-medium">Book cover image (JPG/PNG) — shows on site & reader</p>
                  <p className="text-xs text-admin-purple/40 mt-1">{bookCoverFile ? bookCoverFile.name : 'Tap to choose cover'}</p>
                </div>
                <input ref={bookCoverRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => setBookCoverFile(e.target.files?.[0] || null)} />
              </label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-admin-purple/20 hover:border-admin-gold rounded-2xl p-8 text-center transition-colors">
                  <BookOpen className="mx-auto mb-2 text-admin-purple/40" size={28} />
                  <p className="text-sm text-admin-purple/70">{uploading ? 'Uploading…' : 'Tap to choose the PDF file'}</p>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!bookTitle.trim()) {
                    notify('Add a book title first', 'error');
                    if (fileRef.current) fileRef.current.value = '';
                    return;
                  }
                  let thumbnailUrl = '';
                  try {
                    if (bookCoverFile) {
                      setUploading(true);
                      setUploadPhase('uploading');
                      setUploadFileName(bookCoverFile.name);
                      const f = new FormData();
                      f.append('file', bookCoverFile);
                      const up = await uploadWithProgress('/api/admin/upload-thumbnail', f, headers, setUploadProgress);
                      thumbnailUrl = up?.url || '';
                    }
                    await uploadFile(file, file.name, 'book', {
                      title: bookTitle.trim(),
                      description: bookDesc.trim(),
                      downloadable: String(bookDownloadable),
                      order: bookPriority || '10',
                      ...(thumbnailUrl ? { thumbnailUrl } : {}),
                    });
                    setBookTitle('');
                    setBookDesc('');
                    setBookCoverFile(null);
                    if (bookCoverRef.current) bookCoverRef.current.value = '';
                    if (fileRef.current) fileRef.current.value = '';
                  } catch (err: any) {
                    notify(err.message || 'Upload failed', 'error');
                    setUploading(false);
                  }
                }} disabled={uploading} />
              </label>
            </div>
          )}

          {tab === 'other' && (
            <p className="text-xs text-admin-purple/50 mb-3">Other is archive-only — not shown on public Gallery, Media, or Books sections.</p>
          )}

          {tab === 'settings' && (
            <div className="space-y-8">
              {adminUser && (
                <p className="text-sm text-admin-purple/60">
                  Signed in as <strong className="text-admin-purple">{adminUser.displayName || adminUser.username}</strong>
                  {adminUser.isSuper ? ' · Super admin' : ''}
                  {!adminUser.isSuper && (
                    <span className="ml-1">
                      ({[
                        adminUser.canUpload && 'upload',
                        adminUser.canPublish && 'publish',
                        adminUser.canEdit && 'edit',
                      ].filter(Boolean).join(', ') || 'no permissions'})
                    </span>
                  )}
                </p>
              )}

              <div>
                <h3 className="font-semibold text-admin-purple mb-2 flex items-center gap-2">
                  <KeyRound size={16} /> Change password
                </h3>
                <p className="text-xs text-admin-purple/50 mb-3">
                  Super Admin change password here.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 max-w-2xl">
                  <input type="password" placeholder="Current password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                  <input type="password" placeholder="New password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                  <input type="password" placeholder="Confirm new" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                </div>
                <button type="button" onClick={changePassword} className="mt-3 bg-admin-purple text-admin-milk px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-admin-purpleHover">
                  Update password
                </button>
              </div>

              {(adminUser?.isSuper !== false) && (
                <div>
                  <h3 className="font-semibold text-admin-purple mb-2 flex items-center gap-2">
                    <UserPlus size={16} /> Sub-admins
                  </h3>
                  <p className="text-xs text-admin-purple/50 mb-3">
                    Permissions: upload, publish, edit/delete.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3 max-w-2xl">
                    <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                    <input placeholder="Display name" value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                    <input type="password" placeholder="Password (min 6)" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="border border-admin-purple/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-admin-gold" />
                    <div className="flex flex-wrap items-center gap-4 text-sm text-admin-purple/70">
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newUser.canUpload} onChange={(e) => setNewUser({ ...newUser, canUpload: e.target.checked })} className="accent-admin-gold" /> Upload</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newUser.canPublish} onChange={(e) => setNewUser({ ...newUser, canPublish: e.target.checked })} className="accent-admin-gold" /> Publish</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newUser.canEdit} onChange={(e) => setNewUser({ ...newUser, canEdit: e.target.checked })} className="accent-admin-gold" /> Edit</label>
                    </div>
                  </div>
                  <button type="button" onClick={createSubAdmin} className="bg-admin-purple text-admin-milk px-5 py-2.5 rounded-xl text-sm font-semibold mb-5">
                    Create sub-admin
                  </button>

                  <div className="space-y-3">
                    {subAdmins.length === 0 && (
                      <p className="text-sm text-admin-purple/40">No subadmin added. </p>
                    )}
                    {subAdmins.map((u) => (
                      <div key={u.id} className="border border-admin-purple/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        <div>
                          <p className="font-medium text-admin-purple">{u.displayName || u.username}</p>
                          <p className="text-xs text-admin-purple/50">@{u.username}{u.isSuper ? ' · super' : ''}{!u.active ? ' · inactive' : ''}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs items-center">
                          <label className="flex items-center gap-1 px-2 py-1 rounded-lg bg-admin-milkSoft">
                            <input type="checkbox" checked={u.canUpload} onChange={(e) => patchSubAdmin(u.id, { canUpload: e.target.checked })} className="accent-admin-gold" /> Upload
                          </label>
                          <label className="flex items-center gap-1 px-2 py-1 rounded-lg bg-admin-milkSoft">
                            <input type="checkbox" checked={u.canPublish} onChange={(e) => patchSubAdmin(u.id, { canPublish: e.target.checked })} className="accent-admin-gold" /> Publish
                          </label>
                          <label className="flex items-center gap-1 px-2 py-1 rounded-lg bg-admin-milkSoft">
                            <input type="checkbox" checked={u.canEdit} onChange={(e) => patchSubAdmin(u.id, { canEdit: e.target.checked })} className="accent-admin-gold" /> Edit
                          </label>
                          <button type="button" onClick={() => deleteSubAdmin(u.id)} className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media list for this tab */}
        {tab === 'gallery' && !loadingList && (
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="text-admin-purple/50">View:</span>
            {(['grid', 'list', 'compact'] as const).map((v) => (
              <button key={v} type="button" onClick={() => setGalleryView(v)} className={`px-3 py-1.5 rounded-lg capitalize ${galleryView === v ? 'bg-admin-purple text-admin-milk' : 'bg-white border border-admin-purple/15 text-admin-purple/70'}`}>{v}</button>
            ))}
            <span className="text-admin-purple/50 ml-2">Sort:</span>
            <select value={gallerySort} onChange={(e) => setGallerySort(e.target.value as typeof gallerySort)} className="border border-admin-purple/15 rounded-lg px-2 py-1.5 bg-white">
              <option value="priority">Priority (landing order)</option>
              <option value="newest">Newest uploaded</option>
              <option value="oldest">Oldest uploaded</option>
              <option value="name">Name / title</option>
            </select>
            <span className="text-xs text-admin-purple/40 w-full sm:w-auto">Priority 0–3 recommended for the 4 homepage images.</span>
          </div>
        )}

        {tab === 'settings' ? null : loadingList ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl skeleton-preload" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <p className="text-center text-admin-purple/40 text-sm py-10">Nothing in {activeTab.label} yet.</p>
        ) : (() => {
          const sorted = [...media].sort((a, b) => {
            if (tab === 'gallery' || tab === 'book') {
              if (gallerySort === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
              if (gallerySort === 'oldest') return (a.createdAt || '').localeCompare(b.createdAt || '');
              if (gallerySort === 'name') return (a.title || a.originalName || '').localeCompare(b.title || b.originalName || '');
              return (a.order ?? 999) - (b.order ?? 999);
            }
            return (b.createdAt || '').localeCompare(a.createdAt || '');
          });

          const isGalleryList = tab === 'gallery' && galleryView === 'list';
          const isGalleryCompact = tab === 'gallery' && galleryView === 'compact';

          if (isGalleryList) {
            return (
              <div className="bg-white rounded-2xl border border-admin-purple/10 overflow-hidden divide-y divide-admin-purple/10">
                {sorted.map((item) => {
                  const open = expandedId === item.id;
                  return (
                    <div key={item.id} className="text-left">
                      <button
                        type="button"
                        onClick={() => setExpandedId(open ? null : item.id)}
                        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-admin-milkSoft/80 transition-colors"
                      >
                        <img src={item.url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-admin-milkSoft" />
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-sm font-medium text-admin-purple truncate">{item.title || item.originalName}</p>
                          <p className="text-[11px] text-admin-purple/45 truncate">
                            {fmtDate(item.createdAt)} · priority {item.order ?? '—'} · <span className="capitalize">{item.status}</span>
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize shrink-0 ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                        {open ? <ChevronDown size={16} className="text-admin-purple/40 shrink-0" /> : <ChevronRight size={16} className="text-admin-purple/40 shrink-0" />}
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-1 bg-admin-milkSoft/40 space-y-3 border-t border-admin-purple/5">
                          <div className="flex gap-3">
                            <img src={item.url} alt="" className="w-28 h-28 rounded-xl object-cover" />
                            <div className="flex-1 space-y-2 min-w-0">
                              <p className="text-xs text-admin-purple/60 break-all">{item.url}</p>
                              <label className="block text-xs text-admin-purple/60">
                                Priority (0 = top on homepage)
                                <input type="number" min={0} defaultValue={item.order ?? 10} key={`${item.id}-p-${item.order}`}
                                  onBlur={(e) => { const n = parseInt(e.target.value, 10); if (Number.isFinite(n) && n !== item.order) setPriority(item, n); }}
                                  className="mt-1 w-full max-w-[8rem] border border-admin-purple/15 rounded-lg px-2 py-1.5 text-sm bg-white" />
                              </label>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.status !== 'published' && (
                              <button type="button" onClick={() => setStatus(item, 'published')} className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700"><Check size={14} /> Publish</button>
                            )}
                            {item.status !== 'rejected' && (
                              <button type="button" onClick={() => setStatus(item, 'rejected')} className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl bg-rose-50 text-rose-700"><XCircle size={14} /> Reject</button>
                            )}
                            <button type="button" onClick={() => deleteItem(item.id)} className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl bg-white text-admin-purple/60 border border-admin-purple/10"><Trash2 size={14} /> Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          if (isGalleryCompact) {
            return (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {sorted.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-admin-purple/10 overflow-hidden group relative">
                    <div className="aspect-square bg-admin-milkSoft relative">
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                      <span className={`absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded-full border capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] text-admin-purple/70 truncate leading-tight">{item.title || item.originalName}</p>
                      <p className="text-[9px] text-admin-purple/40">#{item.order ?? '—'}</p>
                      <div className="flex gap-1 mt-1">
                        {item.status !== 'published' && (
                          <button type="button" onClick={() => setStatus(item, 'published')} className="flex-1 text-[10px] py-1 rounded-md bg-emerald-50 text-emerald-700">Pub</button>
                        )}
                        <button type="button" onClick={() => deleteItem(item.id)} className="px-1.5 text-[10px] py-1 rounded-md bg-admin-milkSoft text-admin-purple/50"><Trash2 size={10} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sorted.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-admin-purple/10 overflow-hidden shadow-sm">
                  <div className="aspect-video bg-admin-milkSoft relative">
                    {item.type === 'video' && item.source === 'youtube' ? (
                      <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" muted />
                    ) : item.type === 'audio' ? (
                      <div className="w-full h-full flex items-center justify-center bg-admin-purple">
                        <Headphones size={32} className="text-admin-gold" />
                      </div>
                    ) : item.type === 'document' ? (
                      item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-violet-50">
                          <BookOpen size={32} className="text-admin-purple" />
                        </div>
                      )
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 left-3 bg-admin-purple/70 backdrop-blur-sm text-admin-milk text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {item.source === 'youtube' ? <Youtube size={12} /> : item.type === 'video' ? <Video size={12} /> : item.type === 'audio' ? <Headphones size={12} /> : <ImageIcon size={12} />}
                      {item.source === 'youtube' ? 'YouTube' : item.type}
                    </div>
                    <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full border font-medium capitalize ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm font-medium truncate text-admin-purple">{item.title || item.originalName}</p>
                    <p className="flex items-center gap-1 text-xs text-admin-purple/40">
                      <Clock size={12} /> {fmtDate(item.createdAt)} · priority {item.order ?? '—'}
                    </p>
                    {(tab === 'gallery' || tab === 'book') && (
                      <label className="block text-xs text-admin-purple/60">
                        Priority (0 = top on site)
                        <input type="number" min={0} defaultValue={item.order ?? 10} key={`${item.id}-${item.order}`}
                          onBlur={(e) => { const n = parseInt(e.target.value, 10); if (Number.isFinite(n) && n !== item.order) setPriority(item, n); }}
                          className="mt-1 w-full border border-admin-purple/15 rounded-lg px-2 py-1.5 text-sm" />
                      </label>
                    )}
                    {tab === 'book' && (
                      <label className="block text-xs text-admin-purple/60 cursor-pointer">
                        {item.thumbnailUrl ? 'Replace cover image' : 'Add cover image'}
                        <input type="file" accept=".jpg,.jpeg,.png,.webp" className="mt-1 block w-full text-xs"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverOnItem(item, f); }} />
                        {item.thumbnailUrl && (
                          <img src={item.thumbnailUrl} alt="" className="mt-2 h-20 w-14 object-cover rounded-lg border" />
                        )}
                      </label>
                    )}
                    {item.type === 'audio' && <audio controls src={item.url} className="w-full h-8" preload="none" />}
                    <div className="flex gap-2">
                      {item.status !== 'published' && (
                        <button onClick={() => setStatus(item, 'published')} className="flex-1 flex items-center justify-center gap-1 text-sm py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                          <Check size={14} /> Publish
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button onClick={() => setStatus(item, 'rejected')} className="flex-1 flex items-center justify-center gap-1 text-sm py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors">
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="w-full flex items-center justify-center gap-1 text-sm py-2.5 rounded-xl bg-admin-milkSoft text-admin-purple/50 hover:bg-admin-purple/10 hover:text-admin-purple transition-colors">
                      <Trash2 size={14} /> Delete permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </main>

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspect={cropAspect}
          label={`Crop for ${TABS.find((t) => t.key === cropTargetCategory)?.label}`}
          onCancel={() => {
            setCropFile(null);
            if (fileRef.current) fileRef.current.value = '';
          }}
          onConfirm={onCropConfirm}
        />
      )}

      {uploading && (
        <UploadProgressOverlay progress={uploadProgress} fileName={uploadFileName} phase={uploadPhase} />
      )}

      <FeedbackHost />
    </div>
  );
}
