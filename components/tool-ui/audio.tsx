"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Heart, ListMusic, RotateCcw, RotateCw } from "lucide-react";

interface AudioPlayerProps {
  track: {
    id: string;
    title: string;
    artist: string;
    src: string;
  };
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [track.src]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={track.src} preload="auto" />

      <div className="flex items-center justify-between gap-8 h-12">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
          <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white shrink-0 shadow-lg border border-white/10">
             <Music size={20} />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-slate-900 truncate text-sm leading-tight">{track.title}</h4>
            <p className="text-[11px] font-medium text-slate-500 truncate">{track.artist}</p>
          </div>
          <button className="text-slate-300 hover:text-rose-500 transition-all hover:scale-110 ml-2"><Heart size={16} /></button>
        </div>

        {/* Playback Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
           <div className="flex items-center gap-5">
              <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Shuffle size={14} /></button>
              <button onClick={skipBackward} className="text-slate-500 hover:text-slate-900 transition-all hover:scale-110" title="Rewind 10s"><RotateCcw size={18} /></button>
              <button 
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={skipForward} className="text-slate-500 hover:text-slate-900 transition-all hover:scale-110" title="Forward 10s"><RotateCw size={18} /></button>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Repeat size={14} /></button>
           </div>
           
           <div className="w-full max-w-lg flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden group border border-slate-200/50">
                 <div 
                   className="absolute left-0 inset-y-0 bg-indigo-500 transition-all duration-100"
                   style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                 ></div>
                 <input
                   type="range"
                   min="0"
                   max={duration || 0}
                   step="0.1"
                   value={currentTime}
                   onChange={handleSeek}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
              </div>
              <span className="text-[10px] font-bold text-slate-400 w-10 tabular-nums">{formatTime(duration)}</span>
           </div>
        </div>

        {/* Volume & Utility */}
        <div className="w-1/4 flex items-center justify-end gap-6">
           <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><ListMusic size={18} /></button>
           </div>
           <div className="flex items-center gap-3 w-24">
              <Volume2 size={16} className="text-slate-400" />
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-slate-300"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
