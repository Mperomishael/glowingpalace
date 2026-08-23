import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function GiveSection() {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText('8817008125');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="give-section" className="py-10 sm:py-14 md:py-16 bg-gradient-to-br from-violet-950 to-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-5 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 leading-snug">
          Partner With Us
        </h2>
        <p className="text-sm sm:text-base text-violet-200 mb-6 sm:mb-8">
          Your partnership advances the Gospel and multiplies transformation
        </p>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-7">
          <div className="text-[11px] sm:text-xs uppercase tracking-widest mb-1.5 text-amber-300">
            Sterling Bank
          </div>
          <div onClick={copyAccount} className="cursor-pointer group mb-1">
            <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wider group-active:scale-95 transition-transform break-all">
              8817008125
            </div>
            <div className="text-zinc-400 mt-1 text-xs sm:text-sm">GPCM INT&apos;L</div>
          </div>
          <button
            onClick={copyAccount}
            className="mt-5 sm:mt-6 w-full py-2.5 sm:py-3.5 bg-white text-violet-950 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-300 active:scale-[0.98] transition-all text-xs sm:text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Account Number'}
          </button>
        </div>
      </div>
    </section>
  );
}
