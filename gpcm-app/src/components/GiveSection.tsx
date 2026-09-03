import { Link } from "react-router-dom";
import { ArrowRight, Globe2 } from "lucide-react";
import { CopyAccountButton, CopyableAccountNumber } from "./CopyableAccount";
import { GIVING } from "@/lib/site";

export default function GiveSection() {
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
            {GIVING.bank}
          </div>
          <CopyableAccountNumber
            className="w-full cursor-pointer mb-1"
            numberClassName="text-xl sm:text-2xl md:text-3xl"
          />
          <div className="text-zinc-400 mt-1 text-xs sm:text-sm">{GIVING.accountName}</div>
          <CopyAccountButton className="mt-5 sm:mt-6 w-full py-2.5 sm:py-3.5 bg-white text-violet-950 rounded-lg sm:rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-amber-300 active:scale-[0.98] transition-all text-xs sm:text-sm" />
        </div>

        {/* Foreign / other-country givers — routes to the full Give page with the
            country + currency picker (Ghana, Kenya, South Africa, USD, EUR, crypto, etc.) */}
        <Link
          to="/give"
          className="group mt-4 sm:mt-5 w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-300/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 transition-all"
        >
          <span className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
            <span className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-300/15 text-amber-300 flex items-center justify-center">
              <Globe2 size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs sm:text-sm font-semibold text-white">
                Giving from outside Nigeria?
              </span>
              <span className="block text-[11px] sm:text-xs text-violet-200">
                Pay in your own currency — Ghana, Kenya, USD, EUR &amp; more
              </span>
            </span>
          </span>
          <ArrowRight
            size={18}
            className="shrink-0 text-amber-300 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
}
