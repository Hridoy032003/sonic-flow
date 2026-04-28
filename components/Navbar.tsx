"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Music, LogOut, Shield, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[calc(100%-3rem)] max-w-7xl">
      <div className="glass rounded-[32px] px-10 h-20 flex items-center justify-between shadow-2xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-foreground text-background p-2.5 rounded-2xl group-hover:rotate-12 transition-transform shadow-xl">
            <Music size={20} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-foreground">SonicFlow</span>
        </Link>

        <div className="flex items-center gap-10">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-8">
                  <nav className="hidden md:flex items-center gap-10 mr-6 border-r border-border pr-10">
                    <Link href="/" className={`text-sm font-black uppercase tracking-widest transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-text hover:text-foreground'}`}>Explore</Link>
                    <Link href="#" className="text-sm font-black uppercase tracking-widest text-muted-text hover:text-foreground">Library</Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="text-sm font-black uppercase tracking-widest text-muted-text hover:text-foreground flex items-center gap-2">
                        <Shield size={16} className="text-primary" /> Admin
                      </Link>
                    )}
                  </nav>

                  <div className="relative">
                    <button 
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-4 p-2 pr-5 rounded-[24px] bg-secondary border border-border hover:bg-background transition-all group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                        {user?.email[0].toUpperCase() || null}
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-[10px] font-black text-muted-text uppercase tracking-widest leading-none mb-1">Account</p>
                        <p className="text-xs font-black text-foreground truncate max-w-[120px]">{user?.email.split('@')[0]}</p>
                      </div>
                      <ChevronDown size={16} className={`text-muted-text transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {menuOpen && (
                      <div className="absolute top-full right-0 mt-4 w-64 glass rounded-[32px] shadow-2xl p-3 z-[160] animate-in fade-in slide-in-from-top-6 duration-500">
                        <Link 
                          href="/profile" 
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-6 py-5 rounded-[24px] text-muted-text hover:text-foreground hover:bg-secondary font-black text-sm transition-all"
                        >
                          <User size={20} className="text-primary" /> View Profile
                        </Link>
                        <button 
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-rose-500 hover:bg-rose-500 hover:text-white font-black text-sm transition-all text-left"
                        >
                          <LogOut size={20} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link
                    href="/login"
                    className="text-sm font-black uppercase tracking-widest text-muted-text hover:text-foreground transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-10 py-4 bg-foreground text-background rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-2xl"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
