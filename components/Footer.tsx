"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register") return null;
  return (
    <footer className="bg-background border-t border-border py-16 px-6 md:px-16 lg:px-24 xl:px-48 mt-20">
      <div className="max-w-[1900px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <img src="/primeryLogo.png" alt="SonicFlow Footer Logo" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
          <p className="text-muted-text text-xs font-bold uppercase tracking-widest mt-2">© 2026 SonicFlow Premium Music</p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Explore</h4>
            <Link href="/" className="text-sm font-bold text-muted-text hover:text-primary transition-colors">All Tracks</Link>
            <Link href="/profile" className="text-sm font-bold text-muted-text hover:text-primary transition-colors">My Profile</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Support</h4>
            <Link href="#" className="text-sm font-bold text-muted-text hover:text-primary transition-colors">Help Center</Link>
            <Link href="#" className="text-sm font-bold text-muted-text hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
