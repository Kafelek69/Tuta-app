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
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><BriefcaseBusiness size={18} className="text-cs-orange" /> Praca</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj ofert..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-md pl-9 pr-3 py-3 text-sm" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((job) => {
          const applied = appliedIds.includes(job.id);
          return (
            <article key={job.id} className="cs-panel p-4 rounded-md border border-white/10">
              <h2 className="font-bold text-sm">{job.title}</h2>
              <p className="text-xs text-white/60 mt-1 flex items-center gap-1"><Building2 size={12} /> {job.company} - {job.city}</p>
              <p className="text-cs-orange text-sm font-bold mt-2">{job.salary}</p>
              <button
                onClick={() => setAppliedIds((prev) => (applied ? prev : [...prev, job.id]))}
                className={`mt-3 w-full rounded-md py-2 text-xs font-bold tracking-widest ${applied ? "bg-green-600/20 border border-green-500 text-green-400" : "cs-btn"}`}
              >
                {applied ? "WYSŁANO CV" : "APLIKUJ"}
              </button>
            </article>
          );
        })}
      </div>

      <button className="cs-btn rounded-md mt-auto flex items-center justify-center gap-2"><Send size={14} /> Mój profil zawodowy</button>
    </div>
  );
}
