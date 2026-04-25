"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield, Calendar, Music, Heart, Settings, Bell, ChevronRight, LogOut, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 pt-32">
      <div className="max-w-6xl mx-auto px-8">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
             <Sparkles size={16} /> Member Dashboard
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight leading-tight">Account Profile</h1>
          <p className="text-muted-text mt-3 font-bold text-lg">Manage your personal settings and music preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass rounded-[40px] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="w-32 h-32 bg-primary rounded-[32px] mx-auto flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-8">
                {user.email[0].toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-foreground truncate">{user.email.split('@')[0]}</h2>
              <p className="text-sm text-muted-text font-bold mt-2">{user.email}</p>
              
              <div className="mt-8 pt-8 border-t border-border">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'ADMIN' ? 'bg-indigo-500 text-white' : 'bg-secondary text-muted-text'
                }`}>
                  <Shield size={14} />
                  {user.role} Account
                </div>
              </div>
            </div>

            <div className="glass rounded-[40px] p-3">
              <button className="w-full flex items-center justify-between px-8 py-5 rounded-[28px] bg-primary text-white font-black text-sm shadow-xl shadow-primary/20">
                <div className="flex items-center gap-4">
                  <User size={20} /> Account Info
                </div>
                <ChevronRight size={18} />
              </button>
              <button className="w-full flex items-center justify-between px-8 py-5 rounded-[28px] text-muted-text hover:text-foreground hover:bg-secondary font-black text-sm transition-all mt-1">
                <div className="flex items-center gap-4">
                  <Bell size={20} /> Notifications
                </div>
                <ChevronRight size={18} />
              </button>
              <button className="w-full flex items-center justify-between px-8 py-5 rounded-[28px] text-muted-text hover:text-foreground hover:bg-secondary font-black text-sm transition-all mt-1">
                <div className="flex items-center gap-4">
                  <Settings size={20} /> Preferences
                </div>
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between px-8 py-5 rounded-[28px] text-rose-500 hover:bg-rose-500 hover:text-white font-black text-sm transition-all mt-6"
              >
                <div className="flex items-center gap-4">
                  <LogOut size={20} /> Sign Out
                </div>
              </button>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12">
            <div className="glass rounded-[50px] p-12">
              <h3 className="text-2xl font-black text-foreground mb-10 flex items-center gap-3">
                 <div className="w-2 h-8 bg-indigo-500 rounded-full"></div> Personal Details
              </h3>
              
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-text uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <div className="flex items-center gap-4 px-8 py-5 bg-secondary rounded-[24px] text-foreground font-bold text-sm border border-border shadow-inner">
                      <Mail size={18} className="text-primary" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-text uppercase tracking-[0.2em] ml-2">Member Since</label>
                    <div className="flex items-center gap-4 px-8 py-5 bg-secondary rounded-[24px] text-foreground font-bold text-sm border border-border shadow-inner">
                      <Calendar size={18} className="text-primary" />
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-border">
                  <button className="bg-foreground text-background px-12 py-5 rounded-[24px] font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
                    Edit Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass rounded-[40px] p-10 group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-indigo-500 rounded-[20px] flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                  <Music size={28} />
                </div>
                <h4 className="text-xl font-black text-foreground">Listening History</h4>
                <p className="text-sm text-muted-text mt-3 font-bold leading-relaxed">Review the tracks you've streamed recently in your personalized log.</p>
              </div>
              <div className="glass rounded-[40px] p-10 group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-rose-500 rounded-[20px] flex items-center justify-center text-white mb-8 shadow-xl shadow-rose-500/20 group-hover:rotate-12 transition-transform">
                  <Heart size={28} />
                </div>
                <h4 className="text-xl font-black text-foreground">Favorite Tracks</h4>
                <p className="text-sm text-muted-text mt-3 font-bold leading-relaxed">Access your hand-picked collection of top-tier favorite music.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
