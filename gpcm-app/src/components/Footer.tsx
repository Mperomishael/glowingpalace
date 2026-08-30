import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-3 text-white mb-6">
              <img
                src="/logo.webp"
                alt="GPCM Logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="font-serif text-2xl font-bold text-white">GPCM INT'L</div>
            </div>
            <p className="text-sm leading-relaxed">
              A Spirit-filled family dedicated to joyful worship, discipleship, and lasting transformation.
            </p>
          </div>

          <div>
            <div className="uppercase text-xs tracking-widest mb-6 text-white">Quick Links</div>
            <div className="space-y-3 text-sm">
              <div><Link to="/about" className="hover:text-white transition-colors">About Us</Link></div>
              <div><Link to="/ministries" className="hover:text-white transition-colors">Ministries</Link></div>
              <div><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></div>
              <div><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></div>
              <div><Link to="/General-Overseer" className="hover:text-white transition-colors">General Overseer</Link></div>
            </div>
          </div>

          <div>
            <div className="uppercase text-xs tracking-widest mb-6 text-white">Bank Details</div>
            <div className="text-sm bg-white/5 p-6 rounded-3xl">
              <div><span className="text-amber-300">Acct:</span> 9377716938</div>
              <div className="mt-1"><span className="text-amber-300">Name:</span> GPCM INT'L</div>
              <div className="mt-4 text-xs text-zinc-500">FLUTTERWAVE</div>
            </div>
          </div>

          <div>
            <div className="uppercase text-xs tracking-widest mb-6 text-white">Connect</div>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/Glowing-Palace/61581418854698" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Facebook">
                <Facebook size={20} className="text-white" />
              </a>
              <a href="https://www.instagram.com/glowing.palace" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Instagram">
                <Instagram size={20} className="text-white" />
              </a>
              <a href="https://youtube.com/@palaceofworshippers" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="YouTube">
                <Youtube size={20} className="text-white" />
              </a>
              <a href="https://www.tiktok.com/@palaceofworshippers" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="TikTok">
                <TikTokIcon size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs mt-20 pt-8 border-t border-white/10">
          © 2026 Glowing Palace of Christian Ministry International. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
