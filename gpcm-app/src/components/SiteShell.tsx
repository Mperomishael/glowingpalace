import type { ReactNode } from "react";
import Footer from "./Footer";
import HashScroller from "./HashScroller";
import Navbar from "./Navbar";
import WhatsAppFloat from "./WhatsAppFloat";

export default function SiteShell({
  children,
  className = "bg-zinc-50 text-zinc-900",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tail-container min-h-screen relative overflow-x-clip ${className}`}>
      <HashScroller />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}