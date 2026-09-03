import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: Record<string, unknown>) => void;
  }
}

const SCRIPT_SRC = 'https://checkout.flutterwave.com/v3.js';
let loadingPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.FlutterwaveCheckout) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Flutterwave script')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
    document.body.appendChild(script);
  });

  return loadingPromise;
}

/** Returns true once window.FlutterwaveCheckout is available. */
export function useFlutterwaveScript() {
  const [ready, setReady] = useState(!!window.FlutterwaveCheckout);

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => console.error('useFlutterwaveScript', err));
    return () => {
      cancelled = true;
    };
  }, [ready]);

  return ready;
}
