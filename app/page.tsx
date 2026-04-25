"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { AudioPlayer } from "@/components/tool-ui/audio";
import { Music, Search, Heart, Play, Download, MoreHorizontal, Headphones, Disc, Sparkles, Clock, List } from "lucide-react";

export default function Home() {
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  const { data: musicData, loading } = useApi<{ music: any[] }>("/api/music");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<any>(null);

  const filteredMusic = selectedCategory 
    ? musicData?.music.filter(m => m.categoryId === selectedCategory)
    : musicData?.music;

  return (
    <div className="min-h-screen pt-24 pb-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Professional Header Section */}
        <header className="mb-12 relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm p-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 rounded-full blur-[100px] -mr-32 -mt-32 opacity-60"></div>
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Featured Stream
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Experience Music <br />in <span className="text-sky-500">Crystal Clarity.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mb-8 leading-relaxed">
              SonicFlow delivers the highest quality streaming experience with localized segments and offline playback support.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
                Listen Now
              </button>
              <button className="bg-white text-slate-600 px-8 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                Browse Library
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 h-80 relative shrink-0">
             <div className="absolute inset-0 bg-sky-500/10 rounded-[40px] rotate-6"></div>
             <div className="absolute inset-0 bg-white border border-slate-100 rounded-[40px] shadow-2xl flex items-center justify-center -rotate-3 overflow-hidden">
                <div className="text-sky-500/10"><Music size={200} strokeWidth={1} /></div>
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-sky-500 to-sky-400 text-white">
                   <p className="font-bold text-lg">Top Trending</p>
                   <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Global Playlist 2026</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Music Library</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    !selectedCategory ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-sky-600"
                  }`}
                >
                  <Disc size={18} /> Discover All
                </button>
                {catData?.categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === cat.id ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-sky-600"
                    }`}
                  >
                    <List size={18} /> {cat.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Headphones size={80} /></div>
               <h4 className="font-bold text-xl mb-2">Sonic Premium</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">Enjoy ad-free music, offline listening, and Hi-Fi audio quality.</p>
               <button className="w-full bg-sky-500 py-3 rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors">Upgrade Now</button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedCategory ? catData?.categories.find(c => c.id === selectedCategory)?.name : "Trending Collections"}
              </h2>
              <div className="relative group w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search artist or title..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all text-sm font-medium" 
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-50"></div>
                ))}
              </div>
            ) : filteredMusic?.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 py-24 text-center">
                <Music size={48} className="mx-auto text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold">This collection is currently empty.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-50">
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Title / Artist</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Duration</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredMusic?.map((track, i) => (
                          <tr 
                            key={track.id} 
                            onClick={() => setActiveTrack(track)}
                            className={`hover:bg-sky-50/30 cursor-pointer transition-colors group ${activeTrack?.id === track.id ? "bg-sky-50/50" : ""}`}
                          >
                             <td className="px-6 py-4 text-sm font-bold text-slate-300 w-12">{i + 1}</td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                      activeTrack?.id === track.id ? "bg-sky-500 text-white scale-110 shadow-lg shadow-sky-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500"
                                   }`}>
                                      {activeTrack?.id === track.id ? (
                                         <div className="flex items-center gap-0.5">
                                            <div className="w-1 h-3 bg-white animate-[bounce_0.8s_infinite]"></div>
                                            <div className="w-1 h-5 bg-white animate-[bounce_0.8s_infinite_100ms]"></div>
                                            <div className="w-1 h-2 bg-white animate-[bounce_0.8s_infinite_200ms]"></div>
                                         </div>
                                      ) : (
                                         <Play size={16} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                      {!activeTrack?.id === track.id && <Music size={18} className="group-hover:hidden" />}
                                   </div>
                                   <div className="overflow-hidden">
                                      <p className={`font-bold text-sm truncate ${activeTrack?.id === track.id ? "text-sky-600" : "text-slate-900"}`}>{track.title}</p>
                                      <p className="text-xs text-slate-400 font-semibold">{track.artist || "Standard Session"}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-xs font-bold text-slate-400 hidden md:table-cell flex items-center gap-2">
                                <Clock size={14} className="opacity-50" /> 3:45
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="text-slate-300 hover:text-rose-500 transition-colors"><Heart size={18} /></button>
                                   <button className="text-slate-300 hover:text-sky-500 transition-colors"><Download size={18} /></button>
                                   <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal size={18} /></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Modern Player */}
      {activeTrack && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-[100] animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 shadow-sky-500/5">
            <AudioPlayer 
              track={{
                title: activeTrack.title,
                artist: activeTrack.artist || "SonicFlow Session",
                src: activeTrack.srcUrl,
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}