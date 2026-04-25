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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-7xl">
      <div className="glass rounded-[24px] px-8 h-20 flex items-center justify-between shadow-2xl shadow-indigo-500/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg">
            <Music size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">SonicFlow</span>
        </Link>

        <div className="flex items-center gap-8">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-6">
                  <nav className="hidden md:flex items-center gap-8 mr-4 border-r border-slate-200/50 pr-8">
                    <Link href="/" className={`text-sm font-bold transition-colors ${pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Explore</Link>
                    <Link href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">Library</Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
                        <Shield size={14} className="text-indigo-500" /> Admin
                      </Link>
                    )}
                  </nav>

                  <div className="relative">
                    <button 
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/50 border border-white/50 hover:bg-white transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Account</p>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[120px] mt-1">{user.email.split('@')[0]}</p>
                      </div>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {menuOpen && (
                      <div className="absolute top-full right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
                        <Link 
                          href="/profile" 
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-600 hover:bg-white/50 font-bold text-sm transition-all"
                        >
                          <User size={18} className="text-slate-400" /> View Profile
                        </Link>
                        <button 
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-50/50 font-bold text-sm transition-all text-left"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl"
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
