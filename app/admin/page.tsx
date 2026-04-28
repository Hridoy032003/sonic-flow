"use client";

import { useEffect, useState } from "react";
import { 
  Users, Music, FolderOpen, TrendingUp, 
  ArrowUpRight, Activity, Calendar, 
  Clock, CheckCircle2, UserPlus, Disc
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Users", 
      value: data?.stats?.totalUsers || 0, 
      change: `+${data?.stats?.newUsersLast7Days || 0} this week`, 
      icon: <Users size={24} className="text-indigo-600" />, 
      color: "from-indigo-500/10 to-indigo-500/5",
      border: "border-indigo-100"
    },
    { 
      label: "Music Segments", 
      value: data?.stats?.totalCategories || 0, 
      change: "Active segments", 
      icon: <FolderOpen size={24} className="text-amber-600" />, 
      color: "from-amber-500/10 to-amber-500/5",
      border: "border-amber-100"
    },
    { 
      label: "Library Tracks", 
      value: data?.stats?.totalMusic || 0, 
      change: `${data?.stats?.publishedMusic || 0} published`, 
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
          <span className="text-sm font-medium text-slate-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Disc size={20} className="text-indigo-500" />
                Latest Content Releases
              </h3>
              <a href="/admin/music" className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                View All
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {data?.latestMusic?.map((music: any) => (
                <div key={music.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-50">
                      {music.artworkUrl ? (
                        <img src={music.artworkUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{music.title}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {music.artist} • <span className="text-indigo-500">{music.category?.name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Added</p>
                      <p className="text-xs text-slate-600 font-medium">{new Date(music.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${music.status === 'PUBLISHED' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={music.status}></div>
                  </div>
                </div>
              ))}
              {!data?.latestMusic?.length && (
                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                  No music entries found.
                </div>
              )}
            </div>
          </div>
          
          {/* System Performance Mockup */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 h-[250px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <Activity size={48} className="text-indigo-200 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 relative">Infrastructure Health</h3>
            <p className="text-slate-500 max-w-sm mt-2 relative text-sm">Database connection is stable. API latency average: 42ms.</p>
            <div className="mt-6 flex gap-3 relative">
              <div className="h-1.5 w-12 bg-indigo-500 rounded-full"></div>
              <div className="h-1.5 w-8 bg-indigo-300 rounded-full"></div>
              <div className="h-1.5 w-16 bg-indigo-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
              Newest Users
              <UserPlus size={20} className="text-indigo-500" />
            </h3>
            <div className="space-y-6">
              {data?.latestUsers?.map((user: any) => (
                <div key={user.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{user.email}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {!data?.latestUsers?.length && (
                <div className="text-center text-slate-400 text-sm py-4">No users found.</div>
              )}
            </div>
            <a href="/admin/users" className="block w-full py-3 text-center text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
              Manage All Users
            </a>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative">
              <CheckCircle2 size={20} />
              Admin Tip
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed relative">
              Use the music segments to group your content. This helps users find tracks faster through the infinite scroll interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

