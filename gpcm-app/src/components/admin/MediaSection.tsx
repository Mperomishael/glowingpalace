import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Headphones, Download, X, Maximize2, ArrowRight, Calendar } from 'lucide-react';
import { useMedia, formatSermonDate } from '../hooks/useMedia';

function youtubeEmbedUrl(youtubeUrl?: string) {
  if (!youtubeUrl) return '';
  const match = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  const id = match?.[1];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&fs=1&rel=0` : '';
}

export default function MediaSection() {
  const { media: videos, loading: loadingV } = useMedia('sermon_video', 6);
  const { media: audios, loading: loadingA } = useMedia('sermon_audio', 4);
  const loading = loadingV || loadingA;
  const [playing, setPlaying] = useState<{ url: string; isYoutube: boolean; title?: string } | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || !playerRef.current) return;
    const el = playerRef.current;
    const goFs = async () => {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
      } catch {
        /* browser may block without gesture chain — modal still works */
      }
    };
    const t = setTimeout(goFs, 150);
    return () => clearTimeout(t);
  }, [playing]);

  const exitFs = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setPlaying(null);
  };

  return (
    <section id="media" className="py-10 sm:py-14 md:py-16 bg-zinc-900 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-amber-300 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-2 sm:mb-3">
            <Play size={12} />
            WATCH &amp; LISTEN
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            Latest Sermons &amp; Gospel Audio
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-lg mx-auto">
            Messages by Bishop Dr. Ilaya O. Clement — newest first. Stream or download and be strengthened in the Word.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl skeleton-preload-dark" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300 uppercase tracking-wide">
                  <Play size={16} /> Recent Videos
                </h3>
                <Link
                  to="/sermons"
                  className="text-xs sm:text-sm text-zinc-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
                >
                  See all <ArrowRight size={14} />
                </Link>
              </div>
              {videos.length === 0 ? (
                <p className="text-zinc-500 text-sm">Videos will appear here once published from Admin.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((item) => {
                    const isYoutube = item.source === 'youtube';
                    const thumb = isYoutube ? item.thumbnailUrl : item.url;
                    const dateLabel = formatSermonDate(item);
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
                        className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="aspect-video bg-zinc-800 relative">
                          {isYoutube ? (
                            <img src={thumb} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                              muted
                              preload="metadata"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center shadow-lg">
                              <Play size={20} fill="currentColor" />
                            </span>
                          </div>
                          {dateLabel && (
                            <span className="absolute top-2 left-2 text-[10px] sm:text-xs bg-black/70 text-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Calendar size={10} /> {dateLabel}
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white/80 px-1.5 py-0.5 rounded flex items-center gap-0.5">
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

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300 uppercase tracking-wide">
                  <Headphones size={16} /> Recent Audio
                </h3>
                <Link
                  to="/audios"
                  className="text-xs sm:text-sm text-zinc-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
                >
                  See all <ArrowRight size={14} />
                </Link>
              </div>
              {audios.length === 0 ? (
                <p className="text-zinc-500 text-sm">Audio messages will appear here once published from Admin.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {audios.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/30 text-violet-200 flex items-center justify-center shrink-0">
                          <Headphones size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title || item.originalName}</p>
                          {formatSermonDate(item) && (
                            <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Calendar size={10} /> {formatSermonDate(item)}
                            </p>
                          )}
                        </div>
                        {item.downloadable && (
                          <a
                            href={item.url}
                            download={item.originalName}
                            className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                      <audio controls className="w-full h-9" preload="none" src={item.url}>
                        Your browser does not support audio.
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {playing && (
        <div
          className="fixed inset-0 bg-black z-[200] flex items-center justify-center"
          onClick={exitFs}
        >
          <div
            ref={playerRef}
            className="relative w-full h-full max-w-[100vw] max-h-[100vh] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={exitFs}
              className="absolute top-3 right-3 z-10 text-white p-2 rounded-full bg-black/50 hover:bg-black/80"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {playing.isYoutube ? (
              <iframe
                src={youtubeEmbedUrl(playing.url)}
                title={playing.title || 'Sermon video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video src={playing.url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
