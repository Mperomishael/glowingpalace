
export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF] rounded-t-[1.75rem] sm:rounded-t-[2.5rem] relative z-20 -mt-1 shadow-[0_-24px_48px_rgba(0,0,0,0.28),0_-8px_16px_rgba(0,0,0,0.12)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-7 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-2 sm:mb-3">
            <i className="fa-solid fa-church text-[10px]" />
            ABOUT GPCM INT&apos;L
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04] leading-snug">
            A House of Worship,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Transformation &amp; Impact
          </h2>
        </div>

        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 text-center sm:text-left">
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#321C04] mb-3">
            About the Ministry
          </h3>
          <div className="space-y-3 text-xs sm:text-sm md:text-base text-[#321C04]/90 leading-relaxed">
            <p>
              Glowing Palace is a Spirit-filled family under the leadership of Apostle Bishop Dr. Ilaya O. Clement.
              We exist so people encounter Jesus, grow in faith, and carry His love into their homes and communities.
            </p>
            <p>
              From our base in Ughelli, Delta State, we gather for joyful worship, sound teaching, and practical care.
              Whether you are seeking Christ for the first time, needing prayer, or looking for a place to serve —
              you are welcome here, as you are.
            </p>
            <p>
              Our heart is simple: souls saved, lives changed, and communities touched by the Gospel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="card-hover bg-[#FFF9F2] border border-[#D9C4AA] rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="h-36 sm:h-44 md:h-52 bg-cover bg-center" style={{ backgroundImage: "url('/images/anointing.webp')" }} />
            <div className="p-4 sm:p-5">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5 text-[#321C04]">Worship</h3>
              <p className="text-xs sm:text-sm text-[#321C04]/80">We honour God with glad hearts — in song, in the Word, and in everyday obedience.</p>
              <div className="mt-4 pt-3 border-t border-[#D9C4AA] text-[11px] italic text-[#321C04]/60">&quot;Serve the Lord with gladness...&quot;</div>
              <div className="text-[10px] text-[#321C04]/40 mt-0.5">Psalm 100:2</div>
            </div>
          </div>
          <div className="card-hover bg-[#FFF9F2] border border-[#D9C4AA] rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="h-36 sm:h-44 md:h-52 bg-cover bg-center" style={{ backgroundImage: "url('/images/Honoring-God.webp')" }} />
            <div className="p-4 sm:p-5">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5 text-[#321C04]">Growth</h3>
              <p className="text-xs sm:text-sm text-[#321C04]/80">Spirit, mind, and body — we pursue whole-life maturity so believers stand strong in every season.</p>
            </div>
          </div>
          <div className="card-hover bg-[#FFF9F2] border border-[#D9C4AA] rounded-xl sm:rounded-2xl overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="h-36 sm:h-44 md:h-52 bg-cover bg-center" style={{ backgroundImage: "url('/images/discipleship.webp')" }} />
            <div className="p-4 sm:p-5">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5 text-[#321C04]">Discipleship</h3>
              <p className="text-xs sm:text-sm text-[#321C04]/80">We equip the saints to serve, lead, and multiply — so the Kingdom advances beyond our walls.</p>
            </div>
          </div>
        </div>

        <div className="my-8 sm:my-12 flex items-center gap-1 w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D9C4AA]" />
          <div className="flex-1 h-[1.5px] bg-[#D9C4AA]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D9C4AA]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl mb-3 text-[#321C04]">Our Vision</h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#321C04]/90">
              To see souls saved, lives transformed, and communities impacted through the love of Jesus Christ.
            </p>
          </div>
          <div className="bg-[#FFF9F2] border border-[#D9C4AA] p-5 sm:p-7 rounded-xl sm:rounded-2xl">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl mb-3 text-[#321C04]">Our Mission</h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#321C04]/90">
              To worship joyfully, equip the saints, proclaim the Gospel, and demonstrate Christ&apos;s love
              in practical ways — starting in Ughelli and reaching as far as God leads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
