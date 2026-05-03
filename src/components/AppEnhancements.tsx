"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

type ThemeContextType = { theme: ThemeMode; toggle: () => void };
export const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#f2f4f8");
}

export default function AppEnhancements({ children }: { children?: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [notificationsState, setNotificationsState] = useState("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("tuta_theme") as ThemeMode | null) || "dark";
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);

    if ("Notification" in window) {
      setNotificationsState(Notification.permission);
    }
  }, []);

  const toggle = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("tuta_theme", next);
    applyTheme(next);
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationsState(permission);
    if (permission === "granted") {
      new Notification("Tuta.OS", { body: "Powiadomienia są aktywne! 🔔" });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {/* Floating controls */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5" style={{ opacity: mounted ? 1 : 0 }}>
        <button
          onClick={toggle}
          className="rounded-full p-2.5 transition-all active:scale-90"
          style={{
            background: theme === "dark" ? "rgba(10,10,10,0.8)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          }}
          title="Przełącz motyw"
        >
          {theme === "dark" ? <Sun size={16} className="text-[#fca000]" /> : <Moon size={16} className="text-[#fca000]" />}
        </button>
        <button
          onClick={enableNotifications}
          className="rounded-full p-2.5 transition-all active:scale-90"
          style={{
            background: theme === "dark" ? "rgba(10,10,10,0.8)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          }}
          title="Powiadomienia"
        >
          <Bell size={16} className={notificationsState === "granted" ? "text-green-400" : "text-[#fca000]"} />
        </button>
      </div>
      {children}
    </ThemeContext.Provider>
  );
}
