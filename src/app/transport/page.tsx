"use client";
import Link from "next/link";
import { BusFront, ChevronLeft, Clock3, CreditCard, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

const DEPARTURES = [
  { id: "d1", line: "M1", dir: "Kabaty", minutes: 3, color: "#ef4444" },
  { id: "d2", line: "175", dir: "Lotnisko Chopina", minutes: 6, color: "#3b82f6" },
  { id: "d3", line: "17", dir: "Służewiec", minutes: 8, color: "#8b5cf6" },
];

export default function TransportPage() {
  const [from, setFrom] = useState("Centrum");
  const [to, setTo] = useState("Mokotów");
  const [ticketBought, setTicketBought] = useState(false);

  const route = useMemo(() => [
    `Start: ${from}`, "Metro M1 - 4 przystanki", "Przesiadka: Tramwaj 17", `Cel: ${to}`,
  ], [from, to]);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em] flex items-center gap-2"><BusFront size={18} className="t-accent" /> TRANSPORT</h1>
      </header>

      <section className="cs-card p-4 animate-fadeInUp stagger-1">
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3">PLANER TRASY</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="cs-input !py-2.5 !text-xs" placeholder="Skąd" />
          <input value={to} onChange={(e) => setTo(e.target.value)} className="cs-input !py-2.5 !text-xs" placeholder="Dokąd" />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {route.map((step, i) => (
            <div key={step} className="flex items-center gap-2 text-xs normal-case" style={{ color: "var(--app-text)", animationDelay: `${i * 0.05}s` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? "#22c55e" : i === route.length - 1 ? "#ef4444" : "var(--app-accent)" }} />
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="cs-card p-4 animate-fadeInUp stagger-2">
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3">ODJAZDY W POBLIŻU</p>
        <div className="flex flex-col gap-2">
          {DEPARTURES.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl p-3" style={{ background: "var(--app-input-bg)" }}>
              <div className="flex items-center gap-3">
                <span className="w-10 text-center text-xs font-black rounded-lg py-1" style={{ background: d.color, color: "#fff" }}>{d.line}</span>
                <span className="text-xs font-medium normal-case">{d.dir}</span>
              </div>
              <span className="text-xs t-accent font-bold flex items-center gap-1"><Clock3 size={12} /> {d.minutes} min</span>
            </div>
          ))}
        </div>
      </section>

      <button onClick={() => setTicketBought(true)} className="cs-btn rounded-2xl flex items-center justify-center gap-2 text-xs animate-fadeInUp stagger-3">
        <CreditCard size={16} /> {ticketBought ? "BILET 20 MIN AKTYWNY ✓" : "KUP BILET 20 MIN (4.40 PLN)"}
      </button>
      <p className="text-[9px] t-tertiary flex items-center gap-1 justify-center"><MapPin size={10} /> Bilet spięty z lokalizacją</p>
    </div>
  );
}
