"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, X, Heart, Send, Camera, Plus } from "lucide-react";

const MOCK_STORIES = [
  {
    id: "s1", user: "S1mple",
    items: [
      { id: "i1", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80", duration: 5000 },
      { id: "i2", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80", duration: 5000 },
    ],
    timestamp: "2h",
  },
  {
    id: "s2", user: "PashaBiceps",
    items: [
      { id: "i3", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", duration: 5000 },
    ],
    timestamp: "5h",
  },
  {
    id: "s3", user: "NEO",
    items: [
      { id: "i4", url: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80", duration: 5000 },
      { id: "i5", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80", duration: 5000 },
      { id: "i6", url: "https://images.unsplash.com/photo-1587840104736-524ba5fcecf8?w=800&q=80", duration: 4000 },
    ],
    timestamp: "1h",
  },
];

function StoryAvatar({ name, size = 56 }: { name: string; size?: number }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className="flex items-center justify-center rounded-full font-black text-black tracking-wider shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.3 }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function StoriesFeed() {
  const [activeUserIdx, setActiveUserIdx] = useState<number | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  const activeUser = activeUserIdx !== null ? MOCK_STORIES[activeUserIdx] : null;
  const activeStory = activeUser?.items[activeStoryIdx] || null;

  const closeStories = useCallback(() => {
    setActiveUserIdx(null);
    setActiveStoryIdx(0);
    setProgress(0);
    setLiked(false);
  }, []);

  const handleNext = useCallback(() => {
    if (!activeUser) return;
    setLiked(false);
    if (activeStoryIdx < activeUser.items.length - 1) {
      setActiveStoryIdx((prev) => prev + 1);
      setProgress(0);
    } else if (activeUserIdx !== null && activeUserIdx < MOCK_STORIES.length - 1) {
      setActiveUserIdx((prev) => (prev !== null ? prev + 1 : null));
      setActiveStoryIdx(0);
      setProgress(0);
    } else {
      closeStories();
    }
  }, [activeUser, activeStoryIdx, activeUserIdx, closeStories]);

  const handlePrev = useCallback(() => {
    if (!activeUser) return;
    setLiked(false);
    if (activeStoryIdx > 0) {
      setActiveStoryIdx((prev) => prev - 1);
      setProgress(0);
    } else if (activeUserIdx !== null && activeUserIdx > 0) {
      const prevIdx = activeUserIdx - 1;
      setActiveUserIdx(prevIdx);
      setActiveStoryIdx(MOCK_STORIES[prevIdx].items.length - 1);
      setProgress(0);
    }
  }, [activeUser, activeStoryIdx, activeUserIdx]);

  useEffect(() => {
    if (!activeUser || !activeStory) return;
    const step = (50 / activeStory.duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) { handleNext(); return 0; }
        return prev + step;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [activeUserIdx, activeStoryIdx, activeStory, activeUser, handleNext]);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col pb-24 safe-bottom">
      {/* Header */}
      <header className="cs-header mx-3 mt-3 animate-fadeInUp">
        <Link href="/" className="text-[#fca000] hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">RELACJE</h1>
          <p className="text-[10px] text-white/40 tracking-wider mt-0.5">STORIES OD ZNAJOMYCH</p>
        </div>
        <Camera size={20} className="text-[#fca000]" />
      </header>

      {/* Add your story */}
      <div className="px-3 mt-4 animate-fadeInUp stagger-1">
        <div className="cs-card p-4 flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-dashed border-[#fca000]/40 flex items-center justify-center">
              <Plus size={22} className="text-[#fca000]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold tracking-wider">Dodaj relację</p>
            <p className="text-[10px] text-white/40 tracking-wider mt-0.5">Zniknie po 24h</p>
          </div>
        </div>
      </div>

      {/* Stories grid */}
      <div className="px-3 mt-4">
        <p className="text-[10px] text-white/40 tracking-[0.2em] mb-3 font-bold">DOSTĘPNE RELACJE</p>
        <div className="grid grid-cols-3 gap-3">
          {MOCK_STORIES.map((story, idx) => (
            <div
              key={story.id}
              className="relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer group animate-fadeInUp"
              style={{ animationDelay: `${0.1 * idx}s`, opacity: 0 }}
              onClick={() => { setActiveUserIdx(idx); setActiveStoryIdx(0); setProgress(0); setLiked(false); }}
            >
              <img
                src={story.items[0].url}
                alt={story.user}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Orange ring */}
              <div className="absolute top-2.5 left-2.5">
                <div className="p-[2px] rounded-full bg-gradient-to-br from-[#fca000] to-[#f97316]">
                  <div className="bg-black rounded-full p-[1px]">
                    <StoryAvatar name={story.user} size={30} />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <p className="font-bold text-xs truncate">{story.user}</p>
                <p className="text-[9px] text-white/50 mt-0.5">{story.timestamp}</p>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#fca000]/50 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== FULLSCREEN STORY OVERLAY ===== */}
      {activeUser && activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col safe-top safe-bottom">
          {/* Progress bars */}
          <div className="flex gap-1 px-3 pt-3 relative z-20">
            {activeUser.items.map((_, idx) => (
              <div key={idx} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all ease-linear"
                  style={{
                    width: idx < activeStoryIdx ? "100%" : idx === activeStoryIdx ? `${progress}%` : "0%",
                    background: "linear-gradient(90deg, #fca000, #f97316)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info bar */}
          <div className="flex items-center justify-between px-3 py-2 relative z-20">
            <div className="flex items-center gap-3">
              <div className="p-[2px] rounded-full bg-gradient-to-br from-[#fca000] to-[#f97316]">
                <div className="bg-black rounded-full p-[1px]">
                  <StoryAvatar name={activeUser.user} size={34} />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm tracking-wider">{activeUser.user}</p>
                <p className="text-[10px] text-white/40">{activeUser.timestamp}</p>
              </div>
            </div>
            <button onClick={closeStories} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* Touch nav */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/3" onClick={handlePrev} />
            <div className="w-2/3" onClick={handleNext} />
          </div>

          {/* Image */}
          <img src={activeStory.url} alt="Story" className="w-full flex-1 object-cover" />

          {/* Bottom controls */}
          <div className="relative z-20 px-3 py-3 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent">
            <input
              type="text"
              placeholder="Wyślij wiadomość..."
              className="flex-1 bg-transparent border border-white/20 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:border-[#fca000]/50 placeholder:text-white/30"
            />
            <button
              onClick={() => setLiked((p) => !p)}
              className="p-2"
            >
              <Heart
                size={24}
                className={`transition-all ${liked ? "fill-red-500 text-red-500 animate-heartBeat" : "text-white hover:text-red-400"}`}
              />
            </button>
            <button className="p-2 text-white hover:text-[#fca000] transition-colors">
              <Send size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
