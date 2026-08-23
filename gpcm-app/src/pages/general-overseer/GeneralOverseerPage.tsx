import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import { useMedia } from '../../hooks/useMedia';

const FALLBACK = '/images/worship.webp';

export default function GeneralOverseerPage() {
  const { media: leaders, loading } = useMedia('leader', 1);
  const photoUrl = leaders[0]?.url || FALLBACK;

  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => (window.location.href = '/live')} />
      <main className="pt-20">
        <section className="py-10 sm:py-14 md:py-20 bg-[#F6E4CF] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <i className="fa-solid fa-user-tie text-[10px]" />
                LEADERSHIP
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04] leading-snug">
                The General Overseer
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80 max-w-2xl mx-auto">
                Apostle Bishop Dr. Ilaya O. Clement
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
              <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="h-72 sm:h-96 md:h-[28rem] skeleton-preload" />
                ) : (
                  <img
                    src={photoUrl}
                    alt="Apostle Bishop Dr. Ilaya O. Clement"
                    className="w-full h-72 sm:h-96 md:h-[28rem] object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK;
                    }}
                  />
                )}
                <div className="p-5 sm:p-7">
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#321C04] mb-1">
                    Apostle Bishop Dr. Ilaya O. Clement
                  </h2>
                  <p className="text-xs sm:text-sm text-violet-700 font-medium mb-4">
                    General Overseer · GPCM INT&apos;L
                  </p>
                  <p className="text-sm text-[#321C04]/90 leading-relaxed">
                    A servant of God called to raise a people who know their identity in Christ and walk in the power of the Holy Spirit.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#321C04] mb-3">
                    A Word from the Overseer
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base text-[#321C04]/90 leading-relaxed">
                    <p>
                      Welcome to Glowing Palace. This is more than a church —
                      it is a family, a place of encounter, and a launching pad for destiny.
                    </p>
                    <p>
                      God has placed a burden in our hearts to see lives transformed by the pure Gospel of Jesus Christ.
                      We believe every person matters in God&apos;s sight and is called for a purpose.
                    </p>
                    <p>
                      Whether you join us online or in person in Ughelli, know that you are loved, valued, and expected.
                      Come as you are. Leave changed.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#321C04] mb-3">
                    Mandate
                  </h3>
                  <ul className="space-y-2 text-sm text-[#321C04]/90">
                    <li className="flex gap-2">
                      <i className="fa-solid fa-check text-violet-600 mt-1 text-xs" />
                      <span>Raise Spirit-filled believers who walk in dominion</span>
                    </li>
                    <li className="flex gap-2">
                      <i className="fa-solid fa-check text-violet-600 mt-1 text-xs" />
                      <span>Plant churches and expand the Kingdom across nations</span>
                    </li>
                    <li className="flex gap-2">
                      <i className="fa-solid fa-check text-violet-600 mt-1 text-xs" />
                      <span>Equip the saints for the work of ministry</span>
                    </li>
                    <li className="flex gap-2">
                      <i className="fa-solid fa-check text-violet-600 mt-1 text-xs" />
                      <span>Demonstrate the love of Christ through practical service</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 bg-white/60 border border-[#D9C4AA] text-[#321C04] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-all"
                  >
                    About the Ministry
                  </Link>
                  <Link
                    to="/live"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md"
                  >
                    <i className="fa-solid fa-tower-broadcast text-xs" />
                    Watch Live
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
