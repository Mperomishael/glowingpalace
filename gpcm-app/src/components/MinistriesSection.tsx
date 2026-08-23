import { Church, Users, BookOpen } from 'lucide-react';

const ministries = [
  {
    icon: Church,
    title: 'Worship',
    description: 'Honouring God with glad hearts — in song, in the Word, and in everyday obedience.',
    image: '/images/worship.webp',
    verse: 'Serve the Lord with gladness...',
    ref: 'Psalm 100:2',
  },
  {
    icon: Users,
    title: 'Growth',
    description: 'Spirit, mind, and body — whole-life maturity so believers stand strong in every season.',
    image: '/images/growth.webp',
  },
  {
    icon: BookOpen,
    title: 'Discipleship',
    description: 'Equipping the saints to serve, lead, and multiply — so the Kingdom advances beyond our walls.',
    image: '/images/discipleship.webp',
  },
];

export default function MinistriesSection() {
  return (
    <section id="ministries" className="py-10 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-7 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-2 sm:mb-3">
            <Church size={13} />
            OUR MINISTRIES
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-snug">
            Ministries That Shape Lives
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {ministries.map((ministry, index) => (
            <div
              key={index}
              className="group bg-white border border-zinc-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className="h-36 sm:h-44 md:h-52 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${ministry.image}')` }}
              />
              <div className="p-4 sm:p-5 md:p-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-violet-100 text-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-3">
                  <ministry.icon size={18} />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5 text-zinc-900">
                  {ministry.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{ministry.description}</p>
                {ministry.verse && (
                  <div className="mt-4 pt-3 border-t border-zinc-100">
                    <div className="text-[11px] italic text-zinc-500">&quot;{ministry.verse}&quot;</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{ministry.ref}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
