// src/components/admin/UploadProgressOverlay.tsx
// Full-screen glassmorphic overlay with an animated ring showing real
// upload % (driven by XMLHttpRequest's upload.onprogress — see the
// uploadWithProgress() helper in AdminPage.tsx).

import { UploadCloud, CheckCircle2 } from 'lucide-react';

interface Props {
  progress: number; // 0–100
  fileName?: string;
  phase: 'uploading' | 'processing' | 'done';
}

const SIZE = 132;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function UploadProgressOverlay({ progress, fileName, phase }: Props) {
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = CIRC - (clamped / 100) * CIRC;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-admin-purple/80 backdrop-blur-md" />

      <div className="relative w-full max-w-xs rounded-3xl p-8 bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(46,10,92,0.6)] animate-glass-in flex flex-col items-center text-center">
        <div className="relative mb-5" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={phase === 'done' ? '#D4AF37' : 'url(#uploadGrad)'}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.25s ease-out' }}
            />
            <defs>
              <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {phase === 'done' ? (
              <CheckCircle2 size={34} className="text-admin-gold animate-glass-in" />
            ) : (
              <>
                <span className="font-serif text-2xl font-bold text-admin-milk tabular-nums">
                  {clamped}%
                </span>
                <UploadCloud size={14} className="text-admin-goldSoft mt-1 animate-pulse" />
              </>
            )}
          </div>
        </div>

        <p className="text-sm font-medium text-admin-milk mb-1">
          {phase === 'uploading' && 'Uploading…'}
          {phase === 'processing' && 'Finishing up…'}
          {phase === 'done' && 'Upload complete'}
        </p>
        {fileName && (
          <p className="text-xs text-admin-milkMuted/70 truncate max-w-full">{fileName}</p>
        )}

        {phase !== 'done' && (
          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden mt-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-admin-gold to-admin-purpleLight"
              style={{ width: `${clamped}%`, transition: 'width 0.25s ease-out' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
