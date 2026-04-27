"use client";

import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Nazwa użytkownika musi mieć co najmniej 3 znaki.");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "Wystąpił błąd logowania.");
        return;
      }

      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212]">
      <div className="cs-panel p-8 rounded-md w-full max-w-sm border-t-4 border-t-cs-orange">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest mb-2">
            Tuta<span className="text-cs-orange">.OS</span>
          </h1>
          <p className="text-white/50 text-sm tracking-widest">
            {isRegistering ? "REJESTRACJA W SYSTEMIE" : "LOGOWANIE DO SYSTEMU"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 tracking-widest mb-1">
              NAZWA UŻYTKOWNIKA
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-cs-orange transition-colors"
              placeholder="np. S1mple"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 tracking-widest mb-1">HASŁO</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-cs-orange transition-colors"
              placeholder="minimum 6 znaków"
            />
          </div>

          {error ? <p className="text-red-400 text-xs tracking-wide">{error}</p> : null}

          <button type="submit" disabled={loading} className="cs-btn w-full py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
            <span>{loading ? "PROSZĘ CZEKAĆ..." : isRegistering ? "ZAREJESTRUJ SIĘ" : "ZALOGUJ SIĘ"}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering((prev) => !prev)}
            className="text-xs text-white/50 hover:text-cs-orange transition-colors tracking-widest uppercase"
          >
            {isRegistering ? "Masz już konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
          </button>
        </div>
      </div>
    </div>
  );
}
