"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { AudioPlayer } from "@/components/tool-ui/audio";
import { MusicCard } from "@/components/tool-ui/music-card";
import { Search, Music, Disc, List, Sparkles, Headphones, Download, Heart, MoreHorizontal } from "lucide-react";

export default function Home() {
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  const { data: musicData, loading } = useApi<{ music: any[] }>("/api/music");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<any>(null);

  const filteredMusic = selectedCategory 
    ? musicData?.music.filter(m => m.categoryId === selectedCategory)
    : musicData?.music;

  return (
    <div className="min-h-screen pt-32 pb-32 flex gap-10 px-8 max-w-[1700px] mx-auto transition-colors duration-300">
      {/* Glass Sidebar */}
      <aside className="w-80 glass rounded-[40px] p-10 flex flex-col gap-10 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto hidden lg:flex shadow-2xl border-white/10">
        <div className="flex items-center gap-3 px-2 mb-4">
           <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
           <h2 className="text-2xl font-black text-foreground tracking-tight">SonicFlow</h2>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-[0.2em] mb-6 ml-2">Exploration</h3>
          <nav className="space-y-1.5">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-sm font-bold transition-all ${
                !selectedCategory ? "bg-indigo-600 text-white shadow-2xl" : "text-muted-text hover:bg-white/10 hover:text-foreground hover:shadow-sm"
              }`}
            >
              <Music size={20} /> All Music
            </button>
            {catData?.categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-sm font-bold transition-all ${
                  selectedCategory === cat.id ? "bg-indigo-600 text-white shadow-2xl" : "text-muted-text hover:bg-white/10 hover:text-foreground hover:shadow-sm"
                }`}
              >
                <List size={20} /> {cat.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Headphones size={80} /></div>
             <h4 className="font-bold text-lg mb-2 leading-tight">Join Premium</h4>
             <p className="text-xs text-indigo-100 leading-relaxed mb-6 opacity-80">Experience Hi-Fi audio quality and offline mode.</p>
             <button className="w-full bg-white text-indigo-600 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Get Started</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-[1200px]">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
            <div>
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                <Sparkles size={16} /> Seasonal Mixes
              </div>
              <h2 className="text-5xl font-black text-foreground tracking-tight leading-tight">
                {selectedCategory ? catData?.categories.find(c => c.id === selectedCategory)?.name : "Personal Discovery"}
              </h2>
            </div>
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Find your favorite tracks..." 
                className="w-full pl-14 pr-8 py-5 bg-secondary/50 border border-border rounded-[32px] outline-none focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold shadow-xl backdrop-blur-md text-foreground placeholder:text-muted-text" 
              />
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] glass rounded-[40px] animate-pulse"></div>
              ))}
            </div>
          ) : filteredMusic?.length === 0 ? (
            <div className="glass rounded-[50px] border border-dashed border-border py-40 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Music size={40} className="text-muted-text" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">No tracks in this vibe.</h3>
              <p className="text-muted-text font-medium mb-8">Try exploring another category or return to all music.</p>
              <button onClick={() => setSelectedCategory(null)} className="px-8 py-3 bg-foreground text-background rounded-2xl font-bold text-sm shadow-xl">Explore All</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredMusic?.map((track) => (
                  <MusicCard 
                    key={track.id}
                    title={track.title}
                    artist={track.artist || "SonicFlow Studio"}
                    isActive={activeTrack?.id === track.id}
                    onClick={() => setActiveTrack(track)}
                  />
               ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Modern Player */}
      {activeTrack && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-[120] animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <div className="glass rounded-[50px] p-6 shadow-2xl">
            <AudioPlayer 
              track={{
                title: activeTrack.title,
                artist: activeTrack.artist || "SonicFlow Studio",
                src: activeTrack.srcUrl,
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}