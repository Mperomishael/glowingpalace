import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';

export default function ContactPage() {
  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => window.location.href = '/live'} />
      <main className="pt-20">
        <section className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <i className="fa-solid fa-envelope text-[10px]" />
                CONTACT
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04]">
                Get in Touch
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80 max-w-2xl mx-auto">
                We would love to hear from you. Reach out for prayer, partnership, or any inquiry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#321C04] mb-1">Location</h3>
                  <p className="text-sm text-[#321C04]/85">Ughelli, Delta State, Nigeria</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#321C04] mb-1">Service Times</h3>
                  <p className="text-sm text-[#321C04]/85">Sunday Service · 9:00 AM WAT</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#321C04] mb-1">Email / Phone</h3>
                  <p className="text-sm text-[#321C04]/85">Reach us via WhatsApp or social channels</p>
                </div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/234"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                  >
                    <i className="fa-brands fa-whatsapp" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#321C04] mb-4">
                  Follow & Connect
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.facebook.com/people/Glowing-Palace/61581418854698"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-[#321C04]/90 hover:text-violet-700 transition-colors"
                  >
                    <i className="fa-brands fa-facebook text-[#1877F2] w-5" />
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/glowing.palace"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-[#321C04]/90 hover:text-violet-700 transition-colors"
                  >
                    <i className="fa-brands fa-instagram text-pink-600 w-5" />
                    Instagram
                  </a>
                  <a
                    href="https://youtube.com/@palaceofworshippers"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-[#321C04]/90 hover:text-violet-700 transition-colors"
                  >
                    <i className="fa-brands fa-youtube text-red-600 w-5" />
                    YouTube
                  </a>
                </div>
                <div className="mt-6 pt-5 border-t border-[#D9C4AA]">
                  <Link
                    to="/give"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                  >
                    <i className="fa-solid fa-heart text-xs" />
                    Support the Ministry
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
