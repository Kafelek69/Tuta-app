"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, CreditCard, Plus, Send, Wallet, X } from "lucide-react";

type Transaction = { id: number; amount: number; type: string; description: string; created_at: string };

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [showTopup, setShowTopup] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/wallet/balance");
    const data = (await res.json()) as { balance: number; history: Transaction[] };
    setBalance(data.balance || 0);
    setHistory(data.history || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const doTopup = async () => {
    setError("");
    const res = await fetch("/api/wallet/topup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    if (!res.ok) { const d = await res.json(); setError(d.error || "Błąd"); return; }
    setAmount(""); setShowTopup(false); await load();
  };

  const doTransfer = async () => {
    setError("");
    const res = await fetch("/api/wallet/transfer", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), to, description: desc || `Przelew do ${to}` }),
    });
    if (!res.ok) { const d = await res.json(); setError(d.error || "Błąd"); return; }
    setAmount(""); setTo(""); setDesc(""); setShowTransfer(false); await load();
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">PORTFEL</h1>
          <p className="text-[10px] t-tertiary tracking-wider mt-0.5">TWOJE FINANSE</p>
        </div>
        <Wallet size={20} className="t-accent" />
      </header>

      {/* Balance card */}
      <div className="mt-4 rounded-2xl p-6 animate-fadeInUp stagger-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(252,160,0,0.2), var(--app-panel))", border: "1px solid rgba(252,160,0,0.2)" }}>
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold">SALDO</p>
        <div className="text-4xl font-black mt-1">
          {loading ? "..." : balance.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} <span className="t-accent text-2xl">PLN</span>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={() => { setShowTopup(true); setError(""); }} className="flex-1 cs-btn rounded-xl !py-2.5 text-xs flex items-center justify-center gap-2">
            <Plus size={14} /> DOŁADUJ
          </button>
          <button onClick={() => { setShowTransfer(true); setError(""); }} className="flex-1 cs-btn-outline rounded-xl !py-2.5 text-xs flex items-center justify-center gap-2">
            <Send size={14} /> WYŚLIJ
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-3 gap-3 animate-fadeInUp stagger-2">
        {[
          { icon: <CreditCard size={20} />, label: "Karta" },
          { icon: <ArrowDownLeft size={20} />, label: "Przyjmij" },
          { icon: <ArrowUpRight size={20} />, label: "Inwestuj" },
        ].map((a) => (
          <div key={a.label} className="cs-card p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            <div className="t-accent">{a.icon}</div>
            <span className="text-[9px] font-bold tracking-wider t-secondary">{a.label}</span>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="mt-4 animate-fadeInUp stagger-3">
        <p className="text-[10px] t-tertiary tracking-[0.2em] font-bold mb-3">HISTORIA TRANSAKCJI</p>
        {history.length === 0 && !loading && (
          <p className="text-xs t-tertiary text-center py-8">Brak transakcji</p>
        )}
        <div className="flex flex-col gap-2">
          {history.map((tx) => (
            <div key={tx.id} className="cs-card p-3.5 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.amount >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {tx.amount >= 0 ? <ArrowDownLeft size={16} className="text-green-500" /> : <ArrowUpRight size={16} className="text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-wider truncate">{tx.description}</p>
                <p className="text-[9px] t-tertiary mt-0.5">{new Date(tx.created_at).toLocaleDateString("pl-PL")}</p>
              </div>
              <span className={`text-sm font-bold ${tx.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.amount >= 0 ? "+" : ""}{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Topup modal */}
      {showTopup && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end safe-bottom">
          <div className="w-full max-w-md mx-auto rounded-t-3xl p-6 animate-slideUp" style={{ background: "var(--app-panel-solid)", borderTop: "1px solid rgba(252,160,0,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-[0.2em]">DOŁADOWANIE</h2>
              <button onClick={() => setShowTopup(false)} className="p-2 rounded-full hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="flex gap-2 mb-3">{quickAmounts.map((q) => (
              <button key={q} onClick={() => setAmount(String(q))} className="flex-1 cs-card py-2 text-center text-xs font-bold tracking-wider active:scale-95">{q} PLN</button>
            ))}</div>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Kwota PLN" type="number" className="cs-input mb-3" />
            {error && <p className="text-red-400 text-xs mb-2 normal-case">{error}</p>}
            <button onClick={doTopup} disabled={!Number(amount)} className="cs-btn w-full rounded-xl text-xs">DOŁADUJ</button>
          </div>
        </div>
      )}

      {/* Transfer modal */}
      {showTransfer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end safe-bottom">
          <div className="w-full max-w-md mx-auto rounded-t-3xl p-6 animate-slideUp" style={{ background: "var(--app-panel-solid)", borderTop: "1px solid rgba(252,160,0,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-[0.2em]">PRZELEW</h2>
              <button onClick={() => setShowTransfer(false)} className="p-2 rounded-full hover:bg-white/10"><X size={18} /></button>
            </div>
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Odbiorca" className="cs-input mb-3" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Kwota PLN" type="number" className="cs-input mb-3" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Tytuł przelewu (opcjonalnie)" className="cs-input mb-3" />
            {error && <p className="text-red-400 text-xs mb-2 normal-case">{error}</p>}
            <button onClick={doTransfer} disabled={!Number(amount) || !to.trim()} className="cs-btn w-full rounded-xl text-xs">WYŚLIJ</button>
          </div>
        </div>
      )}
    </div>
  );
}
