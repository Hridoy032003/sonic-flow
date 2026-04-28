"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Shield, ShieldAlert, UserCheck, UserX, MoreVertical, Search, Filter } from "lucide-react";

export default function AdminUsers() {
  const [userList, setUserList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const observerTarget = useRef(null);

  const fetchUsers = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?page=${pageNum}&limit=15`);
      const data = await res.json();
      if (data.users) {
        setUserList(prev => reset ? data.users : [...prev, ...data.users]);
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
    fetchUsers(1, true);
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
    if (page > 1) fetchUsers(page);
  }, [page]);

  const updateUser = async (id: string, updates: any) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setUserList(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } finally {
      setUpdating(null);
    }
  };

  const [editingUser, setEditingUser] = useState<any>(null);

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await updateUser(editingUser.id, { 
      email: editingUser.email, 
      role: editingUser.role, 
      status: editingUser.status 
    });
    setEditingUser(null);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Audit, role elevation, and security controls.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {total} Total Users
          </div>
        </div>

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
              {userList.map((user) => (
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
                        className={`p-2.5 rounded-xl transition-all border border-transparent ${
                          user.status === "ACTIVE" 
                            ? "text-rose-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100" 
                            : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                        }`}
                        title={user.status === "ACTIVE" ? "Ban Account" : "Activate Account"}
                      >
                        {user.status === "ACTIVE" ? <UserX size={20} /> : <UserCheck size={20} />}
                      </button>
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                        title="Edit User"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {loading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                        <div className="h-3 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><div className="h-6 bg-slate-200 rounded-xl w-20"></div></td>
                  <td className="px-8 py-6"><div className="h-6 bg-slate-200 rounded-xl w-20"></div></td>
                  <td className="px-8 py-6 text-right"><div className="h-10 bg-slate-200 rounded-2xl w-24 ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="h-10 w-full" />
      </div>

      {/* Edit Modal Popup */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Update User Account</h3>
            <form onSubmit={handleUpdateUserSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input required type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Role Privilege</label>
                  <select required value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium appearance-none">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                  <select required value={editingUser.status} onChange={(e) => setEditingUser({...editingUser, status: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium appearance-none">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={updating === editingUser.id} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
