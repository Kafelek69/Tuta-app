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
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><CalendarDays size={18} className="t-accent" /> Kalendarz</h1>
      </header>

      <section className="cs-card p-4">
        <p className="text-xs t-secondary mb-2">Dodaj wydarzenie</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nazwa wydarzenia" className="w-full bg-panel-solid  rounded-xl px-3 py-2 text-sm mb-2" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-panel-solid  rounded-xl px-3 py-2 text-sm mb-2" />
        <button
          onClick={() => {
            if (!title.trim()) return;
            setEvents((prev) => [...prev, { id: `e-${Date.now()}`, title, time }]);
            setTitle("");
          }}
          className="cs-btn rounded-2xl w-full text-xs py-2"
        >
          <PlusCircle size={12} className="inline mr-1" /> Dodaj
        </button>
      </section>

      <section className="cs-card p-4">
        <p className="text-xs t-secondary mb-2">Plan dnia</p>
        <div className="space-y-2">
          {events.map((ev) => (
            <div key={ev.id} className="bg-panel-solid p-3 rounded-xl  flex justify-between items-center">
              <p className="text-sm normal-case">{ev.title}</p>
              <p className="text-xs t-accent flex items-center gap-1"><Clock3 size={12} /> {ev.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
