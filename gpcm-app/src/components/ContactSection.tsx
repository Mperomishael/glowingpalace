import { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const CONTACT_EMAIL = 'usher@glowingpalaceministry.org';

  const handleSubmit = () => {
    const subject = `Website message from ${formData.name || 'a visitor'}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      '',
      formData.message,
    ].join('\n');

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-10 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-7 text-zinc-900">
              Get in Touch
            </h2>
            <div className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-100 border-0 focus:ring-2 focus:ring-violet-400 rounded-xl px-4 py-3 text-sm outline-none w-full"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-100 border-0 focus:ring-2 focus:ring-violet-400 rounded-xl px-4 py-3 text-sm outline-none w-full"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-zinc-100 border-0 focus:ring-2 focus:ring-violet-400 rounded-xl px-4 py-3 text-sm outline-none"
              />
              <textarea
                placeholder="Your Message or Prayer Request..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-100 border-0 focus:ring-2 focus:ring-violet-400 rounded-xl px-4 py-3 text-sm outline-none resize-none"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-violet-600 hover:bg-violet-700 transition-all text-white py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <Send size={16} />
                Send Message
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5 sm:space-y-6 pt-2 lg:pt-0">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="font-medium text-sm sm:text-base text-zinc-900 leading-snug pt-1.5">
                #3 Oharisi Street, Opposite Central Garage, Ughelli, Delta State
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="space-y-0.5 pt-1.5">
                <div className="font-medium text-sm sm:text-base text-zinc-900">+234 815 601 3387</div>
                <div className="font-medium text-sm sm:text-base text-zinc-900">+234 806 939 0490</div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="font-medium text-sm sm:text-base text-zinc-900 pt-1.5 break-all">
                usher@glowingpalaceministry.org
              </div>
            </div>

            <div className="mt-4 sm:mt-6 bg-zinc-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
              <div className="uppercase tracking-[2px] text-amber-400 text-[11px] sm:text-xs font-medium mb-2">
                Spiritual Leadership
              </div>
              <h3 className="font-serif text-xl sm:text-2xl leading-snug mb-1">
                Apostle Bishop Dr. Ilaya O. Clement
              </h3>
              <p className="text-sm sm:text-base text-amber-300 mb-3">President &amp; Founder</p>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm mb-4">
                A visionary leader and dedicated servant of God with a heart for the lost and a passion for community transformation.
              </p>
              <a
                href="tel:+2348069390490"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-300 transition-colors"
              >
                <Phone size={16} />
                Call Bishop
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
