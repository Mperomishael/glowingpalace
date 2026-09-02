import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobileMenu = () => setIsOpen((prev) => !prev);

  const smoothScrollTo = (sectionId: string) => {
    setIsOpen(false);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      void navigate({ to: "/", hash: sectionId });
    }
  };

  const navLinks = [
    { path: "/", label: "Home", id: "home" },
    { path: "/about", label: "About", id: "about" },
    { path: "/general-overseer", label: "Overseer", id: null },
    { path: "/ministries", label: "Ministries", id: "ministries" },
    { path: "/contact", label: "Contact", id: "contact" },
    { path: "/gallery", label: "Gallery", id: null },
  ] as const;

  return (
    <nav
      id="nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white/55 backdrop-blur-xl border-b border-white/25 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            : "bg-white/25 backdrop-blur-lg border-b border-white/15"
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
              <img
                src="/logo.webp"
                alt="GPCM Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-bold tracking-tight text-zinc-900">
                GPCM INT'L
              </div>
              <div className="text-[10px] text-zinc-600 -mt-0.5 hidden sm:block tracking-wide">
                Glowing Palace of Christian Ministry
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(({ path, label, id }) =>
              path === "/" && isHome && id ? (
                <a
                  key={label}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(id);
                  }}
                  className="nav-link text-zinc-800 hover:text-violet-600 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={path}
                  className={`nav-link transition-colors ${
                    pathname === path ? "text-violet-600 font-semibold" : "text-zinc-800 hover:text-violet-600"
                  }`}
                >
                  {label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/live"
              className="px-5 py-1.5 text-sm font-semibold bg-white/35 backdrop-blur-md border border-white/40 hover:bg-white/55 rounded-full transition-all text-zinc-800"
            >
              Watch Live
            </Link>
            <Link
              to="/give"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-1.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 shadow-md"
            >
              <i className="fa-solid fa-heart text-xs" />
              Give
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-xl text-zinc-800"
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/50 backdrop-blur-xl border-t border-white/25 py-5 px-5">
          <div className="flex flex-col gap-5 text-base">
            {navLinks.map(({ path, label }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`font-medium ${pathname === path ? "text-violet-600" : "text-zinc-900"}`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-zinc-200/50 flex flex-col gap-2.5">
              <Link
                to="/live"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-white/50 border border-white/50 rounded-2xl font-semibold text-zinc-800 text-sm text-center"
              >
                Watch Live
              </Link>
              <Link
                to="/give"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-violet-600 text-white rounded-2xl font-semibold text-sm text-center"
              >
                Give
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}