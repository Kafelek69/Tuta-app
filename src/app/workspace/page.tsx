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
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Work</h1>
      </header>

      <div className="grid grid-cols-2 gap-2 bg-panel-solid p-1 rounded-xl">
        <button onClick={() => setTab("teams")} className={`py-2 text-xs rounded ${tab === "teams" ? "bg-cs-orange text-black" : "t-secondary"}`}>Teams</button>
        <button onClick={() => setTab("classroom")} className={`py-2 text-xs rounded ${tab === "classroom" ? "bg-cs-orange text-black" : "t-secondary"}`}>Classroom</button>
      </div>

      {tab === "teams" ? (
        <section className="space-y-3">
          {TEAMS.map((team) => (
            <article key={team.id} className="cs-card p-4">
              <h2 className="font-bold text-sm flex items-center gap-2"><Users size={14} className="t-accent" /> {team.name}</h2>
              <p className="text-xs t-secondary mt-2">{team.status}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="cs-btn rounded-2xl text-xs py-2"><MessageSquare size={12} className="inline mr-1" /> Czat</button>
                <button className="border border-white/20 rounded-xl text-xs py-2"><Video size={12} className="inline mr-1" /> Spotkanie</button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="space-y-3">
          {CLASSES.map((cls) => (
            <article key={cls.id} className="cs-card p-4">
              <h2 className="font-bold text-sm flex items-center gap-2"><BookOpenCheck size={14} className="t-accent" /> {cls.name}</h2>
              <p className="text-xs t-secondary mt-1">Uczestnicy: {cls.members}</p>
              <p className="text-xs t-secondary">Następne zajęcia: {cls.next}</p>
              <button className="cs-btn rounded-2xl w-full text-xs mt-3 py-2">Przejdź do kursu</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
