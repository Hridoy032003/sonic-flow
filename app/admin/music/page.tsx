"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Plus, Music, Play, Eye, EyeOff, MoreHorizontal, LayoutGrid, List as ListIcon, Search } from "lucide-react";

export default function AdminMusic() {
  const { data: musicData, loading, refetch } = useApi<{ music: any[] }>("/api/music");
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

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
      await refetch();
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
      await refetch();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Content Library</h1>
          <p className="text-slate-500 mt-1">Manage tracks, visibility, and distribution.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><LayoutGrid size={20} /></button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><ListIcon size={20} /></button>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        
        <div className="relative">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Plus size={18} />
            </div>
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
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Filter library..." className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/10" />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {musicData?.music.length || 0} Tracks Total
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Rebuilding content indexes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Track Detail</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Audio Stream</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {musicData?.music.map((track) => (
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
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                        track.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {track.status === 'PUBLISHED' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {track.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 font-mono max-w-[200px] truncate block">
                        {track.srcUrl}
                      </code>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={updating === track.id}
                          onClick={() => updateStatus(track.id, track.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")}
                          className="p-3 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm border border-transparent hover:border-indigo-100"
                          title={track.status === "PUBLISHED" ? "Hide from Public" : "Make Visible"}
                        >
                          {track.status === "PUBLISHED" ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button className="p-3 rounded-2xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
