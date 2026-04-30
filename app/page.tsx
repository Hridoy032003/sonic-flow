"use client";

import { useApi } from "@/hooks/useApi";
import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { AudioPlayer } from "@/components/tool-ui/audio";
import { MusicCard } from "@/components/tool-ui/music-card";
import { Search, Music, Disc, List, Sparkles, Headphones, Download, Heart, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user: authUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [musicList, setMusicList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  const { settings } = useSettings();
  const [activeTrack, setActiveTrack] = useState<any>(null);

  const fetchMusic = async (page: number, isNew: boolean = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = `/api/music?${new URLSearchParams({
        ...(selectedCategory ? { categoryId: selectedCategory } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        page: page.toString()
      })}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch music");
      }

      if (isNew) setMusicList(data.music || []);
      else setMusicList(prev => [...prev, ...(data.music || [])]);

      if (data.pagination) {
        setHasMore(data.pagination.page < data.pagination.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMusic(1, true);
  }, [selectedCategory, debouncedSearch]);

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMusic(nextPage);
    }
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, currentPage]);

  return (
    <div className="min-h-screen pt-32 pb-48 flex flex-col lg:flex-row gap-12 transition-colors duration-300">
      {/* Glass Sidebar (Desktop only) */}
      <aside className="w-80 glass rounded-[40px] p-10 flex flex-col gap-10 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto hidden lg:flex shadow-2xl border-white/10">
        <div>
          <h3 className="text-[12px] font-bold text-muted-text uppercase tracking-[0.2em] mb-6 ml-2">Exploration</h3>
          <nav className="space-y-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-sm font-bold transition-all ${!selectedCategory ? "bg-indigo-600 text-white shadow-2xl" : "text-muted-text hover:bg-white/10 hover:text-foreground hover:shadow-sm"
                }`}
            >
              <Music size={20} /> All Music
            </button>
            {catData?.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-sm font-bold transition-all ${selectedCategory === cat.id ? "bg-indigo-600 text-white shadow-2xl" : "text-muted-text hover:bg-white/10 hover:text-foreground hover:shadow-sm"
                  }`}
              >
                <List size={20} /> {cat.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          {settings?.askSubscription !== false && (
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Headphones size={80} /></div>
              <h4 className="font-bold text-lg mb-2 leading-tight">Join Premium</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-6 opacity-80">Experience Hi-Fi audio quality and offline mode.</p>
              <button className="w-full bg-white text-indigo-600 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Get Started</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="w-full">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
            <div>
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[12px] uppercase tracking-[0.3em] mb-4">
                <Sparkles size={16} /> Seasonal Mixes
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                {selectedCategory ? catData?.categories.find(c => c.id === selectedCategory)?.name : "Personal Discovery"}
              </h2>
            </div>
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Find your favorite tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-secondary/50 border border-border rounded-[32px] outline-none focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold shadow-xl backdrop-blur-md text-foreground placeholder:text-muted-text"
              />
            </div>
          </header>

          {loading && musicList.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass rounded-[24px] p-4 flex flex-col items-center animate-pulse">
                  <div className="w-full aspect-square rounded-[20px] bg-slate-200/50 mb-3"></div>
                  <div className="h-3 w-2/3 bg-slate-200/50 rounded-full mb-2"></div>
                  <div className="h-2 w-1/3 bg-slate-200/50 rounded-full mb-4"></div>
                  <div className="w-full h-8 bg-slate-200/50 rounded-xl mt-auto"></div>
                </div>
              ))}
            </div>
          ) : musicList.length === 0 ? (
            <div className="glass rounded-[50px] border border-dashed border-border py-40 text-center px-6">
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Music size={40} className="text-muted-text" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">No tracks in this vibe.</h3>
              <p className="text-muted-text font-medium mb-8">Try exploring another category or return to all music.</p>
              <button onClick={() => setSelectedCategory(null)} className="px-8 py-3 bg-foreground text-background rounded-2xl font-bold text-sm shadow-xl">Explore All</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {musicList.map((track) => (
                  <MusicCard
                    key={track.id}
                    {...track}
                    isActive={activeTrack?.id === track.id}
                    isLoggedIn={!!authUser}
                    onClick={() => {
                      setActiveTrack(track);
                      fetch("/api/music/history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ musicId: track.id }),
                      }).catch(() => { });
                    }}
                  />
                ))}

                {/* Additional Skeletons while loading more */}
                {loading && hasMore && [1, 2, 3, 4, 5].map(i => (
                  <div key={`extra-${i}`} className="glass rounded-[24px] p-4 flex flex-col items-center animate-pulse">
                    <div className="w-full aspect-square rounded-[20px] bg-slate-200/50 mb-3"></div>
                    <div className="h-3 w-2/3 bg-slate-200/50 rounded-full mb-2"></div>
                    <div className="h-2 w-1/3 bg-slate-200/50 rounded-full mb-4"></div>
                    <div className="w-full h-8 bg-slate-200/50 rounded-xl mt-auto"></div>
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="flex items-center justify-center">
                {!loading && hasMore && (
                  <div className="flex gap-2 opacity-20">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Floating Category Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-[140] mb-[env(safe-area-inset-bottom)]">
        <div className="glass rounded-[32px] p-2 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xl border-white/20">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-6 py-3 rounded-[24px] text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!selectedCategory ? "bg-indigo-600 text-white shadow-lg" : "text-muted-text hover:bg-white/10"}`}
          >
            All Music
          </button>
          {catData?.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-[24px] text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat.id ? "bg-indigo-600 text-white shadow-lg" : "text-muted-text hover:bg-white/10"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Modern Player */}
      {activeTrack && (
        <div className="fixed bottom-[110px] lg:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 md:px-8 z-[120] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="glass rounded-[32px] md:rounded-[50px] p-3 md:p-6 shadow-2xl border-white/20">
            <AudioPlayer
              track={{
                id: activeTrack.id,
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
