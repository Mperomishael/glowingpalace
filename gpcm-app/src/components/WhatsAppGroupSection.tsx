import { Users } from 'lucide-react';

const GROUP_URL =
  'https://chat.whatsapp.com/FyH6XMJDcxe0j4xztFzUgi?s=cl&p=a&ilr=1';

export default function WhatsAppGroupSection() {
  return (
    <section id="community" className="py-10 sm:py-14 md:py-16 bg-[#F6E4CF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-5">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D9C4AA] bg-[#FFF9F2] shadow-sm flex flex-col md:flex-row">
          {/* Preview image from public */}
          <div className="md:w-2/5 relative min-h-[180px] sm:min-h-[220px]">
            <img
              src="/images/worship.webp"
              alt="GPCM community"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Honoring-God.webp';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="flex-1 p-5 sm:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 self-start bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px] font-medium mb-3">
              <Users size={12} />
              COMMUNITY
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321C04] leading-snug mb-2">
              Stay Connected With the Family
            </h2>
            <p className="text-sm sm:text-base text-[#321C04]/80 leading-relaxed mb-5 max-w-md">
              Service updates, prayer points, and fellowship — join the GPCM WhatsApp community and never miss a moment.
            </p>
            <a
              href={GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-colors active:scale-[0.98] shadow-sm"
            >
              <i className="fa-brands fa-whatsapp text-lg" />
              Join the Group
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}