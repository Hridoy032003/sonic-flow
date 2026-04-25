"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Music, LogOut, LogIn, UserPlus, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-7xl mx-auto glass rounded-[24px] px-6 h-16 flex items-center justify-between shadow-lg shadow-sky-500/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-sky-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-sky-500/20">
            <Music size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">Sonic<span className="text-sky-500">Flow</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-full border border-sky-100">
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                    <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                      {user.email.split("@")[0]}
                    </span>
                  </div>
                  
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors"
                    >
                      <Shield size={16} />
                      Admin
                    </Link>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                  >
                    Sign Up
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
