"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Plus, FolderOpen, MoreVertical, Tag, Hash, Calendar } from "lucide-react";

export default function AdminCategories() {
  const { data, loading, refetch } = useApi<{ categories: any[] }>("/api/categories");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
      await refetch();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Music Segments</h1>
        <p className="text-slate-500 mt-1">Organize your library into discoverable categories.</p>
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
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
              <div className="h-6 bg-slate-100 rounded-lg w-1/2"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-3/4"></div>
            </div>
          ))
        ) : (
          data?.categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 flex flex-col gap-6 hover:shadow-lg transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <FolderOpen size={28} />
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
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
          ))
        )}
      </div>
    </div>
  );
}
