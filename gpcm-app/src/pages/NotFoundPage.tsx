import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const VERSES = [
  {
    ref: 'Isaiah 30:21',
    text: 'And your ears shall hear a word behind you, saying, “This is the way, walk in it,” when you turn to the right or when you turn to the left.',
  },
  {
    ref: 'Psalm 119:105',
    text: 'Your word is a lamp to my feet and a light to my path.',
  },
  {
    ref: 'Proverbs 3:5–6',
    text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
  },
];

const verse = VERSES[Math.floor(Math.random() * VERSES.length)];

export default function NotFoundPage() {
  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-24 pb-16 min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="relative inline-block mb-8">
            <span
              className="font-serif text-[7rem] sm:text-[9rem] font-bold leading-none text-violet-200 select-none animate-pulse"
              aria-hidden
            >
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
            This path was not found
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base mb-8">
            The page you requested does not exist — or could not be loaded. You are still welcome here.
          </p>

          <blockquote className="bg-white border border-violet-100 rounded-2xl p-5 sm:p-7 text-left shadow-sm mb-8">
            <p className="text-zinc-700 italic leading-relaxed text-sm sm:text-base">“{verse.text}”</p>
            <footer className="mt-3 text-violet-700 font-semibold text-sm">— {verse.ref}</footer>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/live"
              className="border border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Watch Live
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
