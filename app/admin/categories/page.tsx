"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, FolderOpen, MoreVertical, Tag, Hash, Calendar } from "lucide-react";

export default function AdminCategories() {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const observerTarget = useRef(null);

  const fetchCategories = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/categories?page=${pageNum}&limit=12`);
      const data = await res.json();
      if (data.categories) {
        setCategoryList(prev => reset ? data.categories : [...prev, ...data.categories]);
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
    fetchCategories(1, true);
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
    if (page > 1) fetchCategories(page);
  }, [page]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      setName("");
      setDescription("");
      fetchCategories(1, true);
    } finally {
      setAdding(false);
    }
  };

  const [editingCat, setEditingCat] = useState<any>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setUpdating(editingCat.id);
    try {
      await fetch(`/api/admin/categories/${editingCat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editingCat.name, 
          description: editingCat.description 
        }),
      });
      setCategoryList(prev => prev.map(c => c.id === editingCat.id ? { ...c, ...editingCat } : c));
      setEditingCat(null);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Music Segments</h1>
          <p className="text-slate-500 mt-1">Organize your library into discoverable categories. ({total} total)</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl text-indigo-200"></div>
        
        <div className="relative">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Tag size={18} />
            </div>
            Create New Segment
          </h3>
          
          <form onSubmit={handleAdd} className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-[1] w-full space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-indigo-400">Segment Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold"
                placeholder="e.g. Synthwave"
              />
            </div>
            <div className="flex-[2] w-full space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                placeholder="Briefly describe this category for discovery..."
              />
            </div>
            <button 
              type="submit" 
              disabled={adding}
              className="w-full lg:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {adding ? "Initializing..." : "Add Segment"}
              <Plus size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryList.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 flex flex-col gap-6 hover:shadow-lg transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <FolderOpen size={28} />
              </div>
              <button onClick={() => setEditingCat(cat)} className="p-2 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit Segment">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                {cat.description || "No description provided for this music segment."}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-indigo-300" />
                {cat.id.slice(0, 6)}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-300" />
                {new Date(cat.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}

        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={`sk-${i}`} className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
              <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
            </div>
            <div>
              <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-16"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-10 w-full" />

      {/* Edit Modal Popup */}
      {editingCat && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Update Segment</h3>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Segment Name</label>
                <input required value={editingCat.name} onChange={(e) => setEditingCat({...editingCat, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                <input value={editingCat.description || ""} onChange={(e) => setEditingCat({...editingCat, description: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
              </div>
              <div className="flex gap-4 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingCat(null)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={updating === editingCat.id} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
