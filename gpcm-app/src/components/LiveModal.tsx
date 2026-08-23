import React from 'react';

interface LiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveModal({ isOpen, onClose }: LiveModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/25 bg-white/15 shadow-2xl backdrop-blur-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center text-xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="p-7 sm:p-9">
          <div className="w-14 h-14 rounded-2xl bg-red-500/25 border border-red-400/30 text-red-200 flex items-center justify-center text-2xl mb-5 backdrop-blur-sm">
            <i className="fa-solid fa-tower-broadcast" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2 drop-shadow">
            Sunday Service Live
          </h3>
          <p className="text-white/75 text-sm sm:text-base mb-7 leading-relaxed">
            Worship with us online every Sunday at 9:00 AM WAT.
          </p>

          <div className="space-y-3">
            <a
              href="https://www.facebook.com/people/Glowing-Palace/61581418854698"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#1877F2]/90 hover:bg-[#1877F2] text-white rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all text-sm backdrop-blur-sm border border-white/10"
            >
              <i className="fa-brands fa-facebook" />
              Watch on Facebook
            </a>
            <a
              href="https://youtube.com/@palaceofworshippers"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#FF0000]/90 hover:bg-[#FF0000] text-white rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all text-sm backdrop-blur-sm border border-white/10"
            >
              <i className="fa-brands fa-youtube" />
              Watch on YouTube
            </a>
          </div>
        </div>

        <div className="border-t border-white/15">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 text-white/70 font-medium hover:bg-white/10 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
