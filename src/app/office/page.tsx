"use client";

import Link from "next/link";
import { ChevronLeft, FileSpreadsheet, FileText, Presentation } from "lucide-react";
import { useState } from "react";

type DocType = "doc" | "sheet" | "slides";

export default function OfficePage() {
  const [active, setActive] = useState<DocType>("doc");
  const [content, setContent] = useState("Plan tygodnia:\n- sprint\n- spotkania\n- KPI");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Office</h1>
      </header>

      <div className="grid grid-cols-3 gap-2 bg-panel-solid p-1 rounded-xl">
        <button onClick={() => setActive("doc")} className={`py-2 rounded text-xs ${active === "doc" ? "bg-cs-orange text-black" : "t-secondary"}`}><FileText size={14} className="mx-auto" /> Doc</button>
        <button onClick={() => setActive("sheet")} className={`py-2 rounded text-xs ${active === "sheet" ? "bg-cs-orange text-black" : "t-secondary"}`}><FileSpreadsheet size={14} className="mx-auto" /> Sheet</button>
        <button onClick={() => setActive("slides")} className={`py-2 rounded text-xs ${active === "slides" ? "bg-cs-orange text-black" : "t-secondary"}`}><Presentation size={14} className="mx-auto" /> Slides</button>
      </div>

      <section className="cs-card p-4 flex-1">
        <p className="text-xs t-secondary mb-2">Edytor: {active.toUpperCase()}</p>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-[45dvh] bg-panel-solid  rounded-xl p-3 text-sm normal-case" />
        <button className="mt-3 cs-btn rounded-2xl w-full text-xs py-2">Zapisz w chmurze Tuta</button>
      </section>
    </div>
  );
}
