import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll window to top on every pathname change (nav route taps). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
