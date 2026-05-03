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
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent hover:bg-white/5 p-2 rounded-full"><ChevronLeft size={28} /></Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Tuta Shop</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-tertiary" size={14} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj produktów..." className="w-full bg-panel-solid  rounded-xl pl-9 pr-3 py-2 text-sm" />
      </div>

      <section className="space-y-2">
        {filtered.map((p) => {
          const inCart = cart.includes(p.id);
          return (
            <article key={p.id} className="cs-card p-4">
              <h2 className="text-sm font-bold">{p.name}</h2>
              <p className="text-xs t-secondary mt-1 flex items-center gap-1"><Star size={12} className="t-accent" /> {p.rating} • Dostawa: {p.delivery}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="t-accent font-bold">{p.price} PLN</p>
                <button
                  onClick={() => setCart((prev) => (inCart ? prev.filter((id) => id !== p.id) : [...prev, p.id]))}
                  className={`px-3 py-2 rounded-xl text-xs font-bold ${inCart ? "bg-green-600/20 border border-green-500 text-green-400" : "cs-btn"}`}
                >
                  {inCart ? "W KOSZYKU" : "DODAJ"}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <button className="cs-btn rounded-2xl mt-auto w-full text-sm py-3">
        <ShoppingBag size={14} className="inline mr-1" /> Zamów ({cart.length}) • {total} PLN
      </button>
    </div>
  );
}
