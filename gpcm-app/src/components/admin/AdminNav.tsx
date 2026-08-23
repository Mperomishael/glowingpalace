// src/components/admin/AdminNav.tsx
// Purple/gold/milk glassmorphic admin nav. Slides away as the user
// scrolls down (more screen for the media grid on a phone), slides back
// on scroll-up, and can also be tapped back into view via the floating
// pill that appears once it's hidden.

import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu } from 'lucide-react';

export interface AdminTab {
  key: string;
  label: string;
  icon: React.ElementType;
}

interface Props {
  title: string;
  tabs: AdminTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  onLogout: () => void;
}

export default function AdminNav({ title, tabs, activeTab, onTabChange, onLogout }: Props) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const tappedOpen = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY.current + 6;
        const goingUp = y < lastY.current - 6;

        if (goingDown && y > 80) {
          setVisible(false);
          tappedOpen.current = false;
        } else if (goingUp || y < 80) {
          setVisible(true);
        }
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tapReveal = () => {
    tappedOpen.current = true;
    setVisible(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? 'translate-y-0' : '-translate-y-full'}
          bg-admin-purple/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(46,10,92,0.35)]`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="font-serif text-lg sm:text-xl font-bold text-admin-milk tracking-tight">
            {title}
          </h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-admin-milkMuted hover:text-admin-gold transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>

        <nav className="max-w-6xl mx-auto px-2 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onTabChange(t.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-t-xl transition-colors
                  ${isActive ? 'text-admin-gold' : 'text-admin-milkMuted/80 hover:text-admin-milk'}`}
              >
                <Icon size={15} /> {t.label}
                <span
                  className={`absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-admin-gold transition-transform duration-300
                    ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            );
          })}
        </nav>
      </header>

      {/* Spacer so content doesn't sit under the fixed nav */}
      <div className="h-[104px] sm:h-[108px]" />

      {/* Tap-to-reveal pill, shows only once the nav has slid away */}
      <button
        onClick={tapReveal}
        aria-label="Show admin menu"
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-4 py-2 rounded-full
          bg-admin-purpleMid/80 backdrop-blur-xl border border-white/15 text-admin-gold text-xs font-medium
          shadow-[0_8px_24px_rgba(46,10,92,0.5)] transition-all duration-300
          ${visible ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      >
        <Menu size={13} /> Menu
      </button>
    </>
  );
}
