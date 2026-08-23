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
          className="absolute inset-0 z-30 bg-zinc-950 flex flex-col overflow-hidden"
          aria-hidden="true"
          aria-busy="true"
        >
          <div className="h-14 border-b border-white/5 flex items-center px-4 sm:px-6 gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl skeleton-preload-dark shrink-0" />
            <div className="h-3 w-24 rounded-full skeleton-preload-dark" />
            <div className="flex-1" />
            <div className="hidden sm:flex gap-3">
              <div className="h-2.5 w-12 rounded-full skeleton-preload-dark" />
              <div className="h-2.5 w-12 rounded-full skeleton-preload-dark" />
              <div className="h-2.5 w-14 rounded-full skeleton-preload-dark" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 sm:gap-5">
            <div className="h-8 sm:h-10 w-[85%] max-w-md rounded-lg skeleton-preload-dark" />
            <div className="h-8 sm:h-10 w-[65%] max-w-sm rounded-lg skeleton-preload-dark" />
            <div className="h-3 w-40 sm:w-48 rounded-full skeleton-preload-dark mt-2 opacity-70" />
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs sm:max-w-md">
              <div className="h-11 flex-1 rounded-2xl skeleton-preload-dark" />
              <div className="h-11 flex-1 rounded-2xl skeleton-preload-dark opacity-60" />
            </div>
          </div>

          <div className="shrink-0 px-4 pb-6 space-y-3 opacity-40">
            <div className="h-3 w-28 mx-auto rounded-full skeleton-preload-dark" />
            <div className="h-4 w-48 mx-auto rounded-full skeleton-preload-dark" />
          </div>
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/65 z-10" />

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
