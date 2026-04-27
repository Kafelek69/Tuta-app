"use client";

import Link from "next/link";
import { Bus, ChevronLeft, MapPinned, Navigation, Route } from "lucide-react";
import { useState } from "react";

export default function MapsPage() {
  const [destination, setDestination] = useState("Lotnisko Chopina");
  const [showTransit, setShowTransit] = useState(true);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><MapPinned size={18} className="text-cs-orange" /> Mapy</h1>
      </header>

      <section className="cs-panel rounded-md border border-white/10 overflow-hidden">
        <div className="h-52 bg-[linear-gradient(180deg,#1b1b1b,#101010)] p-4 relative">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10 text-sm text-white/85 normal-case">
            <p className="font-bold">Centrum Warszawy</p>
            <p className="text-xs text-white/60 mt-1">Tryb mapy + komunikacja miejska</p>
          </div>
        </div>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <label className="text-xs text-white/60">Cel podróży</label>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-md p-3 text-sm" />
        <button className="mt-3 cs-btn rounded-md w-full flex items-center justify-center gap-2"><Navigation size={16} /> Nawiguj</button>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <button onClick={() => setShowTransit((prev) => !prev)} className="w-full border border-white/20 rounded-md py-2 text-xs font-bold tracking-widest flex items-center justify-center gap-2">
          <Bus size={14} /> {showTransit ? "Ukryj transport publiczny" : "Pokaż transport publiczny"}
        </button>
        {showTransit ? (
          <div className="mt-3 text-sm normal-case space-y-1 text-white/85">
            <p><Route size={14} className="inline mr-1 text-cs-orange" /> M1 do Politechniki (6 min)</p>
            <p><Route size={14} className="inline mr-1 text-cs-orange" /> Autobus 175 (14 min)</p>
            <p className="text-xs text-white/60 mt-2">ETA całość: 27 min</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
