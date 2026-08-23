import { useState, useRef, useEffect } from 'react';
import { useScrollPin } from '../hooks/useScrollPin';

const MESSAGES = [
  {
    title: "Welcome to Glowing Palace",
    subtitle: 'A place of encounter, transformation, and lasting impact',
  },
  {
    title: 'You Matter in God’s Sight',
    subtitle: 'Loved • Valued • Called for a purpose',
  },
];

const MIN_LOADER_MS = 2200;

interface HeroSectionProps {
  onOpenLiveModal?: () => void;
}

export default function HeroSection({ onOpenLiveModal }: HeroSectionProps) {
  const [videoReady, setVideoReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadStartRef = useRef<number>(Date.now());

  const [msgIndex, setMsgIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'exiting'>('typing');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    loadStartRef.current = Date.now();

    const hideLoader = () => {
      const elapsed = Date.now() - loadStartRef.current;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      setTimeout(() => setShowLoader(false), remaining);
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      hideLoader();
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay);
      const safety = setTimeout(() => {
        setVideoReady(true);
        hideLoader();
      }, 12000);
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        clearTimeout(safety);
      };
    }
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, []);

  useEffect(() => {
    if (!videoReady || showLoader) return;

    const current = MESSAGES[msgIndex];
    let charIndex = 0;
    let typingTimer: ReturnType<typeof setTimeout>;
    let holdTimer: ReturnType<typeof setTimeout>;
    let exitTimer: ReturnType<typeof setTimeout>;

    setTypedText('');
    setShowSubtitle(false);
    setPhase('typing');

    const typeNext = () => {
      if (charIndex <= current.title.length) {
        setTypedText(current.title.slice(0, charIndex));
        charIndex += 1;

        const lastChar = current.title[charIndex - 2];
        const delay =
          lastChar === ' ' ? 120 :
          lastChar === "'" || lastChar === '’' ? 180 :
          55 + Math.random() * 35;

        typingTimer = setTimeout(typeNext, delay);
      } else {
        setShowSubtitle(true);
        setPhase('holding');

        holdTimer = setTimeout(() => {
          setPhase('exiting');
          setShowSubtitle(false);

          exitTimer = setTimeout(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
          }, 700);
        }, 4200);
      }
    };

    typingTimer = setTimeout(typeNext, 500);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [msgIndex, videoReady, showLoader]);

  const isExiting = phase === 'exiting';
  const { wrapperRef, pinStyle } = useScrollPin<HTMLElement>();

  return (
    <section
      id="home"
      ref={wrapperRef}
      className="relative h-[115vh] sm:h-[125vh] md:h-[135vh]"
    >
      <div style={pinStyle} className="flex items-center justify-center overflow-hidden pt-14">
      {showLoader && (
        <div
          className="absolute inset-0 z-30 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
          aria-hidden="true"
          aria-busy="true"
        >
          {/* Minimal palace / throne mark — lightweight SVG */}
          <svg
            viewBox="0 0 120 100"
            className="w-24 h-20 sm:w-28 sm:h-24 text-white/15"
            fill="currentColor"
            role="img"
            aria-label="Loading"
          >
            {/* Base platform */}
            <rect
              className="palace-loader-block"
              x="18"
              y="78"
              width="84"
              height="8"
              rx="1.5"
              style={{ animationDelay: '0.05s' }}
            />
            {/* Seat */}
            <rect
              className="palace-loader-block"
              x="32"
              y="58"
              width="56"
              height="20"
              rx="1.5"
              style={{ animationDelay: '0.18s' }}
            />
            {/* Left pillar */}
            <rect
              className="palace-loader-block"
              x="28"
              y="28"
              width="10"
              height="30"
              rx="1"
              style={{ animationDelay: '0.32s' }}
            />
            {/* Right pillar */}
            <rect
              className="palace-loader-block"
              x="82"
              y="28"
              width="10"
              height="30"
              rx="1"
              style={{ animationDelay: '0.38s' }}
            />
            {/* Backrest center */}
            <rect
              className="palace-loader-block"
              x="48"
              y="36"
              width="24"
              height="22"
              rx="1"
              style={{ animationDelay: '0.48s' }}
            />
            {/* Crown / pediment blocks */}
            <rect
              className="palace-loader-block"
              x="42"
              y="22"
              width="36"
              height="8"
              rx="1"
              style={{ animationDelay: '0.58s' }}
            />
            <rect
              className="palace-loader-block"
              x="52"
              y="12"
              width="16"
              height="10"
              rx="1"
              style={{ animationDelay: '0.68s' }}
            />
            {/* Light line along the crown edge */}
            <path
              className="palace-loader-glow"
              d="M 28 28 L 42 22 L 52 12 L 68 12 L 78 22 L 92 28"
            />
          </svg>
          <p className="mt-6 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/35 font-medium">
            Glowing Palace
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700
          ${videoReady && !showLoader ? 'opacity-100' : 'opacity-0'}
          hero-video`}
      >
        <source src="/lv_0_20260809121737.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/25 via-black/30 to-black/60" />
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,245,230,0.12) 0%, transparent 65%)',
        }}
      />

      <div
        className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white transition-all duration-700
          ${videoReady && !showLoader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div
          className={`space-y-4 sm:space-y-5 transition-all duration-700 ease-out
            ${isExiting ? 'opacity-0 -translate-y-6 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'}`}
        >
          <h1 className="font-serif text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tighter drop-shadow-lg min-h-[1.2em] px-1">
            {typedText}
            {phase === 'typing' && (
              <span className="inline-block w-[2.5px] sm:w-[3px] h-[0.8em] ml-1 bg-amber-300 align-middle animate-pulse" />
            )}
          </h1>

          <p
            className={`max-w-xl mx-auto text-sm sm:text-lg md:text-xl text-white/95 drop-shadow-md transition-all duration-700 px-2
              ${showSubtitle && !isExiting
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'}`}
          >
            {MESSAGES[msgIndex].subtitle}
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center items-center mt-7 sm:mt-10 transition-opacity duration-700 px-2
            ${videoReady && !showLoader ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() =>
                document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex-1 sm:flex-none bg-white text-violet-700 hover:bg-white/95 active:scale-[0.98] px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-play text-xs" />
              Watch Live
            </button>
            <button
              type="button"
              title="Open live stream"
              aria-label="Open live stream"
              onClick={() => onOpenLiveModal?.()}
              className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 border-white/80 bg-white/15 hover:bg-white/25 text-white inline-flex items-center justify-center transition-all shadow-lg"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="border-2 border-white/80 hover:bg-white/10 active:scale-[0.98] px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all w-full sm:w-auto"
          >
            Become Family
          </button>
        </div>
        <p
          className={`mt-3 text-[11px] sm:text-xs text-white/70 transition-opacity duration-700
            ${videoReady && !showLoader ? 'opacity-100' : 'opacity-0'}`}
        >
          Sermons below · arrow opens live stream
        </p>
      </div>
      </div>
    </section>
  );
}
