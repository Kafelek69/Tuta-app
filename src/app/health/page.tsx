"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, HeartPulse, QrCode, ShieldCheck, Stethoscope, TimerReset } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type HealthTab = "card" | "prescriptions" | "visit";

export default function HealthPage() {
  const [tab, setTab] = useState<HealthTab>("card");
  const [ticket] = useState(() => `PL-IKP-${Math.floor(100000 + Math.random() * 900000)}`);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
          <HeartPulse size={18} className="t-accent" />
          Zdrowie / ID
        </h1>
      </header>

      <div className="grid grid-cols-3 gap-2 bg-panel-solid p-1 rounded-xl">
        <button onClick={() => setTab("card")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "card" ? "bg-cs-orange text-black" : "t-secondary"}`}>
          KARTA
        </button>
        <button onClick={() => setTab("prescriptions")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "prescriptions" ? "bg-cs-orange text-black" : "t-secondary"}`}>
          E-RECEPTY
        </button>
        <button onClick={() => setTab("visit")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "visit" ? "bg-cs-orange text-black" : "t-secondary"}`}>
          WIZYTA
        </button>
      </div>

      {tab === "card" && (
        <section className="cs-card p-5 border border-cs-orange/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs t-secondary">Karta pacjenta</p>
              <p className="text-base font-bold tracking-wide mt-1">JAN KOWALSKI</p>
            </div>
            <ShieldCheck className="text-green-500" size={20} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-panel-solid rounded-xl p-3 ">
              <p className="text-[10px] t-secondary">PESEL</p>
              <p className="font-bold tracking-wide mt-1">92010112345</p>
            </div>
            <div className="bg-panel-solid rounded-xl p-3 ">
              <p className="text-[10px] t-secondary">Ubezpieczenie</p>
              <p className="font-bold tracking-wide mt-1 text-green-500">AKTYWNE</p>
            </div>
          </div>

          <div className="mt-4 bg-panel-solid rounded-xl p-3 ">
            <p className="text-[10px] t-secondary">Alergie</p>
            <p className="text-sm normal-case mt-1">Penicylina, pyłki brzozy</p>
          </div>
        </section>
      )}

      {tab === "prescriptions" && (
        <section className="cs-card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="t-accent" />
            <p className="text-sm font-bold tracking-widest">Kod do apteki</p>
          </div>

          <div className="bg-white rounded-lg p-3 self-center">
            <QRCodeCanvas value={ticket} size={180} />
          </div>
          <p className="text-center text-sm tracking-wide">{ticket}</p>

          <div className="bg-panel-solid rounded-xl p-3 ">
            <p className="text-xs t-secondary">Aktywne leki</p>
            <p className="text-sm mt-1 normal-case">Metformina 500 mg - 2x dziennie</p>
            <p className="text-sm mt-1 normal-case">Witamina D3 - 1x dziennie</p>
          </div>
        </section>
      )}

      {tab === "visit" && (
        <section className="cs-card p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="t-accent" />
            <p className="text-sm font-bold tracking-widest">Najbliższa wizyta</p>
          </div>

          <div className="bg-panel-solid rounded-xl p-4 ">
            <p className="text-sm">Lekarz rodzinny</p>
            <p className="text-xs t-secondary mt-1">Przychodnia Centrum - Warszawa</p>
            <p className="text-base font-bold mt-3">30.04.2026, 09:20</p>
          </div>

          <button className="cs-btn rounded-2xl flex items-center justify-center gap-2">
            <TimerReset size={18} />
            Przełóż termin
          </button>
        </section>
      )}
    </div>
  );
}
