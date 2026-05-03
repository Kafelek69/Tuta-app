"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, ChevronLeft, Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };

const AI_RESPONSES: Record<string, string> = {
  "pogoda": "☀️ Dzisiaj w Warszawie będzie słonecznie, temperatura ok. 22°C. Weź okulary przeciwsłoneczne!",
  "jedzenie": "🍕 Polecam pizzerię Da Grasso — mają świetną margheritę! Możesz zamówić przez zakładkę Jedzenie w apce.",
  "portfel": "💰 Twoje saldo możesz sprawdzić w zakładce Portfel. Możesz doładować konto lub wysłać przelew.",
  "czat": "💬 Wejdź w Czat, dodaj znajomego i zacznij rozmowę! Wszystkie wiadomości są szyfrowane E2E.",
  "pomoc": "🤖 Mogę pomóc z: pogodą, jedzeniem, portfelem, czatem, relacjami, rolkami, mapami, transportem. Zapytaj o coś!",
  "relacje": "📸 Stories znajdziesz w Relacjach. Możesz dodać swoją relację — zniknie po 24h!",
  "rolki": "🎬 Rolki to krótkie video jak na TikToku. Przesuń w górę aby zobaczyć następną!",
  "mapy": "🗺️ W zakładce Mapy możesz znaleźć trasę, sprawdzić transport publiczny i zobaczyć okoliczne miejsca.",
  "transport": "🚌 Transport pokaże Ci odjazdy komunikacji miejskiej, planer trasy i pozwoli kupić bilet.",
};

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return `🤖 Hmm, nie mam gotowej odpowiedzi na to pytanie. Spróbuj zapytać o: pogodę, jedzenie, portfel, czat, relacje, rolki, mapy lub transport!`;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Cześć! 👋 Jestem Tuta AI — Twój asystent w super aplikacji. O co chcesz zapytać?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(p => [...p, { role: "user", text: userMsg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages(p => [...p, { role: "ai", text: getAIResponse(userMsg) }]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="h-[100dvh] max-w-md mx-auto flex flex-col safe-bottom">
      <header className="cs-header mx-3 mt-3 animate-fadeInUp shrink-0">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">TUTA AI</h1>
          <p className="text-[10px] t-tertiary tracking-wider mt-0.5">TWÓJ ASYSTENT</p>
        </div>
        <Sparkles size={20} className="t-accent" />
      </header>

      <div className="flex-1 overflow-y-auto px-3 mt-3 flex flex-col gap-2.5 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
            style={{ animation: "fadeInUp 0.3s ease-out forwards", animationDelay: `${i * 0.05}s` }}>
            {m.role === "ai" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #fca000, #e09000)" }}>
                <Bot size={16} className="text-black" />
              </div>
            )}
            <div className={`px-4 py-3 text-[13px] normal-case leading-relaxed ${
              m.role === "user"
                ? "rounded-2xl rounded-tr-md text-black font-medium" : "cs-card rounded-2xl rounded-tl-md !p-3.5"
            }`} style={m.role === "user" ? { background: "linear-gradient(135deg, #fca000, #e09000)" } : {}}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 self-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #fca000, #e09000)" }}>
              <Bot size={16} className="text-black" />
            </div>
            <div className="cs-card !p-3 rounded-2xl rounded-tl-md flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/30" style={{ animation: `typing 1.2s infinite ${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="px-3 pb-3 pt-2 flex gap-2 shrink-0">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Zapytaj o coś..." className="cs-input flex-1 !rounded-full !pl-5 !py-3" />
        <button type="submit" disabled={!input.trim()} className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
          style={{ background: input.trim() ? "linear-gradient(135deg, #fca000, #e09000)" : "var(--app-input-bg)" }}>
          <Send size={18} className={input.trim() ? "text-black" : "t-tertiary"} />
        </button>
      </form>
    </div>
  );
}
