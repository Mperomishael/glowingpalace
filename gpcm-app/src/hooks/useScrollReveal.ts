import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver reveal with safe defaults:
 * - Starts visible so content is never blank before observer runs
 * - Falls in with stagger when entering; flies out when leaving
 */
export function useScrollReveal(itemCount: number, options?: { rootMargin?: string; threshold?: number }) {
  const containerRef = useRef<HTMLElement | null>(null);
  // true by default → cards show immediately; observer only toggles for animation
  const [visible, setVisible] = useState(true);
  const measured = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // After paint, sync with real intersection once
    const sync = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const inView = rect.top < vh * 0.92 && rect.bottom > vh * 0.05;
      if (!measured.current) {
        measured.current = true;
        setVisible(inView);
      }
    };
    const raf = requestAnimationFrame(sync);

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: options?.rootMargin ?? '40px 0px 40px 0px',
        threshold: options?.threshold ?? 0.05,
      }
    );

    obs.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [options?.rootMargin, options?.threshold, itemCount]);

  return { containerRef, visible };
}

export function staggerDelay(index: number, visible: boolean, total: number, step = 70): number {
  if (visible) return index * step;
  return Math.max(0, total - 1 - index) * step * 0.45;
}
