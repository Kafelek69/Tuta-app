"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, MapPin, Search, ShoppingBag, Tag } from "lucide-react";

const ITEMS = [
  { id: 1, title: "iPhone 15 Pro Max", price: 4200, category: "Elektronika", location: "Warszawa", seller: "TechMaster", color: "#f97316" },
  { id: 2, title: "Nike Air Max 90", price: 350, category: "Moda", location: "Kraków", seller: "SneakerHead", color: "#8b5cf6" },
  { id: 3, title: "MacBook Pro 14\"", price: 6800, category: "Elektronika", location: "Gdańsk", seller: "AppleFan", color: "#06b6d4" },
  { id: 4, title: "Rower MTB Scott", price: 2100, category: "Sport", location: "Wrocław", seller: "BikePro", color: "#10b981" },
  { id: 5, title: "PS5 + 3 gry", price: 1800, category: "Gaming", location: "Poznań", seller: "GameZone", color: "#ec4899" },
  { id: 6, title: "Canon EOS R6 II", price: 8500, category: "Foto", location: "Łódź", seller: "PhotoPro", color: "#f59e0b" },
  { id: 7, title: "Sofa narożna IKEA", price: 1200, category: "Dom", location: "Warszawa", seller: "HomeDeco", color: "#6366f1" },
  { id: 8, title: "Gitara Fender", price: 3200, category: "Muzyka", location: "Katowice", seller: "MusicShop", color: "#14b8a6" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [category, setCategory] = useState("Wszystkie");
  const categories = ["Wszystkie", "Elektronika", "Moda", "Sport", "Gaming", "Dom"];

  const filtered = ITEMS.filter(i =>
    (category === "Wszystkie" || i.category === category) &&
    (!search || i.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em]">MARKETPLACE</h1>
        <ShoppingBag size={20} className="t-accent" />
      </header>

      <div className="mt-3 relative animate-fadeInUp stagger-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 t-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Szukaj przedmiotów..." className="cs-input !pl-10 !rounded-full" />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar animate-fadeInUp stagger-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${
              c === category ? "text-black" : "t-secondary"
            }`}
            style={c === category ? { background: "linear-gradient(135deg, #fca000, #e09000)" } : { background: "var(--app-input-bg)", border: "1px solid var(--app-panel-border)" }}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {filtered.map((item, i) => (
          <div key={item.id} className="cs-card overflow-hidden animate-fadeInUp" style={{ animationDelay: `${0.05 * i}s`, opacity: 0 }}>
            <div className="aspect-square flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)` }}>
              <Tag size={36} style={{ color: item.color }} />
            </div>
            <div className="p-3">
              <p className="text-[11px] font-bold tracking-wider truncate">{item.title}</p>
              <p className="text-sm font-black t-accent mt-0.5">{item.price.toLocaleString("pl-PL")} PLN</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={9} className="t-tertiary" />
                <span className="text-[8px] t-tertiary">{item.location}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[8px] px-2 py-0.5 rounded-full t-tertiary" style={{ background: "var(--app-input-bg)" }}>{item.category}</span>
                <button onClick={() => setLiked(p => { const n = new Set(p); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}>
                  <Heart size={14} className={liked.has(item.id) ? "fill-red-500 text-red-500" : "t-tertiary"} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
