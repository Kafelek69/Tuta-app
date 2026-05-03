"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Edit2, MapPin, Calendar, Users, Heart, Image, Settings } from "lucide-react";

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className="flex items-center justify-center rounded-full font-black text-black tracking-wider shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.28 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function ProfilePage() {
  const [me, setMe] = useState<{ username: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("Kocham technologię i kawę ☕");
  const [posts, setPosts] = useState(0);
  const [friends, setFriends] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then((d: { user?: { username: string } }) => { if (d.user) setMe(d.user); });
    fetch("/api/feed/posts?limit=100").then(r => r.json()).then((d: { posts?: unknown[] }) => setPosts(d.posts?.length || 0));
    fetch("/api/social/friends").then(r => r.json()).then((d: { friends?: unknown[] }) => setFriends(d.friends?.length || 0));
  }, []);

  if (!me) return <div className="min-h-[100dvh] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em]">PROFIL</h1>
        <Link href="/profile" className="t-accent p-2"><Settings size={18} /></Link>
      </header>

      <div className="mt-6 flex flex-col items-center animate-fadeInUp stagger-1">
        <div className="p-1 rounded-full" style={{ background: "linear-gradient(135deg, #fca000, #f97316)" }}>
          <div className="p-1 rounded-full" style={{ background: "var(--app-bg)" }}>
            <Avatar name={me.username} size={90} />
          </div>
        </div>
        <h2 className="text-xl font-black tracking-[0.15em] mt-3">{me.username}</h2>
        {editing ? (
          <div className="flex gap-2 mt-2 w-full max-w-xs">
            <input value={bio} onChange={(e) => setBio(e.target.value)} className="cs-input !py-2 !text-xs flex-1 !normal-case" />
            <button onClick={() => setEditing(false)} className="cs-btn !py-2 !px-3 text-xs rounded-lg">OK</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs t-secondary mt-1 normal-case flex items-center gap-1 hover:t-accent transition-colors">
            {bio} <Edit2 size={10} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 animate-fadeInUp stagger-2">
        {[{ n: posts, l: "Posty", icon: <Image size={16} /> }, { n: friends, l: "Znajomi", icon: <Users size={16} /> }, { n: 42, l: "Polubienia", icon: <Heart size={16} /> }].map((s) => (
          <div key={s.l} className="cs-card p-4 flex flex-col items-center gap-1">
            <div className="t-accent">{s.icon}</div>
            <span className="text-lg font-black">{s.n}</span>
            <span className="text-[9px] t-tertiary font-bold tracking-wider">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 animate-fadeInUp stagger-3">
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3">INFORMACJE</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: <MapPin size={14} />, text: "Warszawa, Polska" },
            { icon: <Calendar size={14} />, text: "Dołączono: Maj 2026" },
          ].map((info, i) => (
            <div key={i} className="cs-card p-3 flex items-center gap-3">
              <span className="t-accent">{info.icon}</span>
              <span className="text-xs normal-case">{info.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
