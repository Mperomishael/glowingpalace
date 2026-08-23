import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';

export default function GivePage() {
  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => window.location.href = '/live'} />
      <main className="pt-20">
        <section className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF] relative z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <i className="fa-solid fa-heart text-[10px]" />
                GIVE
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04]">
                Partner With Us
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80">
                Your partnership advances the Gospel and multiplies transformation.
              </p>
            </div>

            <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#321C04] mb-5 text-center">
                Bank Details
              </h2>
              <div className="space-y-4 text-center">
                <div className="bg-white/70 border border-[#D9C4AA] rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-1">Account Number</div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#321C04] tracking-wide">
                    8817008125
                  </div>
                </div>
                <div className="bg-white/70 border border-[#D9C4AA] rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-1">Account Name</div>
                  <div className="font-semibold text-lg text-[#321C04]">GPCM INT&apos;L</div>
                </div>
                <div className="bg-white/70 border border-[#D9C4AA] rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-[#321C04]/60 mb-1">Bank</div>
                  <div className="font-semibold text-lg text-[#321C04]">Sterling Bank</div>
                </div>
                <p className="text-xs sm:text-sm text-[#321C04]/70 pt-2">
                  After giving, you may send proof via WhatsApp for acknowledgment and prayer.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/2348069390490"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp" />
                  Send Proof via WhatsApp
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-[#D9C4AA] text-[#321C04] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#FFF9F2] transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-[#321C04]/60 italic">
              &quot;God loves a cheerful giver.&quot; — 2 Corinthians 9:7
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
