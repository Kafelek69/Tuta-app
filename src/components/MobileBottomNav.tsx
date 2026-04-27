"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlaySquare, ShoppingCart, Wallet } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Czat", icon: MessageSquare },
  { href: "/reels", label: "Rolki", icon: PlaySquare },
  { href: "/wallet", label: "Portfel", icon: Wallet },
  { href: "/shop", label: "Sklep", icon: ShoppingCart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname === "/auth") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#111111]/95 backdrop-blur-md md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-1">
              <Icon size={18} className={active ? "text-cs-orange" : "text-white/60"} />
              <span className={`text-[10px] tracking-widest ${active ? "text-cs-orange" : "text-white/60"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
