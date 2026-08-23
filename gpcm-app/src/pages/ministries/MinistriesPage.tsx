import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';

const ministries = [
  {
    title: 'Worship & Music',
    desc: 'Leading the congregation into the presence of God through anointed praise and worship.',
    icon: 'fa-music',
  },
  {
    title: 'Youth & Teens',
    desc: 'Raising a generation that knows God early and stands firm in a changing world.',
    icon: 'fa-users',
  },
  {
    title: 'Women of Virtue',
    desc: 'Equipping women to thrive in purpose, family, and ministry.',
    icon: 'fa-heart',
  },
  {
    title: 'Men of Valor',
    desc: 'Building strong, responsible men who lead with integrity and faith.',
    icon: 'fa-shield-halved',
  },
  {
    title: 'Children Church',
    desc: 'Nurturing little ones in the knowledge and love of Jesus from the earliest age.',
    icon: 'fa-child',
  },
  {
    title: 'Prayer & Intercession',
    desc: 'Standing in the gap for the church, the city, and the nations.',
    icon: 'fa-hands-praying',
  },
];

export default function MinistriesPage() {
  return (
    <div className="tail-container bg-zinc-50 text-zinc-900 min-h-screen relative overflow-x-clip">
      <Navbar onOpenLiveModal={() => window.location.href = '/live'} />
      <main className="pt-20">
        <section className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-5">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-medium mb-3">
                <i className="fa-solid fa-hands-holding-heart text-[10px]" />
                MINISTRIES
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#321C04]">
                Our Ministries
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#321C04]/80 max-w-2xl mx-auto">
                Every member has a place. Discover where God is calling you to serve and grow with us.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {ministries.map((m) => (
                <div
                  key={m.title}
                  className="card-hover bg-[#FFF9F2] border border-[#D9C4AA] rounded-xl sm:rounded-2xl p-5 sm:p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-lg mb-4">
                    <i className={`fa-solid ${m.icon}`} />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#321C04] mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#321C04]/80 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md"
              >
                Join a Ministry
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
