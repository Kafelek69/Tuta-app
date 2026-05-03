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
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Mail</h1>
      </header>

      <section className="cs-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-tertiary" size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj maili..." className="w-full bg-panel-solid  rounded-xl pl-9 pr-3 py-2 text-sm" />
        </div>
      </section>

      <section className="cs-card p-4">
        <p className="text-xs t-secondary mb-2 flex items-center gap-2"><Inbox size={14} /> Skrzynka odbiorcza</p>
        <div className="space-y-2">
          {filtered.map((mail) => (
            <article key={mail.id} className="bg-panel-solid rounded-xl p-3 ">
              <p className="text-xs t-accent">{mail.from}</p>
              <p className={`text-sm mt-1 ${mail.unread ? "font-bold" : ""}`}>{mail.subject}</p>
              <p className="text-xs t-secondary mt-1 normal-case">{mail.preview}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cs-card p-4">
        <p className="text-xs t-secondary mb-2 flex items-center gap-2"><MailPlus size={14} /> Nowa wiadomość</p>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Temat" className="w-full bg-panel-solid  rounded-xl px-3 py-2 text-sm mb-2" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Treść..." className="w-full min-h-[80px] bg-panel-solid  rounded-xl px-3 py-2 text-sm" />
        <button
          onClick={() => {
            if (!subject.trim()) return;
            setMails((prev) => [{ id: `local-${Date.now()}`, from: "Ja", subject, preview: body.slice(0, 40), unread: false }, ...prev]);
            setSubject("");
            setBody("");
          }}
          className="mt-2 cs-btn rounded-2xl w-full text-xs py-2"
        >
          <Send size={12} className="inline mr-1" /> Wyślij
        </button>
      </section>
    </div>
  );
}
