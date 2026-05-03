"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LogIn, ShieldCheck, Sparkles, UserPlus, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username.trim().length < 3) {
      setError("Nazwa użytkownika musi mieć co najmniej 3 znaki.");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "Wystąpił błąd. Spróbuj ponownie.");
        return;
      }

      if (mode === "register") {
        setSuccess("Konto utworzone pomyślnie! Przekierowywanie...");
      } else {
        setSuccess("Zalogowano pomyślnie! Przekierowywanie...");
      }

      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Słabe", "Średnie", "Silne"];
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div
          className="absolute top-[-40%] left-[-20%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #fca000 0%, transparent 70%)",
            animation: "float1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-30%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #c77e00 0%, transparent 70%)",
            animation: "float2 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #fca000 0%, transparent 70%)",
            animation: "float3 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Main card */}
      <div
        className={`w-full max-w-[420px] transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fca000 0%, #c77e00 100%)",
                boxShadow: "0 8px 32px rgba(252, 160, 0, 0.3)",
              }}
            >
              <ShieldCheck size={24} className="text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-[0.3em] mb-1">
            TUTA<span style={{ color: "#fca000" }}>.OS</span>
          </h1>
          <p className="text-white/40 text-xs tracking-[0.25em] mt-2">POLSKI EKOSYSTEM SUPER APP</p>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-[1px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(252,160,0,0.4), rgba(255,255,255,0.05), rgba(252,160,0,0.2))",
          }}
        >
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(18, 18, 18, 0.92)",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Mode switcher */}
            <div className="flex gap-1 bg-[#0e0e0e] p-1 rounded-xl mb-6">
              <button
                onClick={() => switchMode("login")}
                className={`flex-1 py-3 rounded-lg text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "login"
                    ? "text-black shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
                style={
                  mode === "login"
                    ? {
                        background: "linear-gradient(135deg, #fca000, #e09000)",
                        boxShadow: "0 4px 15px rgba(252, 160, 0, 0.3)",
                      }
                    : {}
                }
              >
                <LogIn size={14} />
                LOGOWANIE
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`flex-1 py-3 rounded-lg text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "register"
                    ? "text-black shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
                style={
                  mode === "register"
                    ? {
                        background: "linear-gradient(135deg, #fca000, #e09000)",
                        boxShadow: "0 4px 15px rgba(252, 160, 0, 0.3)",
                      }
                    : {}
                }
              >
                <UserPlus size={14} />
                REJESTRACJA
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-[10px] font-bold text-white/40 tracking-[0.2em] mb-2">
                  NAZWA UŻYTKOWNIKA
                </label>
                <div className="relative group">
                  <UserRound
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#fca000] transition-colors"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#fca000]/50 focus:ring-1 focus:ring-[#fca000]/20 transition-all"
                    placeholder="np. S1mple"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-white/40 tracking-[0.2em] mb-2">
                  HASŁO
                </label>
                <div className="relative group">
                  <KeyRound
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#fca000] transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#fca000]/50 focus:ring-1 focus:ring-[#fca000]/20 transition-all"
                    placeholder="minimum 6 znaków"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength indicator - only on register */}
                {mode === "register" && password.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= level ? strengthColors[passwordStrength] : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] tracking-wide text-white/50">
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password - register only */}
              {mode === "register" && (
                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: mode === "register" ? 1 : 0,
                    maxHeight: mode === "register" ? "100px" : "0px",
                    overflow: "hidden",
                  }}
                >
                  <label className="block text-[10px] font-bold text-white/40 tracking-[0.2em] mb-2">
                    POTWIERDŹ HASŁO
                  </label>
                  <div className="relative group">
                    <KeyRound
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#fca000] transition-colors"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#fca000]/50 focus:ring-1 focus:ring-[#fca000]/20 transition-all"
                      placeholder="powtórz hasło"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs tracking-wide flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span className="normal-case">{error}</span>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-xs tracking-wide flex items-start gap-2">
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <span className="normal-case">{success}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-black font-bold text-sm tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #8a6000, #6b4a00)"
                    : "linear-gradient(135deg, #fca000, #e09000)",
                  boxShadow: loading ? "none" : "0 8px 32px rgba(252, 160, 0, 0.25)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    PROSZĘ CZEKAĆ...
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus size={18} />
                    UTWÓRZ KONTO
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    ZALOGUJ SIĘ
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            {mode === "login" && (
              <div className="mt-5 bg-[#0e0e0e] rounded-xl p-3.5 border border-white/5">
                <p className="text-[10px] text-white/30 tracking-[0.15em] mb-1.5">KONTO DEMO</p>
                <p className="text-xs text-white/50 normal-case">
                  Login: <span className="text-[#fca000] font-bold">AniaDemo</span> · Hasło:{" "}
                  <span className="text-[#fca000] font-bold">demodemo</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 tracking-[0.2em] mt-6">
          TUTA SUPER APP v1.0.0 · SZYFROWANE E2E
        </p>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.05); }
          66% { transform: translate(40px, -20px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
