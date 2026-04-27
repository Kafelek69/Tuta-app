"use client";

import Link from "next/link";
import { ChevronLeft, Film, MonitorPlay, Tv, PlaySquare } from "lucide-react";
import { useState } from "react";

type Platform = "youtube" | "twitch" | "tv" | "netflix";

const DATA: Record<Platform, string[]> = {
  youtube: ["Nowy podcast tech", "Skrót meczu Ekstraklasy", "Kurs React 2026"],
  twitch: ["Live: CS2 Turniej", "Live: Coding stream", "Live: Speedrun"],
  tv: ["Wiadomości 19:30", "Sport Extra", "Kino wieczorne"],
  netflix: ["Nowy thriller PL", "Serial sci-fi", "Dokument: AI"],
};

export default function MediaPage() {
  const [platform, setPlatform] = useState<Platform>("youtube");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Media Hub</h1>
      </header>

      <div className="grid grid-cols-4 gap-2 bg-[#181818] p-1 rounded-md">
        <button onClick={() => setPlatform("youtube")} className={`py-2 text-[10px] rounded ${platform === "youtube" ? "bg-cs-orange text-black" : "text-white/70"}`}><PlaySquare size={14} className="mx-auto" />YT</button>
        <button onClick={() => setPlatform("twitch")} className={`py-2 text-[10px] rounded ${platform === "twitch" ? "bg-cs-orange text-black" : "text-white/70"}`}><MonitorPlay size={14} className="mx-auto" />Twitch</button>
        <button onClick={() => setPlatform("tv")} className={`py-2 text-[10px] rounded ${platform === "tv" ? "bg-cs-orange text-black" : "text-white/70"}`}><Tv size={14} className="mx-auto" />TV</button>
        <button onClick={() => setPlatform("netflix")} className={`py-2 text-[10px] rounded ${platform === "netflix" ? "bg-cs-orange text-black" : "text-white/70"}`}><Film size={14} className="mx-auto" />VOD</button>
      </div>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-3">Rekomendacje: {platform.toUpperCase()}</p>
        <div className="space-y-2">
          {DATA[platform].map((title) => (
            <div key={title} className="bg-[#1a1a1a] p-3 rounded-md">
              <p className="text-sm normal-case">{title}</p>
              <button className="mt-2 cs-btn rounded-md text-xs w-full">Otwórz</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
