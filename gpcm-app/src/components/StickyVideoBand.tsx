import { useRef, useEffect, useState } from 'react';
import { useScrollPin } from '../hooks/useScrollPin';

/**
 * Full-viewport video truly pinned (position:fixed, never sticky) while
 * content below scrolls over it. The video never moves at all; it just
 * gets covered by the next section sliding up, and un-covered again on
 * scroll back up. See useScrollPin for the mechanics.
 */
export default function StickyVideoBand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const { wrapperRef, pinStyle } = useScrollPin<HTMLElement>();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setReady(true);
    if (v.readyState >= 3) onReady();
    else v.addEventListener('canplay', onReady);
    return () => v.removeEventListener('canplay', onReady);
  }, []);

  return (
    <section
      id="vision"
      aria-label="Ministry vision video"
      ref={wrapperRef}
      className="relative h-[150vh] sm:h-[165vh] md:h-[180vh] bg-zinc-950"
    >
      <div style={pinStyle} className="w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/worshipers.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 text-white">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/90 mb-3 font-medium">
            Glowing Palace
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold max-w-3xl leading-tight drop-shadow-lg">
            A house of worship, transformation &amp; impact
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-white/85 drop-shadow-md">
            Keep scrolling — enter the moments in God&apos;s presence.
          </p>
          <div className="mt-8 flex flex-col items-center gap-1 text-white/60 animate-bounce">
            <span className="text-[10px] uppercase tracking-wider">Scroll</span>
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>
      </div>
    </section>
  );
}