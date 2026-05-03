"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare, Wallet, Landmark, Users, Camera, PlaySquare, BriefcaseBusiness, TramFront, Plane, MapPinned, Tv,
  Mail, FileText, CalendarDays, ShoppingCart, GraduationCap, LogOut, ChevronRight, Sparkles,
  HeartPulse, Utensils, Bell, User, Bot, Music, Gamepad2, Store,
} from "lucide-react";

function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className="flex items-center justify-center rounded-full font-black text-black tracking-wider shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.32 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

type AppLink = { href: string; icon: React.ReactNode; label: string };

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      const r = await fetch("/api/auth/me");
      if (!r.ok) { router.replace("/auth"); return; }
      const p = (await r.json()) as { user?: { username: string } };
      if (!p.user) { router.replace("/auth"); return; }
      setCurrentUser(p.user.username);
      setLoading(false);

      fetch("/api/wallet/balance").then(r => r.json()).then((d: { balance?: number }) => setBalance(d.balance ?? null));
      fetch("/api/notifications").then(r => r.json()).then((d: { notifications?: { read: number }[] }) => {
        setUnread(d.notifications?.filter(n => !n.read).length || 0);
      });
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth"); router.refresh();
  };

  if (loading) return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs t-tertiary tracking-[0.2em]">ŁADOWANIE...</p>
      </div>
    </div>
  );

  const socialLinks: AppLink[] = [
    { href: "/chat", icon: <MessageSquare size={24} />, label: "Czat" },
    { href: "/feed", icon: <Users size={24} />, label: "Tablica" },
    { href: "/stories", icon: <Camera size={24} />, label: "Relacje" },
    { href: "/reels", icon: <PlaySquare size={24} />, label: "Rolki" },
  ];
  const serviceLinks: AppLink[] = [
    { href: "/food", icon: <Utensils size={24} />, label: "Jedzenie" },
    { href: "/wallet", icon: <Wallet size={24} />, label: "Płatności" },
    { href: "/gov", icon: <Landmark size={24} />, label: "mObywatel" },
    { href: "/health", icon: <HeartPulse size={24} />, label: "Zdrowie" },
  ];
  const moreLinks: AppLink[] = [
    { href: "/jobs", icon: <BriefcaseBusiness size={22} />, label: "Praca" },
    { href: "/transport", icon: <TramFront size={22} />, label: "Transport" },
    { href: "/travel", icon: <Plane size={22} />, label: "Travel" },
    { href: "/maps", icon: <MapPinned size={22} />, label: "Mapy" },
    { href: "/media", icon: <Tv size={22} />, label: "Media" },
  ];
  const newLinks: AppLink[] = [
    { href: "/ai", icon: <Bot size={22} />, label: "Tuta AI" },
    { href: "/music", icon: <Music size={22} />, label: "Muzyka" },
    { href: "/games", icon: <Gamepad2 size={22} />, label: "Gry" },
    { href: "/marketplace", icon: <Store size={22} />, label: "Market" },
    { href: "/notifications", icon: <Bell size={22} />, label: "Alerty" },
  ];
  const prodLinks: AppLink[] = [
    { href: "/workspace", icon: <GraduationCap size={22} />, label: "Teams" },
    { href: "/mail", icon: <Mail size={22} />, label: "Mail" },
    { href: "/office", icon: <FileText size={22} />, label: "Office" },
    { href: "/calendar", icon: <CalendarDays size={22} />, label: "Kalendarz" },
    { href: "/shop", icon: <ShoppingCart size={22} />, label: "Sklep" },
  ];

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      {/* Header */}
      <header className="cs-header animate-fadeInUp">
        <div className="flex-1">
          <h1 className="text-xl font-black tracking-[0.2em]">TUTA<span className="t-accent">.OS</span></h1>
        </div>
        <Link href="/profile" className="relative">
          <Avatar name={currentUser} size={34} />
        </Link>
        <Link href="/notifications" className="relative p-2">
          <Bell size={18} className="t-secondary" />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center font-bold">{unread}</span>}
        </Link>
        <button onClick={handleLogout} className="t-tertiary hover:t-secondary p-2"><LogOut size={18} /></button>
      </header>

      {/* Wallet */}
      <div className="rounded-2xl p-5 animate-fadeInUp stagger-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(252,160,0,0.15), var(--app-panel))", border: "1px solid rgba(252,160,0,0.2)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fca000, transparent)" }} />
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold">TWÓJ PORTFEL</p>
        <div className="text-3xl font-black mt-1">
          {balance !== null ? balance.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) : "..."} <span className="t-accent text-2xl">PLN</span>
        </div>
        <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1"><Sparkles size={10} /> +2.4% ten tydzień</p>
        <div className="mt-4 flex gap-3">
          <Link href="/wallet" className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold tracking-wider text-black"
            style={{ background: "linear-gradient(135deg, #fca000, #e09000)" }}>PORTFEL</Link>
          <button className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider cs-btn-outline !py-2.5">WYŚLIJ</button>
        </div>
      </div>

      <Section title="KOMUNIKACJA" delay={2} links={socialLinks} cols={4} />
      <Section title="USŁUGI & ŻYCIE" delay={3} links={serviceLinks} cols={4} />
      <Section title="NOWE FUNKCJE" delay={4} links={newLinks} cols={5} small />
      <Section title="PRACA & MEDIA" delay={5} links={moreLinks} cols={5} small />
      <Section title="PRODUKTYWNOŚĆ" delay={6} links={prodLinks} cols={5} small />

      <footer className="text-center text-[9px] t-tertiary tracking-[0.2em] py-4">TUTA SUPER APP V2.0.0 · E2E ENCRYPTED</footer>
    </div>
  );
}

function Section({ title, delay, links, cols, small }: { title: string; delay: number; links: AppLink[]; cols: number; small?: boolean }) {
  return (
    <div className={`cs-card p-4 animate-fadeInUp stagger-${Math.min(delay, 6)}`}>
      <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3 flex items-center justify-between">
        {title}<ChevronRight size={12} className="t-tertiary" />
      </p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-2 py-2 group transition-all active:scale-95">
            <div className={`${small ? "p-3" : "p-3.5"} rounded-2xl transition-all duration-300 group-hover:scale-105`}
              style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
              <div className="t-accent group-hover:scale-110 transition-transform duration-200">{link.icon}</div>
            </div>
            <span className={`font-bold tracking-wider text-center t-secondary group-hover:t-primary transition-colors ${small ? "text-[8px]" : "text-[9px]"}`}>
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}