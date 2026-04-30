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

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 min-h-[60px] md:h-12">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0 md:min-w-[240px]">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-[16px] flex items-center justify-center text-white shrink-0 shadow-xl border border-white/10">
             <Music className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="font-black text-slate-900 truncate text-sm md:text-base leading-tight tracking-tight">{track.title}</h4>
            <p className="text-[12px] md:text-xs font-bold text-slate-500 truncate uppercase tracking-widest mt-0.5">{track.artist}</p>
          </div>
          <button className="text-slate-300 hover:text-rose-500 transition-all hover:scale-110 active:scale-90"><Heart size={20} /></button>
        </div>

        {/* Playback Controls */}
        <div className="flex-1 w-full flex flex-col items-center gap-3 order-first md:order-none">
           <div className="flex items-center gap-6 md:gap-10">
              <button className="hidden md:block text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><Shuffle size={20} /></button>
              <button onClick={skipBackward} className="text-slate-500 hover:text-slate-900 transition-all hover:scale-110" title="Rewind 10s"><RotateCcw className="w-5 h-5 md:w-6 md:h-6" /></button>
              <button 
                onClick={togglePlay}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-500/40"
              >
                {isPlaying ? <Pause fill="currentColor" className="w-6 h-6 md:w-8 md:h-8" /> : <Play fill="currentColor" className="w-6 h-6 md:w-8 md:h-8 ml-1" />}
              </button>
              <button onClick={skipForward} className="text-slate-500 hover:text-slate-900 transition-all hover:scale-110" title="Forward 10s"><RotateCw className="w-5 h-5 md:w-6 md:h-6" /></button>
              <button className="hidden md:block text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><Repeat size={20} /></button>
           </div>
           
           <div className="w-full max-w-2xl flex items-center gap-4">
              <span className="text-[12px] font-black text-slate-400 w-10 md:w-12 text-right tabular-nums">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1.5 md:h-2 bg-slate-100 rounded-full relative overflow-hidden group border border-slate-200/50">
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
              <span className="text-[12px] font-black text-slate-400 w-10 md:w-12 tabular-nums">{formatTime(duration)}</span>
           </div>
        </div>

        {/* Volume & Utility - Hidden on Mobile */}
        <div className="hidden md:flex w-1/4 items-center justify-end gap-8">
           <div className="flex items-center gap-5">
              <button className="text-slate-400 hover:text-slate-600 transition-all hover:scale-110"><ListMusic size={22} /></button>
           </div>
           <div className="flex items-center gap-4 w-32">
              <Volume2 size={20} className="text-slate-400" />
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                 <div className="w-3/4 h-full bg-indigo-400"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
