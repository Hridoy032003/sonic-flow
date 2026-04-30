"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Music, FolderOpen, ArrowLeft, Settings, Bell, Search } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return <div className="p-8 text-center text-slate-500 font-medium">Authenticating Admin...</div>;
  }

  const navItems = [
    { href: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/admin/users", icon: <Users size={18} />, label: "User Management" },
    { href: "/admin/categories", icon: <FolderOpen size={18} />, label: "Music Segments" },
    { href: "/admin/music", icon: <Music size={18} />, label: "Library Content" },
    { href: "/admin/settings", icon: <Settings size={18} />, label: "Global Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 admin-sidebar text-white hidden md:flex flex-col fixed inset-y-0 shadow-2xl z-50">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
              <Music size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">SonicFlow</h2>
              <p className="text-[12px] text-indigo-300 font-semibold uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`${isActive ? "text-white" : "group-hover:text-indigo-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Public View
          </Link>
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{user?.email}</p>
              <p className="text-[12px] text-slate-500 uppercase">System Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records, tracks or users..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
