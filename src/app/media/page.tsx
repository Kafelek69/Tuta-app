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
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Media Hub</h1>
      </header>

      <div className="grid grid-cols-4 gap-2 bg-panel-solid p-1 rounded-xl">
        <button onClick={() => setPlatform("youtube")} className={`py-2 text-[10px] rounded ${platform === "youtube" ? "bg-cs-orange text-black" : "t-secondary"}`}><PlaySquare size={14} className="mx-auto" />YT</button>
        <button onClick={() => setPlatform("twitch")} className={`py-2 text-[10px] rounded ${platform === "twitch" ? "bg-cs-orange text-black" : "t-secondary"}`}><MonitorPlay size={14} className="mx-auto" />Twitch</button>
        <button onClick={() => setPlatform("tv")} className={`py-2 text-[10px] rounded ${platform === "tv" ? "bg-cs-orange text-black" : "t-secondary"}`}><Tv size={14} className="mx-auto" />TV</button>
        <button onClick={() => setPlatform("netflix")} className={`py-2 text-[10px] rounded ${platform === "netflix" ? "bg-cs-orange text-black" : "t-secondary"}`}><Film size={14} className="mx-auto" />VOD</button>
      </div>

      <section className="cs-card p-4">
        <p className="text-xs t-secondary mb-3">Rekomendacje: {platform.toUpperCase()}</p>
        <div className="space-y-2">
          {DATA[platform].map((title) => (
            <div key={title} className="bg-panel-solid p-3 rounded-xl">
              <p className="text-sm normal-case">{title}</p>
              <button className="mt-2 cs-btn rounded-2xl text-xs w-full">Otwórz</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
