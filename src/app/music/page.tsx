"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Music, Pause, Play, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from "lucide-react";

const TRACKS = [
  { id: 1, title: "Neon Lights", artist: "Synthwave Collective", duration: 215, color: "#f97316" },
  { id: 2, title: "Midnight Drive", artist: "ChillHop Beats", duration: 183, color: "#8b5cf6" },
  { id: 3, title: "Electric Dreams", artist: "RetroWave", duration: 248, color: "#06b6d4" },
  { id: 4, title: "Summer Vibes", artist: "LoFi House", duration: 196, color: "#ec4899" },
  { id: 5, title: "Warsaw Nights", artist: "Polish Electronic", duration: 230, color: "#10b981" },
  { id: 6, title: "Code & Coffee", artist: "Dev Beats", duration: 202, color: "#f59e0b" },
  { id: 7, title: "Digital Sunset", artist: "Ambient Works", duration: 175, color: "#6366f1" },
  { id: 8, title: "Future Funk", artist: "Vaporwave FM", duration: 222, color: "#14b8a6" },
];

function formatTime(s: number) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`; }

export default function MusicPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[currentIdx];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= track.duration) { next(); return 0; }
          return p + 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, currentIdx]);

  const next = () => { setCurrentIdx(p => (p + 1) % TRACKS.length); setProgress(0); };
  const prev = () => { setCurrentIdx(p => (p - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const toggleLike = () => { setLiked(p => { const n = new Set(p); n.has(track.id) ? n.delete(track.id) : n.add(track.id); return n; }); };

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em]">MUZYKA</h1>
        <Music size={20} className="t-accent" />
      </header>

      {/* Now playing */}
      <div className="mt-6 flex flex-col items-center animate-fadeInUp stagger-1">
        <div className={`w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl ${playing ? "animate-pulse" : ""}`}
          style={{ background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`, boxShadow: `0 20px 60px ${track.color}33` }}>
          <Music size={64} className="text-black/30" />
        </div>
        <h2 className="text-lg font-black tracking-wider mt-5">{track.title}</h2>
        <p className="text-xs t-secondary tracking-wider">{track.artist}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 px-2 animate-fadeInUp stagger-2">
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--app-input-bg)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(progress / track.duration) * 100}%`, background: `linear-gradient(90deg, ${track.color}, #fca000)` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] t-tertiary">{formatTime(progress)}</span>
          <span className="text-[9px] t-tertiary">{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-4 animate-fadeInUp stagger-3">
        <button className="t-tertiary hover:t-secondary"><Shuffle size={18} /></button>
        <button onClick={prev} className="t-secondary hover:t-accent"><SkipBack size={24} /></button>
        <button onClick={() => setPlaying(!playing)}
          className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${track.color}, #fca000)`, boxShadow: `0 4px 20px ${track.color}44` }}>
          {playing ? <Pause size={28} className="text-black" /> : <Play size={28} className="text-black ml-1" />}
        </button>
        <button onClick={next} className="t-secondary hover:t-accent"><SkipForward size={24} /></button>
        <button className="t-tertiary hover:t-secondary"><Repeat size={18} /></button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-3">
        <button onClick={toggleLike}>
          <Heart size={20} className={liked.has(track.id) ? "fill-red-500 text-red-500 animate-heartBeat" : "t-tertiary"} />
        </button>
        <Volume2 size={16} className="t-tertiary" />
      </div>

      {/* Playlist */}
      <div className="mt-6 animate-fadeInUp stagger-4">
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3">PLAYLISTA</p>
        <div className="flex flex-col gap-1.5">
          {TRACKS.map((t, i) => (
            <button key={t.id} onClick={() => { setCurrentIdx(i); setProgress(0); setPlaying(true); }}
              className={`cs-card p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform ${i === currentIdx ? "!border-[#fca000]/30" : ""}`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${t.color}88, ${t.color}44)` }}>
                {i === currentIdx && playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold tracking-wider truncate ${i === currentIdx ? "t-accent" : ""}`}>{t.title}</p>
                <p className="text-[9px] t-tertiary truncate">{t.artist}</p>
              </div>
              <span className="text-[9px] t-tertiary">{formatTime(t.duration)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
