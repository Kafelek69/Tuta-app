"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export default function AppEnhancements() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [notificationsState, setNotificationsState] = useState("default");

  useEffect(() => {
    const saved = (localStorage.getItem("tuta_theme") as ThemeMode | null) || "dark";
    setTheme(saved);
    applyTheme(saved);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // no-op
      });
    }

    if ("Notification" in window) {
      setNotificationsState(Notification.permission);
    }
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("tuta_theme", next);
    applyTheme(next);
  };

  const enableNotifications = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    const permission = await Notification.requestPermission();
    setNotificationsState(permission);
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.showNotification("Tuta", {
        body: "Powiadomienia są aktywne.",
        icon: "/vercel.svg",
      });
    } else {
      new Notification("Tuta", { body: "Powiadomienia są aktywne." });
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="bg-[#121212]/90 border border-white/15 rounded-full p-2"
          title="Przełącz motyw"
        >
          {theme === "dark" ? <Sun size={16} className="text-cs-orange" /> : <Moon size={16} className="text-cs-orange" />}
        </button>
        <button
          onClick={enableNotifications}
          className="bg-[#121212]/90 border border-white/15 rounded-full p-2"
          title="Włącz powiadomienia"
        >
          <Bell size={16} className={notificationsState === "granted" ? "text-green-400" : "text-cs-orange"} />
        </button>
      </div>
    </>
  );
}
