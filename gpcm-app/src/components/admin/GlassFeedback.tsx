// src/components/admin/GlassFeedback.tsx
// Purple/gold/milk glassmorphic replacement for window.alert() / window.confirm().
// Usage inside AdminPage:
//   const { notify, confirmAction, FeedbackHost } = useGlassFeedback();
//   notify('Published!', 'success');
//   const ok = await confirmAction({ title: 'Delete permanently?', message: '...' });
//   <FeedbackHost /> // render once, near the root of the page

import { useCallback, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
  leaving?: boolean;
}

interface ConfirmState {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  resolve: (v: boolean) => void;
  leaving?: boolean;
}

const TOAST_ICON: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TOAST_ACCENT: Record<ToastKind, string> = {
  success: 'text-admin-goldSoft',
  error: 'text-rose-300',
  info: 'text-admin-purpleLight',
};

export function useGlassFeedback() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const idRef = useRef(0);

  const notify = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 250);
    }, 3400);
  }, []);

  const confirmAction = useCallback(
    (opts: Omit<ConfirmState, 'resolve'>) =>
      new Promise<boolean>((resolve) => {
        setConfirmState({ ...opts, resolve });
      }),
    []
  );

  const closeConfirm = (result: boolean) => {
    if (!confirmState) return;
    confirmState.resolve(result);
    setConfirmState((s) => (s ? { ...s, leaving: true } : s));
    window.setTimeout(() => setConfirmState(null), 220);
  };

  const FeedbackHost = () => (
    <>
      {/* Toasts */}
      <div className="fixed top-4 inset-x-0 z-[90] flex flex-col items-center gap-2 px-4 pointer-events-none sm:top-6">
        {toasts.map((t) => {
          const Icon = TOAST_ICON[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full max-w-sm flex items-center gap-3 rounded-2xl px-4 py-3.5
                bg-admin-purpleMid/70 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(46,10,92,0.45)]
                ${t.leaving ? 'animate-glass-out' : 'animate-glass-in'}`}
            >
              <Icon size={19} className={`shrink-0 ${TOAST_ACCENT[t.kind]}`} />
              <p className="text-sm text-admin-milk leading-snug">{t.message}</p>
            </div>
          );
        })}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-5">
          <div
            className={`absolute inset-0 bg-admin-purple/70 backdrop-blur-sm ${confirmState.leaving ? 'animate-glass-out' : 'animate-glass-in'}`}
            onClick={() => closeConfirm(false)}
          />
          <div
            className={`relative w-full max-w-sm rounded-3xl p-7 bg-white/[0.08] backdrop-blur-2xl border border-white/15
              shadow-[0_20px_60px_rgba(46,10,92,0.55)] ${confirmState.leaving ? 'animate-glass-out' : 'animate-glass-in'}`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                confirmState.danger ? 'bg-rose-500/15 text-rose-300' : 'bg-admin-gold/15 text-admin-gold'
              }`}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-admin-milk mb-1.5">{confirmState.title}</h3>
            {confirmState.message && (
              <p className="text-sm text-admin-milkMuted/90 mb-6 leading-relaxed">{confirmState.message}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => closeConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-medium text-admin-milk bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {confirmState.cancelLabel || 'Cancel'}
              </button>
              <button
                onClick={() => closeConfirm(true)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  confirmState.danger
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-admin-gold hover:bg-admin-goldHover text-admin-purple'
                }`}
              >
                {confirmState.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return { notify, confirmAction, FeedbackHost };
}
