import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia, MediaItem } from '../../hooks/useMedia';

export default function BookReaderPage() {
  const { id } = useParams<{ id: string }>();
  const { media, loading } = useMedia('book');
  const [book, setBook] = useState<MediaItem | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    if (!loading && id) {
      setBook(media.find((m) => m.id === id) || null);
      setShowPdf(false);
    }
  }, [media, loading, id]);

  const cover = book?.thumbnailUrl;

  return (
    <div className="tail-container bg-zinc-100 text-zinc-900 min-h-screen flex flex-col">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-20 flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/books" className="inline-flex items-center gap-1 text-sm text-violet-700 hover:underline">
            <ArrowLeft size={14} /> All books
          </Link>
          {book && (
            <div className="flex items-center gap-3">
              <h1 className="text-sm sm:text-base font-semibold truncate max-w-[40vw]">
                {book.title || book.originalName}
              </h1>
              {book.downloadable !== false && (
                <a
                  href={book.url}
                  download={book.originalName || 'book.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700"
                >
                  <Download size={14} /> Download
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-5 pb-8">
          {loading ? (
            <div className="h-[70vh] rounded-xl skeleton-preload" />
          ) : !book ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto text-zinc-300 mb-3" size={40} />
              <p className="text-zinc-500 mb-4">This book was not found or is not published.</p>
              <Link to="/books" className="text-violet-700 font-medium hover:underline">
                Back to library
              </Link>
            </div>
          ) : !showPdf ? (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden max-w-lg mx-auto">
              <div className="aspect-[3/4] bg-gradient-to-br from-violet-100 to-amber-50 relative">
                {cover ? (
                  <img
                    src={cover}
                    alt={book.title || book.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <BookOpen className="text-violet-400 mb-4" size={56} />
                    <p className="font-serif text-xl font-bold text-violet-900">
                      {book.title || book.originalName}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-2">
                  {book.title || book.originalName}
                </h2>
                {book.description && (
                  <p className="text-sm text-zinc-600 mb-6 leading-relaxed">{book.description}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPdf(true)}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  Open book to read
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden h-[75vh] min-h-[480px]">
              <iframe
                src={`${book.url}#view=FitH`}
                title={book.title || book.originalName}
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
