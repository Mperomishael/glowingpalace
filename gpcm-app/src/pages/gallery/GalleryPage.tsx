import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia } from '../../hooks/useMedia';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

export default function GalleryPage() {
  const { media, loading } = useMedia('gallery');
  const reveal = useScrollReveal(media.length || 8);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-20">
        <section className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <i className="fa-solid fa-images text-[10px]" />
                GALLERY
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04]">
                Moments in God&apos;s Presence
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80 max-w-2xl mx-auto">
                Captured moments of worship, fellowship, and transformation.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl sm:rounded-2xl bg-[#D9C4AA]/40 animate-pulse" />
                ))}
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#321C04]/70 text-sm mb-4">No gallery images yet.</p>
                <p className="text-xs text-[#321C04]/50">
                  Upload images under category <strong>gallery</strong> in Admin.
                </p>
              </div>
            ) : (
              <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {media.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item.url)}
                    className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group border border-[#D9C4AA] fall-item ${reveal.visible ? 'is-in' : 'is-out'}`}
                    style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, media.length)}ms` }}
                  >
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        muted
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-800"
              >
                <i className="fa-solid fa-arrow-left text-xs" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-3"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-9 right-0 text-white p-1.5"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full rounded-xl sm:rounded-2xl shadow-2xl max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
