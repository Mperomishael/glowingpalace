import { Link } from 'react-router-dom';
import { BookOpen, Download, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia } from '../../hooks/useMedia';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

export default function BooksPage() {
  const { media: books, loading } = useMedia('book');
  const reveal = useScrollReveal(books.length || 6);

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-5">
          <Link to="/#books" className="inline-flex items-center gap-1 text-sm text-violet-700 mb-6 hover:underline">
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Books &amp; Tracts</h1>
          <p className="text-zinc-500 text-sm mb-8">Read online or download PDFs from the Worshipers Library.</p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl skeleton-preload" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <p className="text-zinc-500">No published books yet.</p>
          ) : (
            <div ref={reveal.containerRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {books.map((item, idx) => {
                const cover = item.thumbnailUrl;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden flex flex-col hover:shadow-md fall-item ${reveal.visible ? 'is-in' : 'is-out'}`}
                    style={{ transitionDelay: `${staggerDelay(idx, reveal.visible, books.length)}ms` }}
                  >
                    <Link to={`/books/${item.id}`} className="aspect-[3/4] bg-gradient-to-br from-violet-100 to-amber-50 relative block">
                      {cover ? (
                        <img
                          src={cover}
                          alt={item.title || item.originalName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <BookOpen className="text-violet-400 mb-2" size={40} />
                          <span className="text-xs font-medium text-violet-700 line-clamp-3">
                            {item.title || item.originalName}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h2 className="font-serif font-semibold text-zinc-900 text-sm sm:text-base line-clamp-2">
                        {item.title || item.originalName}
                      </h2>
                      {item.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-3 flex-1">{item.description}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/books/${item.id}`}
                          className="flex-1 text-center text-sm font-semibold py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
                        >
                          Read
                        </Link>
                        {item.downloadable !== false && (
                          <a
                            href={item.url}
                            download={item.originalName || 'book.pdf'}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          >
                            <Download size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
