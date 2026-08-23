import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WA_USHER = '2348156013387';
const WA_GO = '2348069390490';

const POS_KEY = 'gpcm-wa-float-pos';

type Role = 'bot' | 'user' | 'system';
type Msg = { id: number; role: Role; text: string };

type Reply =
  | { type: 'answer'; text: string }
  | { type: 'handoff'; reason: string };

function matchReply(raw: string): Reply {
  const q = raw.toLowerCase().trim();

  if (/live|stream|watch|broadcast|youtube|facebook/.test(q)) {
    return {
      type: 'answer',
      text: 'You can join Sunday Service live every Sunday at 9:00 AM WAT.\n\nOpen Watch Live on the site for Facebook or YouTube, or ask me to connect you to someone.',
    };
  }
  if (/service|sunday|worship|time|when|schedule/.test(q)) {
    return {
      type: 'answer',
      text: 'Sunday Service is every Sunday at 9:00 AM WAT in Ughelli, and online via Watch Live.\n\nYou are welcome in person or online.',
    };
  }
  if (/address|location|where|map|direction|find|ughelli/.test(q)) {
    return {
      type: 'answer',
      text: 'We gather at #3 Oharisi Street, Opposite Central Garage, Ughelli, Delta State.\n\nThere is a map on the homepage under “Visit Us in Ughelli.”',
    };
  }
  if (/give|offering|tithe|donate|partner|account|bank|seed/.test(q)) {
    return {
      type: 'answer',
      text: 'Thank you for partnering with us.\n\nSterling Bank\nAccount: 8817008125\nName: GPCM INT’L\n\nFull details are on the Give page. After giving, you may send proof via WhatsApp for prayer covering.',
    };
  }
  if (/bishop|overseer|clement|founder|leader|go\b|general overseer/.test(q)) {
    return {
      type: 'answer',
      text: 'Apostle Bishop Dr. Ilaya O. Clement is President & Founder and General Overseer of GPCM INT’L.\n\nYou can read more on the Overseer page, or choose to message him on WhatsApp.',
    };
  }
  if (/prayer|pray|intercession|need prayer/.test(q)) {
    return {
      type: 'answer',
      text: 'We would be honoured to stand with you in prayer.\n\nShare a short request here, or connect to Usher or the General Overseer on WhatsApp for personal follow-up.',
    };
  }
  if (/sermon|message|audio|video|media|download/.test(q)) {
    return {
      type: 'answer',
      text: 'Latest sermons and gospel audio are on the homepage under Watch & Listen — stream online or download where available.',
    };
  }
  if (/book|tract|library|read/.test(q)) {
    return {
      type: 'answer',
      text: 'Liberty Library has ministry books and tracts. Open Books on the site to read online or download PDFs.',
    };
  }
  if (/ministry|ministries|youth|women|men|children|join group|whatsapp group/.test(q)) {
    return {
      type: 'answer',
      text: 'We have Worship, Youth & Teens, Women of Virtue, Men of Valor, Children’s Church, and Prayer & Intercession.\n\nSee Ministries on the site, or join the community WhatsApp group from the homepage.',
    };
  }
  if (/contact|phone|email|call|number/.test(q)) {
    return {
      type: 'answer',
      text: 'You can reach us at:\n+234 815 601 3387 (Usher)\n+234 806 939 0490 (General Overseer)\nusher@glowingpalaceministry.org\n\nOr pick who to message on WhatsApp below.',
    };
  }
  if (/hello|hi\b|hey|good (morning|afternoon|evening)|greetings|how are you/.test(q)) {
    return {
      type: 'answer',
      text: 'Peace to you 🙏 Welcome to Glowing Palace.\n\nI can help with service times, location, giving, sermons, ministries, or connect you to Usher or the General Overseer.',
    };
  }
  if (/thank|bless|amen|ok\b|okay|great|wonderful/.test(q)) {
    return {
      type: 'answer',
      text: 'Amen. God bless you. Anything else I can help with?',
    };
  }

  return {
    type: 'handoff',
    reason:
      'I want to make sure you get the right help. Would you like me to connect you on WhatsApp?',
  };
}

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [handoff, setHandoff] = useState(false);
  const [pendingText, setPendingText] = useState('');
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const [dragging, setDragging] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ ox: number; oy: number; sx: number; sy: number; moved: boolean } | null>(
    null
  );
  const idRef = useRef(1);
  const posRef = useRef(pos);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { x: number; y: number };
        if (typeof p.x === 'number' && typeof p.y === 'number') setPos(p);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([
        {
          id: idRef.current++,
          role: 'bot',
          text: 'Peace to you 🙏 Welcome to Glowing Palace of Christian Ministry International.\n\nAsk about service times, location, giving, sermons, or ministries — or say if you need prayer.',
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, handoff]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const clampPos = useCallback((x: number, y: number) => {
    const size = 64;
    const maxX = Math.max(8, window.innerWidth - size - 8);
    const maxY = Math.max(8, window.innerHeight - size - 8);
    return {
      x: Math.min(maxX, Math.max(8, x)),
      y: Math.min(maxY, Math.max(8, y)),
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (open) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      ox: e.clientX,
      oy: e.clientY,
      sx: pos.x < 0 ? rect.left : pos.x,
      sy: pos.y < 0 ? rect.top : pos.y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.ox;
    const dy = e.clientY - d.oy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;
    setPos(clampPos(d.sx + dx, d.sy + dy));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!d) return;
    if (!d.moved) {
      setOpen((v) => !v);
      return;
    }
    const next = clampPos(posRef.current.x, posRef.current.y);
    setPos(next);
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const openWhatsApp = (number: string, text?: string) => {
    const msg = (text?.trim() || '').slice(0, 500);
    const url = msg
      ? `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/${number}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setHandoff(false);
    const userMsg: Msg = { id: idRef.current++, role: 'user', text };
    setMessages((m) => [...m, userMsg]);

    const reply = matchReply(text);
    window.setTimeout(() => {
      if (reply.type === 'answer') {
        setMessages((m) => [...m, { id: idRef.current++, role: 'bot', text: reply.text }]);
      } else {
        setPendingText(text);
        setMessages((m) => [
          ...m,
          { id: idRef.current++, role: 'bot', text: reply.reason },
        ]);
        setHandoff(true);
      }
    }, 350);
  };

  const connect = (who: 'usher' | 'go') => {
    const number = who === 'usher' ? WA_USHER : WA_GO;
    const label = who === 'usher' ? 'Usher' : 'General Overseer';
    setMessages((m) => [
      ...m,
      {
        id: idRef.current++,
        role: 'system',
        text: `Redirecting you to ${label} on WhatsApp…`,
      },
    ]);
    setHandoff(false);
    window.setTimeout(() => {
      openWhatsApp(number, pendingText || undefined);
    }, 600);
  };

  const btnStyle: React.CSSProperties =
    pos.x >= 0 && pos.y >= 0
      ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
      : { right: 20, bottom: 20 };

  const panelStyle: React.CSSProperties =
    pos.x >= 0 && pos.y >= 0
      ? {
          left: Math.min(pos.x, window.innerWidth - 360),
          bottom: Math.max(88, window.innerHeight - pos.y + 12),
          right: 'auto',
          top: 'auto',
        }
      : { right: 16, bottom: 96 };

  return (
    <>
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`fixed z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center touch-none select-none transition-shadow
          bg-gradient-to-br from-[#2FE36C] via-[#25D366] to-[#1da851] text-white
          ring-4 ring-white/25 hover:ring-white/40
          ${dragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105 active:scale-95'}
          ${open ? 'opacity-90' : ''}`}
        style={btnStyle}
        aria-label={open ? 'Close chat' : 'Open chat — drag to move'}
        title="Drag to move · Tap to chat"
      >
        {open ? (
          <X size={24} className="sm:w-7 sm:h-7 pointer-events-none" />
        ) : (
          <MessageCircle size={26} className="sm:w-8 sm:h-8 pointer-events-none" fill="white" />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 w-[min(100vw-1.5rem,360px)] max-h-[min(72vh,540px)] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-black/10 animate-fade-in-down"
          style={panelStyle}
          role="dialog"
          aria-label="Ministry chat"
        >
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-2 ring-white/30">
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
              <div className="font-semibold text-sm truncate">GPCM Assistant</div>
              <div className="text-[11px] text-white/85">Site guide · then Usher or G.O.</div>
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

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[200px]"
            style={{
              backgroundColor: '#E5DDD5',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4c4b0\' fill-opacity=\'0.35\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 shadow-sm max-w-[90%] text-[13px] leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#DCF8C6] text-zinc-900 rounded-br-md'
                      : m.role === 'system'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/80 rounded-bl-md'
                        : 'bg-white text-zinc-800 rounded-bl-md'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {handoff && (
              <div className="flex flex-col gap-2 pt-1">
                <p className="text-[11px] text-zinc-600 text-center px-2">
                  Redirecting you to Usher or G.O.?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => connect('usher')}
                    className="flex-1 py-2.5 rounded-2xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all"
                  >
                    Usher
                    <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">
                      ···3387
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => connect('go')}
                    className="flex-1 py-2.5 rounded-2xl bg-[#075E54] text-white text-xs font-semibold shadow-sm hover:bg-[#064e46] active:scale-[0.98] transition-all"
                  >
                    General Overseer
                    <span className="block text-[10px] font-normal text-white/70 mt-0.5">
                      ···0490
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F0F0F0] px-2.5 py-2.5 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the ministry…"
              className="flex-1 rounded-full bg-white border-0 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#25D366]/40"
            />
            <button
              type="button"
              onClick={handleSend}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2FE36C] to-[#1da851] text-white flex items-center justify-center shrink-0 shadow-md hover:brightness-105 active:scale-95 transition-all"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
