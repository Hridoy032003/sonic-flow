import { Check, Download, Heart, MoreHorizontal, Music, Play, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  srcUrl?: string;
  artworkUrl?: string;
  bannerUrl?: string;
  likes: number;
  downloads: number;
  shares: number;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  isActive?: boolean;
  isLoggedIn?: boolean;
  onClick?: () => void;
}

export function MusicCard({ id, title, artist, srcUrl, artworkUrl, bannerUrl, likes: initialLikes, downloads: initialDownloads, shares: initialShares, isFavorite: initialFavorite, isDownloaded: initialDownloaded, isActive, isLoggedIn, onClick }: MusicCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [shares, setShares] = useState(initialShares);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isDownloaded, setIsDownloaded] = useState(initialDownloaded);
  const [hasLiked, setHasLiked] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const displayImage = bannerUrl || artworkUrl;

  const handleInteraction = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to like or download tracks!");
      return;
    }
    if (isInteracting) return;
    if (type === "like" && hasLiked) return;

    setIsInteracting(true);
    try {
      // Trigger actual download if type is download
      if (type === "download" && srcUrl) {
        try {
          const response = await fetch(srcUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title} - ${artist || 'SonicFlow'}.mp3`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setIsDownloaded(true);
          toast.success("Download started!");
        } catch (err) {
          console.error("Download failed:", err);
          toast.error("Download failed!");
        }
      }

      const res = await fetch("/api/music/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      if (res.ok) {
        if (type === "like") {
          setLikes(l => l + 1);
          setHasLiked(true);
          toast.success("Liked!", { icon: '❤️' });
        }
        if (type === "download") setDownloads(d => d + 1);
        if (type === "share") {
          setShares(s => s + 1);
          toast.success("Shared!");
        }
      }
    } catch (error) {
    } finally {
      setIsInteracting(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to favorite tracks!");
      return;
    }
    try {
      const res = await fetch("/api/music/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ musicId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
        toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
      }
    } catch (error) { }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative glass rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 flex flex-col items-center text-center transition-all duration-500 cursor-pointer border-border/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-[0.97] btn-haptic ${isActive ? "bg-white shadow-xl shadow-indigo-500/5 ring-2 ring-indigo-500/20" : ""
        }`}
    >
      <div className="relative w-full aspect-square rounded-[20px] lg:rounded-[28px] bg-slate-900 flex items-center justify-center text-white mb-3 lg:mb-5 shadow-lg overflow-hidden">
        {displayImage ? (
          <img src={displayImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-20"></div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>

        {/* Floating Download Status */}
        {isDownloaded && (
          <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in duration-300">
            <Check size={14} />
          </div>
        )}

        {/* Floating Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all shadow-lg backdrop-blur-md ${isFavorite ? "bg-rose-500/20 text-rose-500" : "bg-white/10 text-white hover:text-rose-500"
            } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {isActive ? (
          <div className="flex items-center gap-1 z-10">
            <div className="w-1 h-5 lg:w-1.5 lg:h-8 bg-white rounded-full animate-[bounce_0.8s_infinite]"></div>
            <div className="w-1 h-8 lg:w-1.5 lg:h-12 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms]"></div>
            <div className="w-1 h-6 lg:w-1.5 lg:h-9 bg-white rounded-full animate-[bounce_0.8s_infinite_200ms]"></div>
          </div>
        ) : (
          <div className="z-10 flex flex-col items-center">
            {!displayImage && <Music size={28} className="lg:size-10 transition-transform duration-500 group-hover:scale-110 opacity-30 group-hover:opacity-100" />}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                <Play fill="currentColor" className="w-5 h-5 lg:w-7 lg:h-7 ml-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      <h4 className={`text-xs md:text-sm lg:text-lg font-black tracking-tight mb-1 transition-colors ${isActive ? "text-indigo-600" : "text-foreground"} truncate w-full`}>
        {title}
      </h4>
      <p className="text-[12px] lg:text-xs font-bold text-muted-text uppercase tracking-widest mb-3 lg:mb-4 truncate w-full">{artist}</p>

      <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-border/50 gap-2">
        <button
          onClick={(e) => handleInteraction(e, "like")}
          disabled={hasLiked || isInteracting || !isLoggedIn}
          className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl transition-all ${hasLiked ? "text-indigo-600 bg-indigo-50" : "text-muted-text hover:text-indigo-600 hover:bg-indigo-50"
            } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ThumbsUp size={16} className={`lg:size-[18px] ${hasLiked ? "fill-current" : ""}`} />
          <span className="text-[11px] lg:text-[12px] font-black">{likes}</span>
        </button>

        <div className="flex items-center gap-0.5 lg:gap-1">
          <button
            onClick={(e) => handleInteraction(e, "download")}
            disabled={isInteracting || !isLoggedIn}
            className={`flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl transition-all ${isDownloaded
                ? "text-emerald-600 bg-emerald-50"
                : "text-muted-text hover:text-emerald-600 hover:bg-emerald-50"
              } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isDownloaded ? <Check size={16} className="lg:size-[18px]" /> : <Download size={16} className="lg:size-[18px]" />}
            <span className="text-[11px] lg:text-[12px] font-black">
              {isDownloaded ? "Downloaded" : downloads}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
