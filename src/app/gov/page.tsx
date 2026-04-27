"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CarFront, ChevronLeft, Landmark, QrCode, UserRound } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type GovTab = "id" | "driver" | "qr";

export default function GovPage() {
  const [tab, setTab] = useState<GovTab>("id");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
          <Landmark size={18} className="text-cs-orange" />
          mObywatel
        </h1>
      </header>

      <div className="grid grid-cols-3 gap-2 bg-[#181818] p-1 rounded-xl">
        <button onClick={() => setTab("id")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "id" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          mDOWÓD
        </button>
        <button onClick={() => setTab("driver")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "driver" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          PRAWO JAZDY
        </button>
        <button onClick={() => setTab("qr")} className={`py-2 rounded-lg text-[11px] tracking-widest font-bold ${tab === "qr" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          WERYFIKACJA
        </button>
      </div>

      {tab === "id" && (
        <section className="cs-panel rounded-xl p-5 border border-cs-orange/30">
          <div className="flex items-center justify-between">
            <p className="font-bold tracking-widest">mDowód</p>
            <BadgeCheck size={20} className="text-green-500" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#151515] border border-white/15 flex items-center justify-center">
              <UserRound className="text-white/70" />
            </div>
            <div>
              <p className="text-base font-bold">JAN KOWALSKI</p>
              <p className="text-xs text-white/60 mt-1">ważny do: 01.09.2032</p>
            </div>
          </div>
          <div className="mt-4 bg-[#151515] rounded-md p-3 border border-white/10">
            <p className="text-xs text-white/60">Numer dokumentu</p>
            <p className="font-bold mt-1 tracking-wide">ABA 123456</p>
          </div>
        </section>
      )}

      {tab === "driver" && (
        <section className="cs-panel rounded-xl p-5">
          <div className="flex items-center gap-2">
            <CarFront size={18} className="text-cs-orange" />
            <p className="font-bold tracking-widest">Prawo jazdy</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#151515] rounded-md p-3 border border-white/10">
              <p className="text-xs text-white/60">Kategorie</p>
              <p className="mt-1 font-bold">B, AM</p>
            </div>
            <div className="bg-[#151515] rounded-md p-3 border border-white/10">
              <p className="text-xs text-white/60">Punkty karne</p>
              <p className="mt-1 font-bold text-green-500">0</p>
            </div>
          </div>
        </section>
      )}

      {tab === "qr" && (
        <section className="cs-panel rounded-xl p-5 flex flex-col items-center gap-4 text-center">
          <QrCode className="text-cs-orange" size={28} />
          <div className="bg-white p-3 rounded-lg">
            <QRCodeCanvas value="superapp://gov/verify?id=ABA123456&ts=2026-04-27T12:00:00Z" size={190} />
          </div>
          <p className="text-sm text-white/80 normal-case">Kod do szybkiej weryfikacji tożsamości.</p>
        </section>
      )}
    </div>
  );
}
