"use client";

import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Shield, ShieldAlert, UserCheck, UserX, MoreVertical, Search, Filter } from "lucide-react";

export default function AdminUsers() {
  const { data, loading, refetch } = useApi<{ users: any[] }>("/api/admin/users");
  const [updating, setUpdating] = useState<string | null>(null);

  const updateUser = async (id: string, updates: any) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      await refetch();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Audit, role elevation, and security controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filter</span>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all">
            Export Users
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Synchronizing user data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Profile</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Privileges</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 shadow-sm border border-white">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.email}</p>
                          <p className="text-xs text-slate-400">UID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight ${
                        user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {user.role === 'ADMIN' ? <Shield size={12} /> : <UserCheck size={12} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight ${
                        user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                        {user.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={updating === user.id}
                          onClick={() => updateUser(user.id, { status: user.status === "ACTIVE" ? "BANNED" : "ACTIVE" })}
                          className={`p-2.5 rounded-xl transition-all ${
                            user.status === "ACTIVE" 
                              ? "text-rose-400 hover:text-rose-600 hover:bg-rose-50" 
                              : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={user.status === "ACTIVE" ? "Ban Account" : "Activate Account"}
                        >
                          {user.status === "ACTIVE" ? <UserX size={20} /> : <UserCheck size={20} />}
                        </button>
                        <button 
                          disabled={updating === user.id}
                          onClick={() => updateUser(user.id, { role: user.role === "ADMIN" ? "USER" : "ADMIN" })}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Toggle Privileges"
                        >
                          <ShieldAlert size={20} />
                        </button>
                        <button className="p-2.5 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
                          <MoreVertical size={20} />
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
