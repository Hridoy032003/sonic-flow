"use client";

import { useApi } from "@/hooks/useApi";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus, Music, Play, Eye, EyeOff, MoreHorizontal, LayoutGrid,
  List as ListIcon, Search, Upload, Link as LinkIcon, Image as ImageIcon,
  CheckCircle2, AlertCircle, X, Loader2, Music2, Headphones, Globe, Database
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";

export default function AdminMusic() {
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");

  const [adding, setAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [audioMethod, setAudioMethod] = useState<"link" | "file">("link");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [musicList, setMusicList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const observerTarget = useRef(null);

  const fetchMusic = async (pageNum: number, reset = false, query = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/music?page=${pageNum}&limit=15&search=${query}`);
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
    setPage(1);
    fetchMusic(1, true, debouncedSearch);
  }, [debouncedSearch]);

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
    if (page > 1) fetchMusic(page, false, debouncedSearch);
  }, [page]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload/music", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) setSrcUrl(data.url);
    } catch (err) {
      console.error("Audio upload failed:", err);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        setArtworkUrl(data.secure_url);
      } else {
        console.error("Cloudinary Error:", data);
        toast.error(`Artwork Upload Failed: ${data.error?.message || "Check settings"}`);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("System Error: Could not connect to Cloudinary.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        setBannerUrl(data.secure_url);
      } else {
        console.error("Cloudinary Error:", data);
        toast.error(`Banner Upload Failed: ${data.error?.message || "Check settings"}`);
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
      toast.error("System Error: Could not connect to Cloudinary.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !srcUrl) return;
    setAdding(true);
    try {
      await fetch("/api/admin/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, srcUrl, artworkUrl, bannerUrl, categoryId }),
      });
      setTitle(""); setArtist(""); setSrcUrl(""); setArtworkUrl(""); setBannerUrl(""); setCategoryId("");
      setShowAddModal(false);
      fetchMusic(1, true);
      toast.success("Content deployed successfully!");
    } catch (err) {
      toast.error("Deployment failed");
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
      toast.success(`Track status set to ${status}`);
    } catch (err) {
      toast.error("Update failed");
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
          artworkUrl: editingTrack.artworkUrl,
          categoryId: editingTrack.categoryId
        }),
      });
      setMusicList(prev => prev.map(m => m.id === editingTrack.id ? { ...m, ...editingTrack } : m));
      setEditingTrack(null);
      toast.success("Track metadata synchronized!");
    } catch (err) {
      toast.error("Synchronization failed");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 relative px-4 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            Sonic Library <span className="text-indigo-600">Admin</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold flex items-center gap-2">
            <Headphones size={16} className="text-indigo-400" />
            Managing {total} high-fidelity audio streams
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Content
        </button>
      </div>

      {/* Library Stats / Search */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white shadow-xl overflow-hidden p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="relative w-full lg:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl border-none shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-black tracking-tight"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-4 rounded-2xl bg-white text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><LayoutGrid size={20} /></button>
            <button className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"><ListIcon size={20} /></button>
          </div>
        </div>
      </div>

      {/* Music Table */}
      <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Track Architecture</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {musicList.map((track) => (
                <tr key={track.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-[24px] overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform">
                        {track.artworkUrl ? (
                          <img src={track.artworkUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><Music size={24} /></div>
                        )}
                        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-colors flex items-center justify-center">
                          <Play size={20} className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" fill="currentColor" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{track.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{track.artist || "Anonymous"}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <span className="text-[11px] font-black text-indigo-500/60 uppercase tracking-widest">{track.category?.name || "Global"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <button
                      disabled={updating === track.id}
                      onClick={() => updateStatus(track.id, track.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")}
                      className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 ${track.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-lg shadow-emerald-500/5'
                          : 'bg-amber-50 text-amber-600 border-amber-100 shadow-lg shadow-amber-500/5'
                        }`}
                    >
                      {track.status === 'PUBLISHED' ? <Eye size={14} strokeWidth={3} /> : <EyeOff size={14} strokeWidth={3} />}
                      {track.status}
                    </button>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      onClick={() => setEditingTrack(track)}
                      className="p-4 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 active:scale-90"
                    >
                      <MoreHorizontal size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div ref={observerTarget} className="h-20 w-full" />
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
          <div className="bg-white rounded-[48px] shadow-3xl w-full max-w-4xl p-8 lg:p-16 relative animate-in fade-in zoom-in-95 duration-500">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 p-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={20} />
            </button>

            <div className="mb-12">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Deploy Sonic Content</h3>
              <p className="text-slate-500 font-bold mt-2">Initialize a new audio node into the network.</p>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">Identity Architecture</label>
                  <div className="space-y-4">
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-8 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-sm" placeholder="Track Title" />
                    <input value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full px-8 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-sm" placeholder="Artist Name" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">Segment Classification</label>
                  <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-8 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-sm appearance-none">
                    <option value="">Choose segment...</option>
                    {catData?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">Audio Source Channel</label>
                  <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[24px]">
                    <button type="button" onClick={() => setAudioMethod("link")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${audioMethod === 'link' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400'}`}>
                      <LinkIcon size={14} /> Global URL
                    </button>
                    <button type="button" onClick={() => setAudioMethod("file")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${audioMethod === 'file' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400'}`}>
                      <Database size={14} /> System Upload
                    </button>
                  </div>

                  {audioMethod === "link" ? (
                    <div className="relative mt-4">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="url" value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-sm text-indigo-600" placeholder="https://..." />
                    </div>
                  ) : (
                    <div className="mt-4 relative group">
                      <input type="file" accept="audio/*" onChange={handleAudioUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className={`w-full py-10 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${srcUrl && !uploadingAudio ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50/30'}`}>
                        {uploadingAudio ? (
                          <Loader2 size={32} className="text-indigo-600 animate-spin" />
                        ) : srcUrl ? (
                          <CheckCircle2 size={32} className="text-emerald-500" />
                        ) : (
                          <Upload size={32} className="text-slate-300" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {uploadingAudio ? 'Uploading Stream...' : srcUrl ? 'Audio Encoded' : 'Select Audio Node'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">Cinematic Banner (21:9)</label>
                  <div className="relative w-full aspect-[21/9] rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group">
                    {bannerUrl ? (
                      <div className="relative w-full h-full group">
                        <img src={bannerUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setBannerUrl("")} className="bg-white text-rose-500 p-3 rounded-full shadow-2xl"><X size={16} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 flex flex-col items-center gap-2">
                        <div className={`p-4 rounded-full transition-all ${uploadingBanner ? 'bg-indigo-100' : 'bg-white shadow-xl group-hover:bg-indigo-50'}`}>
                          {uploadingBanner ? <Loader2 className="text-indigo-600 animate-spin" /> : <Upload className="text-slate-300" size={24} />}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {uploadingBanner ? 'Deploying Banner...' : 'Upload Track Banner'}
                        </p>
                        <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2">Artwork Visuals (Cloudinary)</label>
                  <div className="relative aspect-square rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group">
                    {artworkUrl ? (
                      <div className="relative w-full h-full group">
                        <img src={artworkUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setArtworkUrl("")} className="bg-white text-rose-500 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={20} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-10 flex flex-col items-center gap-4">
                        <div className={`p-6 rounded-full transition-all ${uploadingImage ? 'bg-indigo-100' : 'bg-white shadow-xl group-hover:bg-indigo-50'}`}>
                          {uploadingImage ? <Loader2 className="text-indigo-600 animate-spin" /> : <ImageIcon className="text-slate-300" size={32} />}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-[150px]">
                          {uploadingImage ? 'Uploading Visual...' : 'Click or drop to upload track art'}
                        </p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={adding || uploadingAudio || uploadingImage} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]">
                    {adding ? 'Synchronizing...' : 'Push to Network'}
                    {!adding && <Play size={18} fill="currentColor" />}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal (Standard) */}
      {editingTrack && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] shadow-3xl w-full max-w-2xl p-10 lg:p-12 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setEditingTrack(null)} className="absolute top-8 right-8 p-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400"><X size={18} /></button>

            <div className="mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Modify Metadata</h3>
              <p className="text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-widest">Node ID: {editingTrack.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Title</label>
                  <input value={editingTrack.title} onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Title" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Artist</label>
                  <input value={editingTrack.artist} onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Artist" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Source URL</label>
                  <input value={editingTrack.srcUrl} onChange={(e) => setEditingTrack({ ...editingTrack, srcUrl: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-600" placeholder="Source URL" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Artwork Visual</label>
                <div className="relative aspect-square rounded-[32px] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden group">
                  {editingTrack.artworkUrl ? (
                    <div className="w-full h-full relative">
                      <img src={editingTrack.artworkUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => setEditingTrack({ ...editingTrack, artworkUrl: "" })} className="bg-white text-rose-500 p-3 rounded-full shadow-xl"><X size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                      <div className="p-4 rounded-full bg-white shadow-lg text-slate-300">
                        {uploadingImage ? <Loader2 className="animate-spin text-indigo-600" /> : <ImageIcon size={24} />}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Artwork</p>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");
                          const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (res.ok && data.secure_url) {
                            setEditingTrack({ ...editingTrack, artworkUrl: data.secure_url });
                          } else {
                            toast.error(`Update Failed: ${data.error?.message || "Check settings"}`);
                          }
                        } finally {
                          setUploadingImage(false);
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>

                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2 block mt-6">Track Banner (21:9)</label>
                <div className="relative aspect-[21/9] rounded-[24px] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden group">
                  {editingTrack.bannerUrl ? (
                    <div className="w-full h-full relative">
                      <img src={editingTrack.bannerUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => setEditingTrack({ ...editingTrack, bannerUrl: "" })} className="bg-white text-rose-500 p-3 rounded-full shadow-xl"><X size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2">
                      <div className="p-3 rounded-full bg-white shadow-lg text-slate-300">
                        {uploadingBanner ? <Loader2 className="animate-spin text-indigo-600" size={16} /> : <Upload size={16} />}
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update Banner</p>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingBanner(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");
                          const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (res.ok && data.secure_url) {
                            setEditingTrack({ ...editingTrack, bannerUrl: data.secure_url });
                          } else {
                            toast.error(`Banner Update Failed: ${data.error?.message || "Check settings"}`);
                          }
                        } finally {
                          setUploadingBanner(false);
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-10 mt-6 border-t border-slate-100">
              <button type="button" onClick={() => setEditingTrack(null)} className="flex-1 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">Discard</button>
              <button onClick={handleUpdate} disabled={updating === editingTrack.id} className="flex-1 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                {updating === editingTrack.id ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
