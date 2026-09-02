import { Link } from "@tanstack/react-router";
import { BookOpen, ArrowRight } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useScrollReveal, staggerDelay } from "../hooks/useScrollReveal";

export default function BooksSection() {
  const { media: books, loading } = useMedia("book", 4);
  const reveal = useScrollReveal(books.length || 4);

  return (
    <section id="books" className="py-10 sm:py-14 md:py-16 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-2">
              <BookOpen size={12} />
              BOOKS & TRACTS
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 leading-snug">
              Church Library
            </h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-lg">
              Read ministry books and tracts online — or download the PDF to study offline.
            </p>
          </div>
          <Link
            to="/books"
            className="text-sm text-violet-700 hover:text-violet-900 font-medium inline-flex items-center gap-1"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] skeleton-preload" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-zinc-500 text-sm">Books and tracts will appear here once published from Admin.</p>
        ) : (
          <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {books.map((item, idx) => {
              const cover = item.thumbnailUrl;
              return (
                <Link
                  key={item.id}
                  to="/books/$id"
                  params={{ id: item.id }}
                  className={`group rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden hover:border-violet-200 hover:shadow-md flex flex-col fall-item ${reveal.visible ? "is-in" : "is-out"}`}
                  style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, books.length)}ms` }}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-violet-100 to-amber-50 relative overflow-hidden">
                    {cover ? (
                      <img
                        src={cover}
                        alt={item.title || item.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="text-violet-400 mb-2" size={36} />
                        <span className="text-xs font-medium text-violet-700 line-clamp-3">
                          {item.title || item.originalName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <h3 className="font-serif font-semibold text-zinc-900 text-sm sm:text-base leading-snug line-clamp-2">
                      {item.title || item.originalName}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 flex-1">{item.description}</p>
                    )}
                    <span className="mt-3 text-xs font-semibold text-violet-700 group-hover:underline">
                      Read book →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}