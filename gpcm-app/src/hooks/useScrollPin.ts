import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export type PinPhase = 'before' | 'pinned' | 'after';

// Mobile browsers (Safari/Chrome) resize window.innerHeight mid-scroll as
// their address bar collapses/expands — often by 50-150px. If we compare
// getBoundingClientRect() against a freshly-read window.innerHeight on
// every scroll tick, that fluctuation makes the pin threshold shift while
// the user is scrolling, which flips the phase to "after" early and looks
// like the video "pins briefly, then drifts". We ignore any height delta
// smaller than this as toolbar noise, not a real resize.
const TOOLBAR_NOISE_PX = 150;

/**
 * True zero-movement scroll pinning.
 *
 * Unlike position:sticky (which releases and starts drifting with the page
 * once its tall wrapper runs out of room), this keeps the pinned element on
 * position:fixed for the entire time its wrapper is taller than the
 * viewport, then parks it flush at the wrapper's bottom edge — exactly
 * where the next section begins — so it never visibly moves; it's simply
 * covered as the next section slides up over it, and un-covered again on
 * scroll back up.
 *
 * The viewport height used for both the math AND the rendered box is
 * cached once (not re-read every scroll frame), so a mobile browser's
 * address-bar animation can never desync the two.
 *
 * Usage:
 *   const { wrapperRef, pinStyle } = useScrollPin<HTMLElement>();
 *   <section ref={wrapperRef} className="relative h-[140vh]">
 *     <div style={pinStyle}>...video/content...</div>
 *   </section>
 */
export function useScrollPin<T extends HTMLElement>() {
  const wrapperRef = useRef<T>(null);
  const [phase, setPhase] = useState<PinPhase>('before');
  const vhRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [, forceRender] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let ticking = false;

    const measure = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();

      if (rect.top > 0) {
        setPhase('before');
      } else if (rect.bottom <= 0) {
        // Wrapper has fully scrolled past (its bottom edge has cleared the
        // viewport top), not merely reached the viewport bottom. This keeps
        // the video truly fixed for the entire time the next section is
        // climbing up over it, instead of releasing early once the wrapper's
        // edge first touches the bottom of the screen.
        setPhase('after');
      } else {
        setPhase('pinned');
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      // Debounce so we only act once the browser chrome/orientation change
      // has actually settled, not on every intermediate animation frame.
      resizeTimer = setTimeout(() => {
        const newVh = window.innerHeight;
        if (Math.abs(newVh - vhRef.current) > TOOLBAR_NOISE_PX) {
          vhRef.current = newVh;
          forceRender((n) => n + 1);
        }
        measure();
      }, 150);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const vhPx = `${vhRef.current}px`;

  const pinStyle: CSSProperties =
    phase === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, width: '100%', height: vhPx }
      : phase === 'after'
      ? { position: 'absolute', bottom: 0, left: 0, width: '100%', height: vhPx }
      : { position: 'absolute', top: 0, left: 0, width: '100%', height: vhPx };

  return { wrapperRef, phase, pinStyle };
}
