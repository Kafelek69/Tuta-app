"use client";

import Link from "next/link";
import { BusFront, ChevronLeft, Clock3, CreditCard, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

const DEPARTURES = [
  { id: "d1", line: "M1", dir: "Kabaty", minutes: 3 },
  { id: "d2", line: "175", dir: "Lotnisko Chopina", minutes: 6 },
  { id: "d3", line: "17", dir: "Służewiec", minutes: 8 },
];

export default function TransportPage() {
  const [from, setFrom] = useState("Centrum");
  const [to, setTo] = useState("Mokotów");
  const [ticketBought, setTicketBought] = useState(false);

  const route = useMemo(
    () => [
      `Start: ${from}`,
      "Metro M1 - 4 przystanki",
      "Przesiadka: Tramwaj 17",
      `Cel: ${to}`,
    ],
    [from, to],
  );

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><BusFront size={18} className="text-cs-orange" /> Komunikacja</h1>
      </header>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2">Planer przejazdu (Jakdojade + mPay)</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-md p-2 text-sm" />
          <input value={to} onChange={(e) => setTo(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-md p-2 text-sm" />
        </div>
        <div className="mt-3 space-y-1 text-sm">
          {route.map((step) => <p key={step} className="normal-case text-white/85">{step}</p>)}
        </div>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2">Odjazdy w pobliżu</p>
        <div className="space-y-2">
          {DEPARTURES.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-[#1a1a1a] rounded-md p-3">
              <p className="text-sm font-bold">{d.line} - <span className="font-normal">{d.dir}</span></p>
              <p className="text-cs-orange text-sm flex items-center gap-1"><Clock3 size={14} /> {d.minutes} min</p>
            </div>
          ))}
        </div>
      </section>

      <button onClick={() => setTicketBought(true)} className="cs-btn rounded-md flex items-center justify-center gap-2">
        <CreditCard size={16} /> {ticketBought ? "Bilet 20 min aktywny" : "Kup bilet 20 min (4.40 PLN)"}
      </button>
      <p className="text-xs text-white/50 flex items-center gap-1"><MapPin size={12} /> Bilet i trasa spięte z lokalizacją telefonu</p>
    </div>
  );
}
