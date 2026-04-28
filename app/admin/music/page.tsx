"use client";

import { useApi } from "@/hooks/useApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Music, Play, Eye, EyeOff, MoreHorizontal, LayoutGrid, List as ListIcon, Search } from "lucide-react";

export default function AdminMusic() {
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [musicList, setMusicList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const observerTarget = useRef(null);

  const fetchMusic = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/music?page=${pageNum}&limit=15`);
      const data = await res.json();
      if (data.music) {
        setMusicList(prev => reset ? data.music : [...prev, ...data.music]);
        setHasMore(pageNum < data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic(1, true);
  }, []);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(p => p + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page > 1) fetchMusic(page);
  }, [page]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await fetch("/api/admin/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, srcUrl, categoryId }),
      });
      setTitle(""); setArtist(""); setSrcUrl(""); setCategoryId("");
      fetchMusic(1, true);
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/music/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMusicList(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } finally {
      setUpdating(null);
    }
  };

  const [editingTrack, setEditingTrack] = useState<any>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    setUpdating(editingTrack.id);
    try {
      await fetch(`/api/admin/music/${editingTrack.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editingTrack.title, 
          artist: editingTrack.artist, 
          srcUrl: editingTrack.srcUrl, 
          categoryId: editingTrack.categoryId 
        }),
      });
      setMusicList(prev => prev.map(m => m.id === editingTrack.id ? { ...m, ...editingTrack } : m));
      setEditingTrack(null);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Content Library</h1>
          <p className="text-slate-500 mt-1">Manage tracks, visibility, and distribution.</p>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><Plus size={18} /></div>
            Publish New Content
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Track Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" placeholder="e.g. Midnight City" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Artist Name</label>
              <input value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" placeholder="Artist" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Source URL</label>
              <input required type="url" value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-indigo-600" placeholder="https://cdn.sonicflow.com/track.mp3" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assigned Segment</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium appearance-none">
                <option value="">Choose segment...</option>
                {catData?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end mt-4">
              <button type="submit" disabled={adding} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center gap-3">
                {adding ? "Deploying Track..." : "Publish to Library"}
                {!adding && <Play size={16} fill="currentColor" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Library Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {total} Tracks Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Track Detail</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {musicList.map((track) => (
                <tr key={track.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <Music size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{track.title}</p>
                        <p className="text-xs text-slate-400 font-medium">by {track.artist || "Unknown Artist"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      disabled={updating === track.id}
                      onClick={() => updateStatus(track.id, track.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer ${
                        track.status === 'PUBLISHED' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                      }`}
                      title={track.status === "PUBLISHED" ? "Click to Hide" : "Click to Publish"}
                    >
                      {track.status === 'PUBLISHED' ? <Eye size={12} /> : <EyeOff size={12} />}
                      {track.status}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setEditingTrack(track)}
                      className="p-3 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent"
                      title="Edit Track Details"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><div className="h-6 bg-slate-200 rounded-xl w-20"></div></td>
                  <td className="px-8 py-6 text-right"><div className="h-10 bg-slate-200 rounded-2xl w-10 ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="h-10 w-full" />
      </div>

      {/* Edit Modal Popup */}
      {editingTrack && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Update Track</h3>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Track Title</label>
                <input required value={editingTrack.title} onChange={(e) => setEditingTrack({...editingTrack, title: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Artist Name</label>
                <input value={editingTrack.artist} onChange={(e) => setEditingTrack({...editingTrack, artist: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Source URL</label>
                <input required type="url" value={editingTrack.srcUrl} onChange={(e) => setEditingTrack({...editingTrack, srcUrl: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Segment</label>
                <select required value={editingTrack.categoryId || ""} onChange={(e) => setEditingTrack({...editingTrack, categoryId: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium appearance-none">
                  {catData?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingTrack(null)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={updating === editingTrack.id} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
