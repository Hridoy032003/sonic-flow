"use client";

import { useApi } from "@/hooks/useApi";
import { Users, Music, FolderOpen, TrendingUp, ArrowUpRight, Activity, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const { data: userData } = useApi<{ users: any[] }>("/api/admin/users");
  const { data: catData } = useApi<{ categories: any[] }>("/api/categories");
  const { data: musicData } = useApi<{ music: any[] }>("/api/music");

  const stats = [
    { 
      label: "Total Users", 
      value: userData?.users.length || 0, 
      change: "+12.5%", 
      icon: <Users size={24} className="text-indigo-600" />, 
      color: "from-indigo-500/10 to-indigo-500/5",
      border: "border-indigo-100"
    },
    { 
      label: "Music Segments", 
      value: catData?.categories.length || 0, 
      change: "+2 new", 
      icon: <FolderOpen size={24} className="text-amber-600" />, 
      color: "from-amber-500/10 to-amber-500/5",
      border: "border-amber-100"
    },
    { 
      label: "Library Tracks", 
      value: musicData?.music.length || 0, 
      change: "+24 today", 
      icon: <Music size={24} className="text-emerald-600" />, 
      color: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-100"
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance and management insights.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white rounded-3xl shadow-sm border ${stat.border} p-8 flex flex-col gap-6 hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
            
            <div className="flex items-center justify-between relative">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                <TrendingUp size={14} />
                {stat.change}
              </div>
            </div>
            
            <div className="relative">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <Activity size={48} className="text-indigo-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 relative">System Performance</h3>
            <p className="text-slate-500 max-w-sm mt-2 relative">Infrastructure metrics and API latency tracking will be visualized here.</p>
            <div className="mt-8 flex gap-3 relative">
              <div className="h-2 w-12 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="h-2 w-8 bg-indigo-300 rounded-full animate-pulse delay-75"></div>
              <div className="h-2 w-16 bg-indigo-100 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
            Recent Actions
            <ArrowUpRight size={18} className="text-slate-300" />
          </h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">System generated log</p>
                  <p className="text-xs text-slate-400">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
            View Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
