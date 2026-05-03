"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlaySquare, Wallet, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Czat", icon: MessageSquare },
  { href: "/reels", label: "Rolki", icon: PlaySquare },
  { href: "/feed", label: "Social", icon: Users },
  { href: "/wallet", label: "Portfel", icon: Wallet },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on auth and fullscreen pages
  if (pathname === "/auth") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{
        background: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(24px) saturate(1.3)",
        WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 px-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-2.5 relative active:scale-90 transition-transform"
            >
              {active && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #fca000, #f97316)" }}
                />
              )}
              <Icon
                size={20}
                className={`transition-colors ${active ? "text-[#fca000]" : "text-white/40"}`}
              />
              <span
                className={`text-[9px] font-bold tracking-wider transition-colors ${
                  active ? "text-[#fca000]" : "text-white/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
