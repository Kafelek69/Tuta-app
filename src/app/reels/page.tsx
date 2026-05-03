"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, MessageCircle, Music, Plus, Share2, PlaySquare, X, Send } from "lucide-react";

type ReelItem = { id: number; author: string; caption: string; colorClass: string };

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className="flex items-center justify-center rounded-full font-black text-black tracking-wider shrink-0 border-2 border-white/20"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.32 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

const REEL_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
];

const BG_GRADIENTS = [
  "from-orange-600/50 via-red-600/30 to-purple-900/40",
  "from-purple-600/50 via-blue-600/30 to-cyan-900/40",
  "from-yellow-600/50 via-orange-600/30 to-red-900/40",
  "from-green-600/50 via-teal-600/30 to-blue-900/40",
  "from-pink-600/50 via-rose-600/30 to-purple-900/40",
];

export default function ReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [index, setIndex] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [caption, setCaption] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shared, setShared] = useState(false);

  const reel = reels[index] || { id: 0, author: "@system", caption: "Dodaj pierwszą rolkę!", colorClass: "from-orange-500/40 to-yellow-500/10" };

  const loadReels = async () => {
    const res = await fetch("/api/reels/items");
    const payload = (await res.json()) as { items?: ReelItem[] };
    setReels(payload.items || []);
    setIndex(0);
  };

  useEffect(() => { loadReels(); }, []);

  const goTo = useCallback((dir: "next" | "prev") => {
    if (reels.length === 0 || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setIndex(p => dir === "next" ? (p + 1) % reels.length : (p - 1 + reels.length) % reels.length);
      setTransitioning(false);
    }, 200);
  }, [reels.length, transitioning]);

  const addReel = async () => {
    if (caption.trim().length < 3) return;
    await fetch("/api/reels/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption }) });
    setCaption(""); setShowAdd(false); await loadReels();
  };

  const toggleLike = () => {
    setLiked(p => { const n = new Set(p); n.has(reel.id) ? n.delete(reel.id) : n.add(reel.id); return n; });
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `Rolka od ${reel.author}`, text: reel.caption }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${reel.author}: ${reel.caption}`);
      setShared(true); setTimeout(() => setShared(false), 2000);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0]?.clientY ?? null);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const diff = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
    if (Math.abs(diff) > 50) goTo(diff > 0 ? "next" : "prev");
    setTouchStartY(null);
  };

  const isLiked = liked.has(reel.id);
  const bgGrad = BG_GRADIENTS[index % BG_GRADIENTS.length];

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="fixed inset-0 bg-black overflow-hidden">
      {/* Fullscreen video background */}
      <video
        key={`v-${index}`}
        src={REEL_VIDEOS[index % REEL_VIDEOS.length]}
        autoPlay muted loop playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-50"}`}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGrad} transition-all duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 safe-top">
        <Link href="/" className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-sm font-black tracking-[0.2em] flex items-center gap-2">
          <PlaySquare size={16} className="text-[#fca000]" /> ROLKI
        </h1>
        <span className="text-xs text-white/50 font-bold">{reels.length === 0 ? "0/0" : `${index + 1}/${reels.length}`}</span>
      </div>

      {/* Side actions */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col gap-5 items-center safe-bottom">
        <button onClick={toggleLike} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10">
            <Heart size={24} className={`${isLiked ? "fill-red-500 text-red-500 animate-heartBeat" : "text-white"}`} />
          </div>
          <span className="text-[10px] text-white/70 font-bold">{isLiked ? "1" : "0"}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-[10px] text-white/70 font-bold">0</span>
        </button>
        <button onClick={share} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10">
            <Share2 size={24} className="text-white" />
          </div>
          {shared && <span className="text-[9px] text-green-400 font-bold">OK!</span>}
        </button>
        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30 animate-[spin_4s_linear_infinite]">
          <div className="w-full h-full bg-gradient-to-br from-[#fca000] to-[#f97316] flex items-center justify-center">
            <Music size={16} className="text-black" />
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 pb-24 transition-all duration-300 ${transitioning ? "opacity-0 translate-y-4" : ""}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <Avatar name={reel.author} size={36} />
          <div>
            <p className="font-black text-sm tracking-wider text-white">{reel.author}</p>
            <button className="text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/30 tracking-wider mt-0.5">OBSERWUJ</button>
          </div>
        </div>
        <p className="text-sm text-white/90 normal-case leading-relaxed mt-2 max-w-[85%]">{reel.caption}</p>

        {/* Progress */}
        <div className="mt-4 flex gap-1">
          {reels.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div className="h-full rounded-full" style={{
                width: i < index ? "100%" : i === index ? "100%" : "0%",
                background: i <= index ? "linear-gradient(90deg, #fca000, #f97316)" : "transparent",
                animation: i === index ? "grow 6s linear" : "none",
              }} />
            </div>
          ))}
        </div>

        <p className="text-center text-[9px] text-white/20 tracking-[0.2em] mt-3">PRZESUŃ W GÓRĘ ↑</p>
      </div>

      {/* Touch zones for prev/next */}
      <div className="absolute inset-0 flex z-10">
        <div className="w-1/3" onClick={() => goTo("prev")} />
        <div className="w-1/3" />
        <div className="w-1/3" onClick={() => goTo("next")} />
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-wider text-black safe-bottom"
        style={{ background: "linear-gradient(135deg, #fca000, #e09000)", boxShadow: "0 4px 20px rgba(252,160,0,0.4)" }}>
        <Plus size={16} /> DODAJ ROLKĘ
      </button>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end safe-bottom">
          <div className="w-full max-w-md mx-auto rounded-t-3xl p-6 animate-slideUp" style={{ background: "var(--app-panel-solid)", borderTop: "1px solid rgba(252,160,0,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-[0.2em]">NOWA ROLKA</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-full hover:bg-white/10"><X size={18} /></button>
            </div>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Opisz swoją rolkę..." className="cs-input !min-h-[80px] !rounded-xl resize-none" />
            <button onClick={addReel} disabled={caption.trim().length < 3} className="cs-btn w-full rounded-xl mt-3 !py-3 text-xs flex items-center justify-center gap-2">
              <Send size={14} /> OPUBLIKUJ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
