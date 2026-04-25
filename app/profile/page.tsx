"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield, Calendar, Music, Heart, Settings, Bell, ChevronRight, LogOut } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your personal settings and music preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm">
              <div className="w-24 h-24 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20 mb-6">
                {user.email[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900 truncate">{user.email.split('@')[0]}</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">{user.email}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Shield size={12} />
                  {user.role} Account
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
              <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50 text-indigo-600 font-bold text-sm">
                <div className="flex items-center gap-3">
                  <User size={18} /> Account Info
                </div>
                <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all">
                <div className="flex items-center gap-3">
                  <Bell size={18} /> Notifications
                </div>
                <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all">
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Preferences
                </div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold text-sm transition-all mt-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} /> Sign Out
                </div>
              </button>
            </div>
          </div>

          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-8">Personal Details</h3>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 rounded-2xl text-slate-600 font-medium text-sm border border-slate-100">
                      <Mail size={16} className="text-slate-300" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Member Since</label>
                    <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 rounded-2xl text-slate-600 font-medium text-sm border border-slate-100">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
                    Edit Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm group hover:border-indigo-100 transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                  <Music size={24} />
                </div>
                <h4 className="text-base font-bold text-slate-900">Listening History</h4>
                <p className="text-xs text-slate-400 mt-2 font-medium">Review the tracks you've streamed recently.</p>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm group hover:border-rose-100 transition-all">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h4 className="text-base font-bold text-slate-900">Favorite Tracks</h4>
                <p className="text-xs text-slate-400 mt-2 font-medium">Access your curated collection of liked music.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
