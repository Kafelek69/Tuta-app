"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, MessageCircle, Share2, PlaySquare } from "lucide-react";

type ReelItem = {
  id: number;
  author: string;
  caption: string;
  colorClass: string;
};

const REEL_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/beer.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
];

export default function ReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [caption, setCaption] = useState("");
  const [index, setIndex] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const reel = reels[index] || {
    id: 0,
    author: "@system",
    caption: "Dodaj pierwszą rolkę, żeby uruchomić feed.",
    colorClass: "from-orange-500/40 to-yellow-500/10",
  };

  const loadReels = async () => {
    const res = await fetch("/api/reels/items");
    const payload = (await res.json()) as { items?: ReelItem[] };
    const data = payload.items || [];
    setReels(data);
    setIndex(0);
  };

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    if (reels.length <= 1) return;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % reels.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index, reels.length]);

  const addReel = async () => {
    if (caption.trim().length < 3) return;
    await fetch("/api/reels/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    });
    setCaption("");
    await loadReels();
  };

  const nextReel = () => {
    if (reels.length === 0) return;
    setIndex((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    if (reels.length === 0) return;
    setIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0]?.clientY ?? null);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY;
    const diff = touchStartY - endY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextReel();
      else prevReel();
    }
    setTouchStartY(null);
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="h-[100dvh] max-w-md mx-auto bg-black relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${reel.colorClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_45%)]" />

      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link href="/" className="text-cs-orange hover:bg-white/10 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
          <PlaySquare size={16} className="text-cs-orange" />
          Rolki
        </h1>
        <div className="text-xs text-white/60">{reels.length === 0 ? "0/0" : `${index + 1}/${reels.length}`}</div>
      </header>

      <main className="relative z-10 h-[calc(100dvh-76px)] flex flex-col justify-end p-4">
        <div className="w-full h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
          <div
            key={`${reel.id}-${index}`}
            className="h-full bg-cs-orange animate-[grow_6s_linear_forwards]"
            style={{ width: "100%" }}
          />
        </div>
        <div className="mb-3 flex gap-2">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Dodaj opis nowej rolki..."
            className="flex-1 bg-black/40 border border-white/20 rounded-md px-3 py-2 text-xs"
          />
          <button onClick={addReel} className="cs-btn rounded-md px-3 py-2 text-xs">
            Dodaj
          </button>
        </div>
        <div className="mb-20">
          <video
            key={`video-${reel.id}-${index}`}
            src={REEL_VIDEOS[index % REEL_VIDEOS.length]}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-45 -z-10"
          />
          <p className="font-bold text-base tracking-wide">{reel.author}</p>
          <p className="text-sm text-white/85 mt-1 normal-case">{reel.caption}</p>
        </div>

        <div className="absolute right-3 bottom-24 flex flex-col gap-4">
          <button className="bg-black/40 border border-white/15 p-3 rounded-full">
            <Heart size={20} />
          </button>
          <button className="bg-black/40 border border-white/15 p-3 rounded-full">
            <MessageCircle size={20} />
          </button>
          <button className="bg-black/40 border border-white/15 p-3 rounded-full">
            <Share2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={prevReel} className="cs-btn rounded-md py-3">
            Poprzednia
          </button>
          <button onClick={nextReel} className="cs-btn rounded-md py-3">
            Następna
          </button>
        </div>
      </main>
    </div>
  );
}
