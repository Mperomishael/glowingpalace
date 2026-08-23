import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, X, Calendar, ArrowLeft, Maximize2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia, formatSermonDate } from '../../hooks/useMedia';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

function youtubeEmbedUrl(youtubeUrl?: string) {
  if (!youtubeUrl) return '';
  const match = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  const id = match?.[1];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&fs=1&rel=0` : '';
}

export default function SermonsPage() {
  const { media: videos, loading } = useMedia('sermon_video');
  const reveal = useScrollReveal(videos.length || 6);
  const [playing, setPlaying] = useState<{ url: string; isYoutube: boolean; title?: string } | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || !playerRef.current) return;
    const el = playerRef.current;
    const t = setTimeout(() => {
      try {
        if (el.requestFullscreen) el.requestFullscreen();
      } catch { /* ignore */ }
    }, 150);
    return () => clearTimeout(t);
  }, [playing]);

  const exitFs = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setPlaying(null);
  };

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <Link to="/#media" className="inline-flex items-center gap-1 text-sm text-violet-700 mb-6 hover:underline">
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">All Sermon Videos</h1>
          <p className="text-zinc-500 text-sm mb-8">Newest first — stream any message in full screen.</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl skeleton-preload" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <p className="text-zinc-500">No published videos yet.</p>
          ) : (
            <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((item, idx) => {
                const isYoutube = item.source === 'youtube';
                const thumb = isYoutube ? item.thumbnailUrl : item.url;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setPlaying({
                        url: isYoutube ? item.youtubeUrl || item.url : item.url,
                        isYoutube,
                        title: item.title || item.originalName,
                      })
                    }
                    className={`group rounded-2xl overflow-hidden border border-zinc-200 bg-white text-left hover:shadow-md fall-item ${reveal.visible ? 'is-in' : 'is-out'}`}
                    style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, videos.length)}ms` }}
                  >
                    <div className="aspect-video bg-zinc-200 relative">
                      {isYoutube ? (
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
                          <Play size={20} fill="currentColor" />
                        </span>
                      </div>
                      {formatSermonDate(item) && (
                        <span className="absolute top-2 left-2 text-[10px] bg-black/70 text-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Calendar size={10} /> {formatSermonDate(item)}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                        <Maximize2 size={10} /> Full screen
                      </span>
                    </div>
                    <div className="p-3.5">
                      <p className="text-sm font-medium truncate">{item.title || item.originalName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {playing && (
        <div className="fixed inset-0 bg-black z-[200]" onClick={exitFs}>
          <div ref={playerRef} className="w-full h-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={exitFs} className="absolute top-3 right-3 z-10 text-white p-2 rounded-full bg-black/50" aria-label="Close">
              <X size={24} />
            </button>
            {playing.isYoutube ? (
              <iframe
                src={youtubeEmbedUrl(playing.url)}
                title={playing.title || 'Sermon'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video src={playing.url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
