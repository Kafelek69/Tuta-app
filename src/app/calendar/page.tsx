"use client";

import Link from "next/link";
import { CalendarDays, ChevronLeft, Clock3, PlusCircle } from "lucide-react";
import { useState } from "react";

type EventItem = { id: string; title: string; time: string };

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([
    { id: "e1", title: "Daily standup", time: "09:30" },
    { id: "e2", title: "Spotkanie z klientem", time: "14:00" },
  ]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("12:00");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><CalendarDays size={18} className="text-cs-orange" /> Kalendarz</h1>
      </header>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2">Dodaj wydarzenie</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nazwa wydarzenia" className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-sm mb-2" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-sm mb-2" />
        <button
          onClick={() => {
            if (!title.trim()) return;
            setEvents((prev) => [...prev, { id: `e-${Date.now()}`, title, time }]);
            setTitle("");
          }}
          className="cs-btn rounded-md w-full text-xs py-2"
        >
          <PlusCircle size={12} className="inline mr-1" /> Dodaj
        </button>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2">Plan dnia</p>
        <div className="space-y-2">
          {events.map((ev) => (
            <div key={ev.id} className="bg-[#1a1a1a] p-3 rounded-md border border-white/10 flex justify-between items-center">
              <p className="text-sm normal-case">{ev.title}</p>
              <p className="text-xs text-cs-orange flex items-center gap-1"><Clock3 size={12} /> {ev.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
