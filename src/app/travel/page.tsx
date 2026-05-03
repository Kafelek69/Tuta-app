"use client";

import Link from "next/link";
import { BedDouble, ChevronLeft, Plane, Ticket } from "lucide-react";
import { useState } from "react";

const FLIGHTS = [
  { id: "f1", route: "Warszawa -> Barcelona", date: "12 maja", price: 499 },
  { id: "f2", route: "Kraków -> Rzym", date: "16 maja", price: 379 },
];

const HOTELS = [
  { id: "h1", name: "City Central Hotel", city: "Barcelona", price: 420 },
  { id: "h2", name: "Roma Riverside", city: "Rzym", price: 390 },
];

export default function TravelPage() {
  const [booked, setBooked] = useState<string[]>([]);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Travel</h1>
      </header>

      <section className="cs-card p-4">
        <p className="text-sm font-bold tracking-widest flex items-center gap-2"><Plane size={16} className="t-accent" /> Loty</p>
        <div className="mt-3 space-y-2">
          {FLIGHTS.map((f) => (
            <div key={f.id} className="bg-panel-solid rounded-xl p-3">
              <p className="text-sm">{f.route}</p>
              <p className="text-xs t-secondary mt-1">{f.date}</p>
              <button onClick={() => setBooked((prev) => [...new Set([...prev, f.id])])} className="mt-2 cs-btn rounded-2xl w-full text-xs">
                {booked.includes(f.id) ? "Zarezerwowane" : `Rezerwuj od ${f.price} PLN`}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cs-card p-4">
        <p className="text-sm font-bold tracking-widest flex items-center gap-2"><BedDouble size={16} className="t-accent" /> Noclegi</p>
        <div className="mt-3 space-y-2">
          {HOTELS.map((h) => (
            <div key={h.id} className="bg-panel-solid rounded-xl p-3">
              <p className="text-sm">{h.name} - {h.city}</p>
              <button onClick={() => setBooked((prev) => [...new Set([...prev, h.id])])} className="mt-2 cs-btn rounded-2xl w-full text-xs">
                {booked.includes(h.id) ? "Zarezerwowane" : `Bookuj od ${h.price} PLN/noc`}
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs t-secondary flex items-center gap-2"><Ticket size={12} /> Bilety i rezerwacje trzymane w jednym miejscu.</p>
    </div>
  );
}
