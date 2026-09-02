import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useScrollReveal, staggerDelay } from "../hooks/useScrollReveal";

export default function GallerySection() {
  const { media, loading } = useMedia("gallery", 4);
  const reveal = useScrollReveal(media.length || 4);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-10 sm:py-14 md:py-16 bg-zinc-50 relative z-20 -mt-1 rounded-t-[1.75rem] sm:rounded-t-[2.5rem] shadow-[0_-24px_48px_rgba(0,0,0,0.28),0_-8px_16px_rgba(0,0,0,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-7 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 leading-snug">
            Moments in God's Presence
          </h2>
          <p className="mt-2 text-sm text-zinc-500">Glimpses of worship, fellowship, and ministry life.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl sm:rounded-2xl skeleton-preload" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <p className="text-center text-zinc-500 text-xs sm:text-sm">No gallery images yet.</p>
        ) : (
          <>
            <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {media.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item.url)}
                  className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group fall-item ${reveal.visible ? "is-in" : "is-out"}`}
                  style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, media.length)}ms` }}
                >
                  <img
                    src={item.url}
                    alt={item.title || item.originalName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-900 transition-colors"
              >
                View more photos <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
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
    </section>
  );
}
