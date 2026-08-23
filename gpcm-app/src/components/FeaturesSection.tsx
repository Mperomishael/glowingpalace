import React from 'react';
import { useMedia } from '../hooks/useMedia';

export default function FeaturesSection() {
  const { media, loading } = useMedia('leader');
  const leaderImage = media.find((m) => m.type === 'image')?.url ?? '/images/worship.webp';

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-zinc-900 text-white relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="md:col-span-5">
            {loading ? (
              <div className="rounded-2xl w-full aspect-[4/5] max-h-[280px] sm:max-h-[360px] md:max-h-none skeleton-preload-dark border border-zinc-800 mx-auto" />
            ) : (
              <img
                src={leaderImage}
                alt="Apostle Bishop Dr. Ilaya O. Clement"
                className="rounded-2xl shadow-xl w-full object-cover border border-zinc-800 aspect-[4/5] max-h-[280px] sm:max-h-[360px] md:max-h-none md:aspect-auto mx-auto"
              />
            )}
          </div>
          <div className="md:col-span-7 text-center md:text-left">
            <div className="uppercase tracking-[2px] text-amber-400 text-[11px] sm:text-xs font-medium mb-2">
              Spiritual Leadership
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-snug mb-2 sm:mb-3 text-white">
              Apostle Bishop Dr. Ilaya O. Clement
            </h2>
            <p className="text-base sm:text-lg text-amber-300 mb-3 sm:mb-5 font-serif italic">
              President &amp; Founder
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mb-5 sm:mb-6 max-w-xl mx-auto md:mx-0">
              A visionary leader and dedicated servant of God with a heart for the lost and a passion for community transformation.
              He leads GPCM INT&apos;L with a focus on the holistic development of believers — spirit, mind, and body.
            </p>
            <div className="flex justify-center md:justify-start">
              <a
                href="tel:+2348069390490"
                className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:bg-amber-300 active:scale-[0.98] transition-all shadow-md"
              >
                <i className="fa-solid fa-phone text-xs" />
                Call Bishop
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
