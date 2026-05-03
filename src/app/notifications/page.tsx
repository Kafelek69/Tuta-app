"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, ChevronLeft, Heart, MessageSquare, Star, Users } from "lucide-react";

type Notif = { id: number; type: string; title: string; body: string; read: number; created_at: string };

const typeIcons: Record<string, React.ReactNode> = {
  welcome: <Star size={16} className="text-[#fca000]" />,
  social: <Users size={16} className="text-purple-400" />,
  like: <Heart size={16} className="text-red-400" />,
  message: <MessageSquare size={16} className="text-blue-400" />,
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/notifications");
    const d = (await res.json()) as { notifications?: Notif[] };
    setNotifs(d.notifications || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markRead", id }) });
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: 1 } : n));
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markAllRead" }) });
    setNotifs(p => p.map(n => ({ ...n, read: 1 })));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">POWIADOMIENIA</h1>
          {unreadCount > 0 && <p className="text-[10px] text-[#fca000] tracking-wider">{unreadCount} NOWYCH</p>}
        </div>
        <button onClick={markAllRead} className="t-accent p-2" title="Oznacz wszystkie"><CheckCheck size={18} /></button>
      </header>

      <div className="mt-4 flex flex-col gap-2">
        {loading && <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && notifs.length === 0 && (
          <div className="text-center py-16 opacity-40"><Bell size={40} className="mx-auto mb-3" /><p className="text-xs tracking-wider">Brak powiadomień</p></div>
        )}
        {notifs.map((n, i) => (
          <div key={n.id}
            onClick={() => !n.read && markRead(n.id)}
            className={`cs-card p-4 flex items-start gap-3 cursor-pointer animate-fadeInUp ${!n.read ? "border-l-2 border-l-[#fca000]" : "opacity-60"}`}
            style={{ animationDelay: `${0.05 * i}s`, opacity: 0 }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--app-input-bg)" }}>
              {typeIcons[n.type] || <Bell size={16} className="t-accent" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wider">{n.title}</p>
              <p className="text-[11px] t-secondary normal-case mt-0.5">{n.body}</p>
              <p className="text-[9px] t-tertiary mt-1">{new Date(n.created_at).toLocaleString("pl-PL")}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-[#fca000] mt-1 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
