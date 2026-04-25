"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Heart, Mic2, ListMusic } from "lucide-react";

interface AudioPlayerProps {
  track: {
    title: string;
    artist: string;
    src: string;
  };
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [track.src]);

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

      <div className="flex items-center justify-between gap-8">
        {/* Track Detail Block */}
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
          <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shrink-0 overflow-hidden relative group">
             <div className="absolute inset-0 bg-sky-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             <Music size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-slate-900 truncate text-sm leading-tight hover:text-sky-600 cursor-pointer">{track.title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{track.artist}</p>
          </div>
          <button className="text-slate-300 hover:text-rose-500 transition-colors ml-2"><Heart size={18} /></button>
        </div>

        {/* Professional Playback Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-sky-500 transition-colors"><Shuffle size={16} /></button>
              <button className="text-slate-600 hover:text-slate-900 transition-colors"><SkipBack size={20} fill="currentColor" /></button>
              <button 
                onClick={togglePlay}
                className="w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-full hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-slate-600 hover:text-slate-900 transition-colors"><SkipForward size={20} fill="currentColor" /></button>
              <button className="text-slate-400 hover:text-sky-500 transition-colors"><Repeat size={16} /></button>
           </div>
           
           <div className="w-full max-w-xl flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1.5 relative group cursor-pointer">
                 <div className="absolute inset-0 bg-slate-100 rounded-full"></div>
                 <div 
                   className="absolute left-0 inset-y-0 bg-sky-500 rounded-full"
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
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-sky-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                 ></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 w-10">{formatTime(duration)}</span>
           </div>
        </div>

        {/* Secondary Utility Controls */}
        <div className="w-1/4 flex items-center justify-end gap-5">
           <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><Mic2 size={16} /></button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><ListMusic size={18} /></button>
           </div>
           <div className="flex items-center gap-3 w-32 group">
              <Volume2 size={18} className="text-slate-400 group-hover:text-slate-600" />
              <div className="flex-1 h-1 bg-slate-100 rounded-full relative">
                 <div className="absolute left-0 inset-y-0 bg-slate-300 group-hover:bg-sky-400 rounded-full w-3/4"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
