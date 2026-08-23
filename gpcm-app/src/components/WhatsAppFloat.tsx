import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WA_NUMBER = '2348069390490';

const GREETING =
  "Good day 🙏\n\nWelcome to Glowing Palace of Christian Ministry International.\n\nHow can we walk with you today — prayer, joining a service, or just saying hello?";

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [input, setInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setShowGreeting(false);
      return;
    }
    const t = setTimeout(() => setShowGreeting(true), 600);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openWhatsApp = (text?: string) => {
    const msg = (text?.trim() || GREETING).slice(0, 500);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    if (!input.trim()) {
      openWhatsApp();
      return;
    }
    openWhatsApp(input.trim());
    setInput('');
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 bg-[#25D366] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
        aria-label={open ? 'Close chat' : 'Chat with us'}
      >
        {open ? (
          <X size={26} className="sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle size={28} className="sm:w-8 sm:h-8" fill="white" />
        )}
      </button>

      {/* Chat panel – WhatsApp-like */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 z-50 w-[min(100vw-2rem,360px)] max-h-[min(70vh,520px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-black/10 animate-fade-in-down"
          role="dialog"
          aria-label="Ministry chat"
        >
          {/* Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.webp"
                alt=""
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate">GPCM INT&apos;L</div>
              <div className="text-[11px] text-white/80">Usually replies soon</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[180px]"
            style={{
              backgroundColor: '#E5DDD5',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4c4b0\' fill-opacity=\'0.35\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            {!showGreeting ? (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[85%]">
                  <div className="flex gap-1 items-center h-5 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-sm max-w-[90%] text-[13px] leading-relaxed text-zinc-800 whitespace-pre-line">
                  {GREETING}
                  <div className="text-[10px] text-zinc-400 text-right mt-1.5">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="bg-[#F0F0F0] px-2 py-2 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message"
              className="flex-1 rounded-full bg-white border-0 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366]/50"
            />
            <button
              type="button"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 hover:bg-[#20bd5a] active:scale-95 transition-all"
              aria-label="Send on WhatsApp"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
