import { Link } from 'react-router-dom';
import { Headphones, Download, Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia, formatSermonDate } from '../../hooks/useMedia';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

export default function AudiosPage() {
  const { media: audios, loading } = useMedia('sermon_audio');
  const reveal = useScrollReveal(audios.length || 4);

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-5">
          <Link to="/#media" className="inline-flex items-center gap-1 text-sm text-violet-700 mb-6 hover:underline">
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">All Gospel Audio</h1>
          <p className="text-zinc-500 text-sm mb-8">Newest first — listen or download.</p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl skeleton-preload" />
              ))}
            </div>
          ) : audios.length === 0 ? (
            <p className="text-zinc-500">No published audio yet.</p>
          ) : (
            <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="space-y-3">
              {audios.map((item, idx) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border border-zinc-200 bg-white p-4 flex flex-col gap-3 fall-item ${reveal.visible ? 'is-in' : 'is-out'}`}
                  style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, audios.length)}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
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
                        className="shrink-0 w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600"
                        title="Download"
                      >
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                  <audio controls className="w-full h-9" preload="none" src={item.url} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
