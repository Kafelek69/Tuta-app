"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CarFront, ChevronLeft, Landmark, QrCode, UserRound } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type GovTab = "id" | "driver" | "qr";

export default function GovPage() {
  const [tab, setTab] = useState<GovTab>("id");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em] flex items-center gap-2">
          <Landmark size={18} className="t-accent" /> mOBYWATEL
        </h1>
      </header>

      <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl animate-fadeInUp stagger-1" style={{ background: "var(--app-input-bg)" }}>
        {(["id", "driver", "qr"] as GovTab[]).map((t, i) => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2.5 rounded-xl text-[10px] tracking-[0.15em] font-bold transition-all ${
              tab === t ? "text-black" : "t-secondary"
            }`}
            style={tab === t ? { background: "linear-gradient(135deg, #fca000, #e09000)" } : {}}
          >
            {["mDOWÓD", "PRAWO JAZDY", "WERYFIKACJA"][i]}
          </button>
        ))}
      </div>

      {tab === "id" && (
        <section className="cs-card p-5 animate-fadeInUp" style={{ borderColor: "rgba(252,160,0,0.2)" }}>
          <div className="flex items-center justify-between">
            <p className="font-bold tracking-[0.15em]">mDowód</p>
            <BadgeCheck size={20} className="text-green-500" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
              <UserRound className="t-secondary" />
            </div>
            <div>
              <p className="text-base font-bold">JAN KOWALSKI</p>
              <p className="text-xs t-secondary mt-1">ważny do: 01.09.2032</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl p-3" style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
            <p className="text-xs t-secondary">Numer dokumentu</p>
            <p className="font-bold mt-1 tracking-wide">ABA 123456</p>
          </div>
        </section>
      )}

      {tab === "driver" && (
        <section className="cs-card p-5 animate-fadeInUp">
          <div className="flex items-center gap-2">
            <CarFront size={18} className="t-accent" />
            <p className="font-bold tracking-[0.15em]">Prawo jazdy</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
              <p className="text-xs t-secondary">Kategorie</p>
              <p className="mt-1 font-bold">B, AM</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
              <p className="text-xs t-secondary">Punkty karne</p>
              <p className="mt-1 font-bold text-green-500">0</p>
            </div>
          </div>
        </section>
      )}

      {tab === "qr" && (
        <section className="cs-card p-5 flex flex-col items-center gap-4 text-center animate-fadeInUp">
          <QrCode className="t-accent" size={28} />
          <div className="bg-white p-3 rounded-xl">
            <QRCodeCanvas value="superapp://gov/verify?id=ABA123456&ts=2026" size={190} />
          </div>
          <p className="text-sm t-secondary normal-case">Kod do szybkiej weryfikacji tożsamości.</p>
        </section>
      )}
    </div>
  );
}
