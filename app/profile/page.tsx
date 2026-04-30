"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User, Mail, Shield, Calendar, Music, Heart, Settings,
  Bell, ChevronRight, LogOut, Sparkles, Edit3, Save, X, Play
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "history" | "favorites">("info");

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/login");
    }
  }, [authUser, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setProfileData(data.user);
        setName(data.user.name || "");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const handleUpdateName = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setProfileData((prev: any) => ({ ...prev, name }));
        setEditing(false);
      }
    } catch (error) {
      console.error("Update name error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !authUser) {
    return <LoadingScreen />;
  }

  const user = profileData || authUser;

  return (
    <div className="min-h-screen pb-32 pt-32">
      <div className="max-w-6xl mx-auto sm:px-8 px-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8 lg:sticky lg:top-32">
            <div className="glass rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Premium Avatar */}
              <div className="relative mx-auto w-32 h-32 lg:w-40 lg:h-40 mb-6 lg:mb-8 p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-700">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-4xl lg:text-5xl font-black overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                  {user.image ? (
                    <img src={user.image} className="w-full h-full object-cover" />
                  ) : (
                    user.email[0].toUpperCase()
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-10 -z-10"></div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black text-foreground truncate drop-shadow-sm">{user.name || user.email.split('@')[0]}</h2>
              <p className="text-[12px] lg:text-sm text-muted-text font-black mt-2 lg:mt-3 uppercase tracking-widest opacity-60">{user.email}</p>

              <div className="mt-8 lg:mt-10 pt-8 lg:pt-10 border-t border-border/50">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-indigo-500 rounded-full animate-[bounce_1s_infinite]"></div>
                    <div className="w-1 h-5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_100ms]"></div>
                    <div className="w-1 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                  </div>
                  <div className={`px-4 lg:px-5 py-2 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] shadow-lg ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-white/40 text-indigo-600 border border-indigo-500/20'
                    }`}>
                    <Shield size={12} className="inline mr-2 -mt-0.5" />
                    {user.role} Status
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-[32px] lg:rounded-[48px] p-2 lg:p-4 shadow-xl">
              <div className="space-y-1">
                {[
                  { id: "info", label: "Account Info", icon: User },
                  { id: "favorites", label: "My Favorites", icon: Heart },
                  { id: "history", label: "Play History", icon: Music },
                  { id: "settings", label: "Preferences", icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-6 lg:px-8 py-4 lg:py-5 rounded-[24px] lg:rounded-[32px] font-black text-sm transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30'
                        : 'text-muted-text hover:text-foreground hover:bg-white/40'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon size={18} className={activeTab === tab.id ? "animate-pulse" : ""} />
                      {tab.label}
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-1' : 'opacity-40'}`} />
                  </button>
                ))}

                <div className="pt-4 mt-2 border-t border-border/50">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-between px-6 lg:px-8 py-4 lg:py-5 rounded-[24px] lg:rounded-[32px] text-rose-500 hover:bg-rose-500 hover:text-white font-black text-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> Sign Out
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-12">
            {activeTab === "info" && (
              <div className="glass rounded-[40px] lg:rounded-[56px] p-6 lg:p-16 animate-in fade-in lg:slide-in-from-right-8 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10"></div>

                <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-8 lg:mb-12 flex items-center gap-4">
                  <div className="w-2 h-8 lg:w-2.5 lg:h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/20"></div>
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] lg:text-[12px] font-black text-indigo-600/60 uppercase tracking-[0.3em] ml-4">Display Identity</label>
                    <div className="relative group">
                      {editing ? (
                        <div className="flex flex-col gap-3">
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 lg:px-8 py-4 lg:py-5 bg-white/40 backdrop-blur-md rounded-[24px] lg:rounded-[28px] text-foreground font-black text-sm border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 outline-none transition-all focus:scale-[1.02]"
                            placeholder="Enter your name"
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setEditing(false); setName(user.name || ""); }} className="bg-white/20 text-muted-text px-5 py-2.5 rounded-full font-black text-xs hover:bg-white/40 transition-all">
                              Cancel
                            </button>
                            <button onClick={handleUpdateName} disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                              {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 bg-white/20 backdrop-blur-sm rounded-[24px] lg:rounded-[32px] text-foreground font-black text-sm border border-white/40 shadow-xl group-hover:bg-white/40 transition-all">
                          <div className="flex items-center gap-4 lg:gap-5">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                              <Edit3 size={18} />
                            </div>
                            <span className="opacity-90 truncate">{user.name || "Not set"}</span>
                          </div>
                          <button onClick={() => setEditing(true)} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:scale-110 ml-2">Edit</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] lg:text-[12px] font-black text-indigo-600/60 uppercase tracking-[0.3em] ml-4">Primary Email</label>
                    <div className="flex items-center gap-4 lg:gap-5 px-6 lg:px-8 py-5 lg:py-6 bg-white/20 backdrop-blur-sm rounded-[24px] lg:rounded-[32px] text-foreground font-black text-sm border border-white/40 shadow-xl opacity-70">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Mail size={18} />
                      </div>
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 lg:mt-16 pt-8 lg:pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-muted-text text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-60">
                    <Calendar size={14} className="text-indigo-500" /> Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-indigo-500/20"></div>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="glass rounded-[40px] lg:rounded-[56px] p-8 lg:p-16 animate-in fade-in lg:slide-in-from-right-8 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -z-10"></div>
                <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-10 flex items-center gap-4">
                  <div className="w-2.5 h-10 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/20"></div>
                  Favorite Library
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {user.favorites?.length > 0 ? (
                    user.favorites.map((fav: any) => (
                      <div key={fav.id} className="group relative flex items-center justify-between p-4 lg:p-6 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-[32px] border border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg group-hover:rotate-3 transition-transform duration-500 bg-slate-900 flex items-center justify-center text-white">
                             {fav.music.bannerUrl || fav.music.artworkUrl ? (
                               <img src={fav.music.bannerUrl || fav.music.artworkUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                               <>
                                 <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                 <Music size={28} className="opacity-40 group-hover:opacity-100 transition-all" />
                               </>
                             )}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-foreground group-hover:text-rose-600 transition-colors">{fav.music.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[11px] font-black uppercase tracking-widest text-muted-text/60">{fav.music.artist}</span>
                              <div className="w-1 h-1 rounded-full bg-rose-500/30"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">{fav.music.category?.name}</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl group-hover:bg-rose-600 group-hover:text-white">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center glass rounded-[40px] border-dashed border-2 border-white/20">
                      <div className="relative inline-block mb-8">
                        <Heart size={64} className="text-muted-text/10" />
                        <div className="absolute inset-0 animate-ping rounded-full bg-rose-500/5"></div>
                      </div>
                      <p className="text-muted-text font-black text-lg">Your collection is waiting for its first gem.</p>
                      <button onClick={() => router.push("/")} className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">Discover Music</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="glass rounded-[40px] lg:rounded-[56px] p-8 lg:p-16 animate-in fade-in lg:slide-in-from-right-8 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10"></div>
                <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-10 flex items-center gap-4">
                  <div className="w-2.5 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/20"></div>
                  Listening Journey
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {user.history?.length > 0 ? (
                    user.history.map((hist: any) => (
                      <div key={hist.id} className="group relative flex items-center justify-between p-4 lg:p-6 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-[32px] border border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-slate-900 flex items-center justify-center text-white">
                             {hist.music.bannerUrl || hist.music.artworkUrl ? (
                               <img src={hist.music.bannerUrl || hist.music.artworkUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                               <>
                                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-20"></div>
                                 <Play size={24} className="opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                               </>
                             )}
                          </div>
                          <div>
                            <h4 className="font-black text-foreground group-hover:text-indigo-600 transition-colors">{hist.music.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-text/60">{hist.music.artist}</span>
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-indigo-500/40" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-text/40">{new Date(hist.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center hover:bg-foreground hover:text-background transition-all group-hover:border-indigo-500 group-hover:text-indigo-600">
                          <Play size={18} fill="currentColor" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center glass rounded-[40px] border-dashed border-2 border-white/20">
                      <Music size={64} className="mx-auto text-muted-text/10 mb-8" />
                      <p className="text-muted-text font-black text-lg">Your sonic journey hasn't started yet.</p>
                      <button onClick={() => router.push("/")} className="mt-8 text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all">Start Listening</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <button
                  onClick={() => setActiveTab("history")}
                  className="glass rounded-[48px] p-10 group hover:-translate-y-2 transition-all duration-700 text-left w-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[24px] flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
                    <Music size={28} />
                  </div>
                  <h4 className="text-2xl font-black text-foreground mb-3">Listening Stats</h4>
                  <p className="text-sm text-muted-text font-bold leading-relaxed opacity-60">Deep dive into your recent sonic explorations and frequency.</p>
                  <div className="mt-8 flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     View Log <ChevronRight size={14} />
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className="glass rounded-[48px] p-10 group hover:-translate-y-2 transition-all duration-700 text-left w-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -z-10 group-hover:bg-rose-500/10 transition-colors"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[24px] flex items-center justify-center text-white mb-8 shadow-2xl shadow-rose-500/30 group-hover:-rotate-12 transition-transform">
                    <Heart size={28} />
                  </div>
                  <h4 className="text-2xl font-black text-foreground mb-3">Saved Gems</h4>
                  <p className="text-sm text-muted-text font-bold leading-relaxed opacity-60">Quick access to your curated collection of favorite tracks.</p>
                  <div className="mt-8 flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     Open Library <ChevronRight size={14} />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
      
