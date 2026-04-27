"use client";

import Link from "next/link";
import { ChevronLeft, Inbox, MailPlus, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";

const INITIAL_MAILS = [
  { id: "m1", from: "rekrutacja@polsoft.pl", subject: "Zaproszenie na rozmowę", preview: "Dziękujemy za aplikację...", unread: true },
  { id: "m2", from: "support@tuta.app", subject: "Bezpieczeństwo konta", preview: "Włącz 2FA dla lepszej ochrony", unread: false },
];

export default function MailPage() {
  const [query, setQuery] = useState("");
  const [mails, setMails] = useState(INITIAL_MAILS);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const filtered = useMemo(
    () => mails.filter((m) => `${m.from} ${m.subject}`.toLowerCase().includes(query.toLowerCase())),
    [mails, query],
  );

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Mail</h1>
      </header>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj maili..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm" />
        </div>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2 flex items-center gap-2"><Inbox size={14} /> Skrzynka odbiorcza</p>
        <div className="space-y-2">
          {filtered.map((mail) => (
            <article key={mail.id} className="bg-[#1a1a1a] rounded-md p-3 border border-white/10">
              <p className="text-xs text-cs-orange">{mail.from}</p>
              <p className={`text-sm mt-1 ${mail.unread ? "font-bold" : ""}`}>{mail.subject}</p>
              <p className="text-xs text-white/60 mt-1 normal-case">{mail.preview}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cs-panel p-4 rounded-md border border-white/10">
        <p className="text-xs text-white/60 mb-2 flex items-center gap-2"><MailPlus size={14} /> Nowa wiadomość</p>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Temat" className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-sm mb-2" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Treść..." className="w-full min-h-[80px] bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-sm" />
        <button
          onClick={() => {
            if (!subject.trim()) return;
            setMails((prev) => [{ id: `local-${Date.now()}`, from: "Ja", subject, preview: body.slice(0, 40), unread: false }, ...prev]);
            setSubject("");
            setBody("");
          }}
          className="mt-2 cs-btn rounded-md w-full text-xs py-2"
        >
          <Send size={12} className="inline mr-1" /> Wyślij
        </button>
      </section>
    </div>
  );
}
