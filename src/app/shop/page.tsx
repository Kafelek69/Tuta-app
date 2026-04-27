"use client";

import Link from "next/link";
import { ChevronLeft, Search, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";

const PRODUCTS = [
  { id: "p1", name: "Słuchawki Tuta Pro", price: 219, rating: 4.8, delivery: "Jutro" },
  { id: "p2", name: "Powerbank 20000 mAh", price: 139, rating: 4.6, delivery: "2 dni" },
  { id: "p3", name: "Smartwatch FitX", price: 349, rating: 4.7, delivery: "Jutro" },
];

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = useMemo(
    () => PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const total = filtered
    .filter((p) => cart.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Shop</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj produktów..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm" />
      </div>

      <section className="space-y-2">
        {filtered.map((p) => {
          const inCart = cart.includes(p.id);
          return (
            <article key={p.id} className="cs-panel p-4 rounded-md border border-white/10">
              <h2 className="text-sm font-bold">{p.name}</h2>
              <p className="text-xs text-white/60 mt-1 flex items-center gap-1"><Star size={12} className="text-cs-orange" /> {p.rating} • Dostawa: {p.delivery}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-cs-orange font-bold">{p.price} PLN</p>
                <button
                  onClick={() => setCart((prev) => (inCart ? prev.filter((id) => id !== p.id) : [...prev, p.id]))}
                  className={`px-3 py-2 rounded-md text-xs font-bold ${inCart ? "bg-green-600/20 border border-green-500 text-green-400" : "cs-btn"}`}
                >
                  {inCart ? "W KOSZYKU" : "DODAJ"}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <button className="cs-btn rounded-md mt-auto w-full text-sm py-3">
        <ShoppingBag size={14} className="inline mr-1" /> Zamów ({cart.length}) • {total} PLN
      </button>
    </div>
  );
}
