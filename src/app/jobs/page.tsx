"use client";

import Link from "next/link";
import { BriefcaseBusiness, Building2, ChevronLeft, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";

const JOBS = [
  { id: "j1", title: "Frontend Developer (React/Next)", company: "PolSoft SA", city: "Warszawa", salary: "16 000 - 22 000 PLN" },
  { id: "j2", title: "Product Designer", company: "FinTech Polska", city: "Kraków", salary: "12 000 - 17 000 PLN" },
  { id: "j3", title: "Backend Node.js Engineer", company: "CloudRail", city: "Wrocław", salary: "18 000 - 25 000 PLN" },
];

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      JOBS.filter((job) =>
        `${job.title} ${job.company} ${job.city}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><BriefcaseBusiness size={18} className="t-accent" /> Praca</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-tertiary" size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj ofert..." className="w-full bg-panel-solid  rounded-xl pl-9 pr-3 py-3 text-sm" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((job) => {
          const applied = appliedIds.includes(job.id);
          return (
            <article key={job.id} className="cs-card p-4">
              <h2 className="font-bold text-sm">{job.title}</h2>
              <p className="text-xs t-secondary mt-1 flex items-center gap-1"><Building2 size={12} /> {job.company} - {job.city}</p>
              <p className="t-accent text-sm font-bold mt-2">{job.salary}</p>
              <button
                onClick={() => setAppliedIds((prev) => (applied ? prev : [...prev, job.id]))}
                className={`mt-3 w-full rounded-xl py-2 text-xs font-bold tracking-widest ${applied ? "bg-green-600/20 border border-green-500 text-green-400" : "cs-btn"}`}
              >
                {applied ? "WYSŁANO CV" : "APLIKUJ"}
              </button>
            </article>
          );
        })}
      </div>

      <button className="cs-btn rounded-2xl mt-auto flex items-center justify-center gap-2"><Send size={14} /> Mój profil zawodowy</button>
    </div>
  );
}
