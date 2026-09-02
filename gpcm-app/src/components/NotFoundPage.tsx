import { Link } from "@tanstack/react-router";
import SiteShell from "@/components/SiteShell";

const VERSES = [
  { ref: "Isaiah 30:21", text: "And your ears shall hear a word behind you, saying, “This is the way, walk in it,” when you turn to the right or when you turn to the left." },
  { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path." },
  { ref: "Proverbs 3:5–6", text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths." },
];

export default function NotFoundPage() {
  const verse = VERSES[Math.floor(Math.random() * VERSES.length)];
  return (
    <SiteShell>
      <main className="pt-24 pb-16 min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="relative inline-block mb-8">
            <span className="font-serif text-[7rem] sm:text-[9rem] font-bold leading-none text-violet-200 select-none" aria-hidden>
              404
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">This path was not found</h1>
          <p className="text-zinc-500 text-sm sm:text-base mb-8">
            The page you requested does not exist — or could not be loaded. You are still welcome here.
          </p>
          <blockquote className="bg-white border border-violet-100 rounded-2xl p-5 sm:p-7 text-left shadow-sm mb-8">
            <p className="text-zinc-700 italic leading-relaxed text-sm sm:text-base">“{verse.text}”</p>
            <footer className="mt-3 text-violet-700 font-semibold text-sm">— {verse.ref}</footer>
          </blockquote>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors">
              Back to Home
            </Link>
            <Link to="/live" className="border border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-full text-sm font-semibold transition-colors">
              Watch Live
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}