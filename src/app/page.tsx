'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, Wallet, Landmark, Menu, ShieldBan,
  Utensils, Users, Camera, PlaySquare, BriefcaseBusiness, TramFront, Plane, MapPinned, Tv,
  Mail, FileText, CalendarDays, ShoppingCart, GraduationCap
} from 'lucide-react';

// Simple component inline for LogOutIcon
function LogOutIcon({ size, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.replace('/auth');
        return;
      }

      const payload = (await response.json()) as { user?: { username: string } };
      if (!payload.user) {
        router.replace('/auth');
        return;
      }

      setCurrentUser(payload.user.username);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/auth');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212]">
        <div className="text-white/60 tracking-widest">ŁADOWANIE DANYCH UŻYTKOWNIKA...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto md:max-w-4xl flex flex-col gap-6 pb-24">
      <header className="flex justify-between items-center cs-panel p-4 rounded-md">
        <div className="flex items-center gap-3">
          <Menu className="text-cs-orange cursor-pointer" size={28} />
          <h1 className="text-2xl font-bold tracking-widest">Tuta<span className="text-cs-orange">.OS</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold tracking-widest text-cs-orange">{currentUser}</span>
          <button onClick={handleLogout} className="text-white/50 hover:text-white transition-colors" title="Wyloguj">
            <LogOutIcon size={24} />
          </button>
        </div>
      </header>

      <div className="cs-panel p-6 rounded-md border-l-4 border-l-cs-orange">
        <h2 className="text-xl text-white/50 mb-2">Twój Portfel</h2>
        <div className="text-4xl font-extrabold text-white">14,250 <span className="text-cs-orange">PLN</span></div>
        <div className="mt-4 flex gap-4">
          <button className="cs-btn flex-1 rounded-sm">Doładuj</button>
          <button className="cs-btn flex-1 bg-transparent border-cs-orange text-cs-orange hover:bg-white/5 rounded-sm">Wyślij</button>
        </div>
      </div>

      <div className="cs-panel p-5 rounded-md">
        <h3 className="text-sm text-white/50 mb-4 tracking-widest border-b border-white/10 pb-2">Komunikacja & Social</h3>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/chat" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <MessageSquare size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Czat</span>
          </Link>
          <Link href="/feed" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Users size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Tablica (FB)</span>
          </Link>
          <Link href="/stories" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Camera size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Relacje (IG)</span>
          </Link>
          <Link href="/reels" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <PlaySquare size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Rolki (TT)</span>
          </Link>
        </div>
      </div>

      <div className="cs-panel p-5 rounded-md">
        <h3 className="text-sm text-white/50 mb-4 tracking-widest border-b border-white/10 pb-2">Usługi & Życie</h3>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/food" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Utensils size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Jedzenie</span>
          </Link>
          <Link href="/wallet" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Wallet size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Płatności</span>
          </Link>
          <Link href="/gov" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Landmark size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">mObywatel</span>
          </Link>
          <Link href="/health" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <ShieldBan size={26} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Zdrowie/ID</span>
          </Link>
        </div>
      </div>

      <div className="cs-panel p-5 rounded-md">
        <h3 className="text-sm text-white/50 mb-4 tracking-widest border-b border-white/10 pb-2">Praca, Transport, Travel & Media</h3>
        <div className="grid grid-cols-5 gap-2">
          <Link href="/jobs" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <BriefcaseBusiness size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Praca</span>
          </Link>
          <Link href="/transport" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <TramFront size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Transport</span>
          </Link>
          <Link href="/travel" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Plane size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Travel</span>
          </Link>
          <Link href="/maps" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <MapPinned size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Mapy</span>
          </Link>
          <Link href="/media" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Tv size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Media</span>
          </Link>
        </div>
      </div>

      <div className="cs-panel p-5 rounded-md">
        <h3 className="text-sm text-white/50 mb-4 tracking-widest border-b border-white/10 pb-2">Produktywność, Nauka & Zakupy</h3>
        <div className="grid grid-cols-5 gap-2">
          <Link href="/workspace" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <GraduationCap size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Teams/Cls</span>
          </Link>
          <Link href="/mail" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <Mail size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Mail</span>
          </Link>
          <Link href="/office" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <FileText size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Office</span>
          </Link>
          <Link href="/calendar" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <CalendarDays size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Kalendarz</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center gap-2 cursor-pointer hover:text-cs-orange transition-colors group">
            <div className="bg-[#121212] p-3 rounded-2xl border border-white/5 group-hover:border-cs-orange/50 transition-colors shadow-md">
              <ShoppingCart size={22} className="text-cs-orange" />
            </div>
            <span className="font-bold tracking-widest text-[9px] text-center">Sklep</span>
          </Link>
        </div>
      </div>

      <div className="flex-1"></div>

      <footer className="text-center text-xs text-white/30 tracking-widest mt-8">
        SYSTEM TUTA SUPER APP WERSJA 1.0.0
      </footer>
    </div>
  );
}