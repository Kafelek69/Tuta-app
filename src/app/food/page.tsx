'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, MapPin, Star, Clock, Bike, ShoppingCart, Plus } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Wszystko', icon: '🍽️' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burgery', icon: '🍔' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'kebab', name: 'Kebab', icon: '🥙' },
  { id: 'vege', name: 'Vege', icon: '🥗' },
];

const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Gamer Pizza (Nocna)',
    category: 'pizza',
    rating: 4.8,
    reviews: 245,
    time: '30-45 min',
    deliveryFee: 0,
    tags: ['Pizzeria', 'Amerykańska'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
    menu: [
      { id: 'm1', name: 'Pepperoni CS2', desc: 'Podwójne pepperoni, ser, sos pomidorowy', price: 42 },
      { id: 'm2', name: 'Margherita Drop', desc: 'Klasyczna margherita z mozzarellą', price: 35 },
    ]
  },
  {
    id: 'r2',
    name: 'Kebab u Grubego',
    category: 'kebab',
    rating: 4.5,
    reviews: 890,
    time: '15-25 min',
    deliveryFee: 5.99,
    tags: ['Kebab', 'Turecka'],
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80',
    menu: [
      { id: 'm3', name: 'Rollo Gigant', desc: 'Mieszane mięso, sos ostry', price: 28 },
      { id: 'm4', name: 'KBox', desc: 'Kebab w pudełku z frytkami', price: 32 },
    ]
  },
  {
    id: 'r3',
    name: 'Burger Rush',
    category: 'burger',
    rating: 4.9,
    reviews: 120,
    time: '40-55 min',
    deliveryFee: 8.99,
    tags: ['Burgery', 'Wołowina'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    menu: [
      { id: 'm5', name: 'Double Smash', desc: 'Podwójna wołowina, bekon, cheddar', price: 45 },
      { id: 'm6', name: 'Frytki z serem', desc: 'Grube frytki z sosem serowym', price: 18 },
    ]
  }
];

type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  time: string;
  deliveryFee: number;
  tags: string[];
  image: string;
  menu: MenuItem[];
};

type CartItem = MenuItem & {
  qty: number;
  restaurantName: string;
};

export default function FoodDelivery() {
  const [activeCat, setActiveCat] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [splitPeople, setSplitPeople] = useState(2);
  const [splitTotal, setSplitTotal] = useState<number | null>(null);

  const filteredRestaurants = activeCat === 'all' 
    ? RESTAURANTS 
    : RESTAURANTS.filter(r => r.category === activeCat);

  const addToCart = (item: MenuItem, restaurantName: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1, restaurantName }];
    });
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const calculateSplit = async () => {
    const res = await fetch('/api/food/split', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: totalCart, people: splitPeople, serviceFeePercent: 10 }),
    });
    const payload = (await res.json()) as { split?: { perPerson: number } };
    if (payload.split) {
      setSplitTotal(payload.split.perPerson);
    }
  };

  if (selectedRestaurant) {
    return (
      <div className="min-h-screen p-0 md:p-8 max-w-lg mx-auto md:max-w-4xl flex flex-col bg-[#121212] overflow-hidden relative pb-24">
        <div 
          className="h-56 w-full bg-cover bg-center relative shrink-0" 
          style={{ backgroundImage: `url(${selectedRestaurant.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/60"></div>
          <button 
            onClick={() => setSelectedRestaurant(null)}
            className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white hover:text-cs-orange backdrop-blur-sm transition-colors border border-white/10"
          >
            <ChevronLeft size={28} />
          </button>
        </div>
        
        <div className="p-4 cs-panel -mt-6 rounded-t-3xl relative z-10 mx-2 shadow-2xl">
          <h1 className="text-2xl font-bold uppercase tracking-widest">{selectedRestaurant.name}</h1>
          <div className="flex flex-wrap gap-4 text-[10px] text-white/60 mt-3 font-bold tracking-widest uppercase">
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-cs-orange"><Star size={12} className="fill-cs-orange" /> {selectedRestaurant.rating}</span>
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md"><Clock size={12} /> {selectedRestaurant.time}</span>
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md"><Bike size={12} /> {selectedRestaurant.deliveryFee === 0 ? 'ZAA DARMO' : selectedRestaurant.deliveryFee + ' PLN'}</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto mt-2">
          <h2 className="text-cs-orange font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Menu</h2>
          <div className="flex flex-col gap-4">
            {selectedRestaurant.menu.map((item: MenuItem) => (
              <div key={item.id} className="cs-panel p-4 rounded-xl flex justify-between items-center group border border-white/5 hover:border-cs-orange/50 transition-colors">
                <div>
                  <h3 className="font-bold tracking-widest">{item.name}</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-[200px] leading-relaxed">{item.desc}</p>
                  <p className="text-cs-orange font-extrabold mt-2 text-lg">{item.price} PLN</p>
                </div>
                <button 
                  onClick={() => addToCart(item, selectedRestaurant.name)}
                  className="bg-[#222222] border border-cs-orange text-cs-orange p-3 rounded-xl hover:bg-cs-orange hover:text-black transition-colors shadow-lg"
                >
                  <Plus size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {totalItems > 0 && (
          <div className="fixed bottom-4 left-4 right-4 md:max-w-4xl md:mx-auto z-50 animate-in slide-in-from-bottom">
            <button onClick={calculateSplit} className="w-full cs-btn rounded-xl flex justify-between items-center p-5 shadow-2xl shadow-cs-orange/20 hover:scale-[1.02] active:scale-[0.98]">
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg font-bold">{totalItems}</div>
              <span className="tracking-widest">PODZIEL RACHUNEK</span>
              <div className="font-extrabold text-xl">{totalCart} PLN</div>
            </button>
            {splitTotal !== null && (
              <p className="text-center mt-2 text-xs text-white/80">
                Na osobę (z opłatą 10%): <span className="text-cs-orange font-bold">{splitTotal.toFixed(2)} PLN</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto md:max-w-4xl flex flex-col gap-6 pb-24 relative">
      <header className="flex items-center justify-between cs-panel p-4 rounded-xl shrink-0 border border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full transition-colors">
            <ChevronLeft size={28} />
          </Link>
          <div>
            <p className="text-[9px] text-cs-orange tracking-widest font-bold">DOSTAWA DO OŚRODKA</p>
            <div className="flex items-center gap-1 font-bold text-sm cursor-pointer mt-1 tracking-wider uppercase">
              Baza - Sektor 5 <MapPin size={14} className="text-white/50" />
            </div>
          </div>
        </div>
        <div className="relative p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-cs-orange text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {totalItems}
            </span>
          )}
          <ShoppingCart size={22} className="text-white/80" />
        </div>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cs-orange transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="CZEGO SZUKASZ? (PIZZA, BURGER...)" 
          className="w-full bg-[#222222]/80 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cs-orange transition-colors tracking-widest font-bold placeholder:text-white/20"
        />
      </div>

      {totalCart > 0 && (
        <div className="cs-panel p-4 rounded-xl border border-white/10">
          <p className="text-xs text-white/60 tracking-widest mb-2">Podział rachunku</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={splitPeople}
              onChange={(e) => setSplitPeople(Number(e.target.value) || 1)}
              className="w-24 bg-[#1a1a1a] border border-white/10 rounded-md px-3 py-2 text-sm"
            />
            <button onClick={calculateSplit} className="cs-btn rounded-md py-2 px-4 text-xs">
              Przelicz
            </button>
          </div>
          {splitTotal !== null && (
            <p className="text-sm mt-2">
              Każdy płaci: <span className="text-cs-orange font-bold">{splitTotal.toFixed(2)} PLN</span>
            </p>
          )}
        </div>
      )}

      <div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mask-linear-fade">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={
                'flex flex-col items-center gap-3 min-w-[80px] p-4 rounded-xl transition-all duration-300 border ' +
                (activeCat === cat.id 
                  ? 'bg-cs-orange/10 border-cs-orange text-cs-orange -translate-y-1 shadow-lg' 
                  : 'bg-cs-panel border-white/5 hover:border-white/20 hover:-translate-y-1')
              }
            >
              <span className="text-3xl filter drop-shadow-md">{cat.icon}</span>
              <span className="text-[9px] font-bold tracking-widest uppercase">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-xs text-white/50 tracking-widest font-bold uppercase border-l-2 border-l-cs-orange pl-2">W pobliżu</h2>
        {filteredRestaurants.map(rest => (
          <div 
            key={rest.id} 
            onClick={() => setSelectedRestaurant(rest)}
            className="cs-panel rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-cs-orange/50 transition-all duration-300 group hover:shadow-xl hover:shadow-cs-orange/5"
          >
            <div className="h-40 relative overflow-hidden">
              <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-transparent to-transparent opacity-80"></div>
              
              {rest.deliveryFee === 0 && (
                <div className="absolute top-3 left-3 bg-[#fca000] text-black text-[9px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-md">
                  Darmowa dostawa
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-white/10">
                <Clock size={12} className="text-cs-orange" /> {rest.time}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg uppercase tracking-wide group-hover:text-cs-orange transition-colors">{rest.name}</h3>
                <div className="flex items-center gap-1 bg-white/5 text-cs-orange px-2 py-1 rounded-md text-xs font-bold border border-white/5">
                  <Star size={12} className="fill-cs-orange" /> {rest.rating}
                </div>
              </div>
              <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest flex items-center gap-2 font-bold">
                <span>{rest.tags.join(' • ')}</span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1 text-white/60">
                  <Bike size={12} /> {rest.deliveryFee === 0 ? '0 PLN' : rest.deliveryFee + ' PLN'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:max-w-4xl md:mx-auto z-50 animate-in slide-in-from-bottom">
          <button className="w-full cs-btn rounded-xl flex justify-between items-center p-5 shadow-2xl shadow-cs-orange/20 hover:scale-[1.02] active:scale-[0.98]">
            <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg font-bold">{totalItems}</div>
            <span className="tracking-widest">TWÓJ KOSZYK</span>
            <div className="font-extrabold text-xl">{totalCart} PLN</div>
          </button>
        </div>
      )}
    </div>
  );
}
