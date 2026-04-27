"use client";

import Link from "next/link";
import { BookOpenCheck, ChevronLeft, MessageSquare, Users, Video } from "lucide-react";
import { useState } from "react";

const CLASSES = [
  { id: "c1", name: "Produkt i UX", members: 24, next: "14:00" },
  { id: "c2", name: "Programowanie Fullstack", members: 31, next: "16:30" },
];

const TEAMS = [
  { id: "t1", name: "Zespół Marketing", status: "Spotkanie jutro 10:00" },
  { id: "t2", name: "Zespół Tech", status: "Code review dzisiaj 15:30" },
];

export default function WorkspacePage() {
  const [tab, setTab] = useState<"teams" | "classroom">("teams");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Work</h1>
      </header>

      <div className="grid grid-cols-2 gap-2 bg-[#181818] p-1 rounded-md">
        <button onClick={() => setTab("teams")} className={`py-2 text-xs rounded ${tab === "teams" ? "bg-cs-orange text-black" : "text-white/70"}`}>Teams</button>
        <button onClick={() => setTab("classroom")} className={`py-2 text-xs rounded ${tab === "classroom" ? "bg-cs-orange text-black" : "text-white/70"}`}>Classroom</button>
      </div>

      {tab === "teams" ? (
        <section className="space-y-3">
          {TEAMS.map((team) => (
            <article key={team.id} className="cs-panel p-4 rounded-md border border-white/10">
              <h2 className="font-bold text-sm flex items-center gap-2"><Users size={14} className="text-cs-orange" /> {team.name}</h2>
              <p className="text-xs text-white/60 mt-2">{team.status}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="cs-btn rounded-md text-xs py-2"><MessageSquare size={12} className="inline mr-1" /> Czat</button>
                <button className="border border-white/20 rounded-md text-xs py-2"><Video size={12} className="inline mr-1" /> Spotkanie</button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="space-y-3">
          {CLASSES.map((cls) => (
            <article key={cls.id} className="cs-panel p-4 rounded-md border border-white/10">
              <h2 className="font-bold text-sm flex items-center gap-2"><BookOpenCheck size={14} className="text-cs-orange" /> {cls.name}</h2>
              <p className="text-xs text-white/60 mt-1">Uczestnicy: {cls.members}</p>
              <p className="text-xs text-white/60">Następne zajęcia: {cls.next}</p>
              <button className="cs-btn rounded-md w-full text-xs mt-3 py-2">Przejdź do kursu</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
