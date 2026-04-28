import { Download, Heart, MoreHorizontal, Music, Play } from "lucide-react";
import { useState } from "react";

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  likes: number;
  downloads: number;
  shares: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function MusicCard({ id, title, artist, likes: initialLikes, downloads: initialDownloads, shares: initialShares, isActive, onClick }: MusicCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [shares, setShares] = useState(initialShares);

  const handleInteraction = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/music/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      if (res.ok) {
        if (type === "like") setLikes(l => l + 1);
        if (type === "download") setDownloads(d => d + 1);
        if (type === "share") setShares(s => s + 1);
      }
    } catch (error) {}
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative glass rounded-[40px] p-8 flex flex-col items-center text-center transition-all duration-500 cursor-pointer border-border/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 ${
        isActive ? "bg-secondary shadow-xl shadow-indigo-500/5 ring-2 ring-indigo-500/20" : ""
      }`}
    >
      <div className="relative w-full aspect-square rounded-[32px] bg-slate-900 flex items-center justify-center text-white mb-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        {isActive ? (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-8 bg-white rounded-full animate-[bounce_0.8s_infinite]"></div>
            <div className="w-2 h-14 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms]"></div>
            <div className="w-2 h-10 bg-white rounded-full animate-[bounce_0.8s_infinite_200ms]"></div>
          </div>
        ) : (
          <>
            <Music size={48} className="transition-transform duration-500 group-hover:scale-110 opacity-30 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-sm">
               <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play size={32} fill="currentColor" className="ml-1" />
               </div>
            </div>
          </>
        )}
      </div>

      <h4 className={`text-xl font-black tracking-tight mb-2 transition-colors ${isActive ? "text-indigo-600" : "text-foreground"}`}>
        {title}
      </h4>
      <p className="text-xs font-bold text-muted-text uppercase tracking-widest mb-6">{artist}</p>

      <div className="flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="flex flex-col items-center gap-1">
          <button onClick={(e) => handleInteraction(e, "like")} className="p-3 text-muted-text hover:text-rose-500 hover:bg-rose-50/50 rounded-2xl transition-all"><Heart size={20} /></button>
          <span className="text-[10px] font-black text-muted-text">{likes}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button onClick={(e) => handleInteraction(e, "download")} className="p-3 text-muted-text hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all"><Download size={20} /></button>
          <span className="text-[10px] font-black text-muted-text">{downloads}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button onClick={(e) => handleInteraction(e, "share")} className="p-3 text-muted-text hover:text-foreground hover:bg-white/10 rounded-2xl transition-all"><MoreHorizontal size={20} /></button>
          <span className="text-[10px] font-black text-muted-text">{shares}</span>
        </div>
      </div>
    </div>
  );
}
