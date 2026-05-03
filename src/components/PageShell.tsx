import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageShell({
  title,
  subtitle,
  icon,
  backHref = "/",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href={backHref} className="t-accent p-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">{title}</h1>
          {subtitle && <p className="text-[10px] t-tertiary tracking-wider mt-0.5">{subtitle}</p>}
        </div>
        {icon && <div className="t-accent">{icon}</div>}
      </header>
      {children}
    </div>
  );
}
