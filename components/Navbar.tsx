"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Music, LogOut, Shield, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] w-full pt-[env(safe-area-inset-top)] px-2 md:px-16 lg:px-24 xl:px-32">
      <div className="glass rounded-b-[40px] px-8 h-24 flex items-center justify-between shadow-2xl border-t-0 max-w-[1900px] mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/primeryLogo.png" alt="SonicFlow Logo" className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
        </Link>

        <div className="flex items-center gap-10">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-8">
                  <nav className="hidden md:flex items-center gap-10 mr-6 border-r border-border pr-10">
                    <Link href="/" className={`text-sm font-black uppercase tracking-widest transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-text hover:text-foreground'}`}>Explore</Link>
                    {/* <Link href="#" className="text-sm font-black uppercase tracking-widest text-muted-text hover:text-foreground">Library</Link> */}
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="text-sm font-black uppercase tracking-widest text-muted-text hover:text-foreground flex items-center gap-2">
                        <Shield size={16} className="text-primary" /> Admin
                      </Link>
                    )}
                  </nav>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-3 p-1 pr-4 rounded-[24px] bg-white/40 border border-white/60 hover:bg-white/80 transition-all group shadow-xl"
                    >
                      {/* <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20">
                        {user?.email[0].toUpperCase() || null}
                      </div> */}
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md border border-white/20 relative">
                        <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                        {user.image ? (
                          <img
                            src={user.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.email?.[0]?.toUpperCase() || null
                        )}
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-[12px] font-black text-foreground truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
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
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                            toast.success("Signed out successfully");
                          }}
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
