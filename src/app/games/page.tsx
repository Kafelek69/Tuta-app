"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Gamepad2, Trophy, RotateCcw } from "lucide-react";

// ===== 2048 GAME =====
type Grid = number[][];
function create2048(): Grid { const g = Array.from({ length: 4 }, () => Array(4).fill(0)); addTile(g); addTile(g); return g; }
function addTile(g: Grid) {
  const empty: [number,number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) empty.push([r,c]);
  if (empty.length === 0) return;
  const [r,c] = empty[Math.floor(Math.random() * empty.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function move2048(g: Grid, dir: string): { grid: Grid; score: number } {
  const n = g.map(r => [...r]); let score = 0;
  const slide = (row: number[]) => {
    const f = row.filter(x => x); const merged: number[] = [];
    for (let i = 0; i < f.length; i++) {
      if (i + 1 < f.length && f[i] === f[i+1]) { merged.push(f[i]*2); score += f[i]*2; i++; }
      else merged.push(f[i]);
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  };
  if (dir === "left") for (let r = 0; r < 4; r++) n[r] = slide(n[r]);
  else if (dir === "right") for (let r = 0; r < 4; r++) n[r] = slide([...n[r]].reverse()).reverse();
  else if (dir === "up") for (let c = 0; c < 4; c++) { const col = slide([n[0][c],n[1][c],n[2][c],n[3][c]]); for (let r = 0; r < 4; r++) n[r][c] = col[r]; }
  else if (dir === "down") for (let c = 0; c < 4; c++) { const col = slide([n[3][c],n[2][c],n[1][c],n[0][c]]).reverse(); for (let r = 0; r < 4; r++) n[r][c] = col[r]; }
  const changed = JSON.stringify(n) !== JSON.stringify(g);
  if (changed) addTile(n);
  return { grid: n, score };
}

const TILE_COLORS: Record<number, string> = {
  0: "var(--app-input-bg)", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563",
  32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#edc850",
  1024: "#edc53f", 2048: "#fca000",
};

function Game2048() {
  const [grid, setGrid] = useState<Grid>(create2048);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [touchStart, setTouchStart] = useState<{x:number;y:number}|null>(null);

  const handleMove = useCallback((dir: string) => {
    setGrid(g => { const r = move2048(g, dir); setScore(s => { const ns = s + r.score; setBest(b => Math.max(b, ns)); return ns; }); return r.grid; });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleMove("left");
      else if (e.key === "ArrowRight") handleMove("right");
      else if (e.key === "ArrowUp") handleMove("up");
      else if (e.key === "ArrowDown") handleMove("down");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3">
          <div className="cs-card !p-2 px-3 text-center"><p className="text-[8px] t-tertiary">WYNIK</p><p className="text-sm font-black t-accent">{score}</p></div>
          <div className="cs-card !p-2 px-3 text-center"><p className="text-[8px] t-tertiary">NAJLEPSZY</p><p className="text-sm font-black">{best}</p></div>
        </div>
        <button onClick={() => { setGrid(create2048()); setScore(0); }} className="cs-card !p-2 px-3 flex items-center gap-1 text-xs active:scale-95"><RotateCcw size={14} /> NOWA</button>
      </div>
      <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl" style={{ background: "var(--app-input-bg)" }}
        onTouchStart={(e) => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!touchStart) return;
          const dx = e.changedTouches[0].clientX - touchStart.x;
          const dy = e.changedTouches[0].clientY - touchStart.y;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) handleMove(dx > 0 ? "right" : "left");
          else if (Math.abs(dy) > 30) handleMove(dy > 0 ? "down" : "up");
          setTouchStart(null);
        }}>
        {grid.flat().map((v, i) => (
          <div key={i} className="aspect-square rounded-lg flex items-center justify-center font-black transition-all"
            style={{ background: TILE_COLORS[v] || "#fca000", color: v > 4 ? "#fff" : "#776e65", fontSize: v >= 1024 ? "12px" : v >= 128 ? "14px" : "18px" }}>
            {v > 0 ? v : ""}
          </div>
        ))}
      </div>
      <p className="text-[9px] t-tertiary text-center mt-2">SWIPE LUB STRZAŁKI</p>
    </div>
  );
}

// ===== QUIZ =====
const QUESTIONS = [
  { q: "Stolica Polski?", options: ["Kraków", "Warszawa", "Gdańsk", "Wrocław"], answer: 1 },
  { q: "Ile województw ma Polska?", options: ["12", "14", "16", "18"], answer: 2 },
  { q: "Najdłuższa rzeka w Polsce?", options: ["Odra", "Bug", "Wisła", "Warta"], answer: 2 },
  { q: "Rok odzyskania niepodległości?", options: ["1918", "1920", "1945", "1989"], answer: 0 },
  { q: "Najwyższy szczyt w Polsce?", options: ["Rysy", "Giewont", "Śnieżka", "Babia Góra"], answer: 0 },
];

function Quiz() {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const q = QUESTIONS[qi];

  const answer = (idx: number) => {
    setSelected(idx);
    if (idx === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (qi + 1 >= QUESTIONS.length) setFinished(true);
      else { setQi(p => p + 1); setSelected(null); }
    }, 800);
  };

  if (finished) return (
    <div className="text-center py-8">
      <Trophy size={48} className="mx-auto t-accent mb-3" />
      <p className="text-lg font-black">{score}/{QUESTIONS.length}</p>
      <p className="text-xs t-secondary mt-1">POPRAWNYCH ODPOWIEDZI</p>
      <button onClick={() => { setQi(0); setScore(0); setSelected(null); setFinished(false); }}
        className="cs-btn rounded-xl mt-4 text-xs">ZAGRAJ PONOWNIE</button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs t-secondary">{qi + 1}/{QUESTIONS.length}</p>
        <p className="text-xs font-bold t-accent">{score} PKT</p>
      </div>
      <p className="text-sm font-bold tracking-wider mb-4 normal-case">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => selected === null && answer(i)}
            className={`cs-card p-3.5 text-left text-xs font-bold tracking-wider active:scale-[0.98] transition-all ${
              selected !== null ? (i === q.answer ? "!border-green-500 !bg-green-500/10" : i === selected ? "!border-red-500 !bg-red-500/10" : "opacity-50") : ""
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

export default function GamesPage() {
  const [game, setGame] = useState<"menu" | "2048" | "quiz">("menu");

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col px-3 pt-3 pb-24 safe-bottom">
      <header className="cs-header animate-fadeInUp">
        <Link href="/" className="t-accent p-2 rounded-full"><ChevronLeft size={24} /></Link>
        <h1 className="flex-1 text-base font-black tracking-[0.2em]">{game === "menu" ? "GRY" : game === "2048" ? "2048" : "QUIZ"}</h1>
        {game !== "menu" && <button onClick={() => setGame("menu")} className="text-xs t-accent font-bold tracking-wider">MENU</button>}
        {game === "menu" && <Gamepad2 size={20} className="t-accent" />}
      </header>

      <div className="mt-4 flex-1">
        {game === "menu" && (
          <div className="grid grid-cols-2 gap-3 animate-fadeInUp stagger-1">
            <button onClick={() => setGame("2048")} className="cs-card p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform">
              <div className="text-3xl font-black t-accent">2048</div>
              <p className="text-[9px] t-tertiary tracking-wider">PUZZLE</p>
            </button>
            <button onClick={() => setGame("quiz")} className="cs-card p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform">
              <Trophy size={36} className="t-accent" />
              <p className="text-[9px] t-tertiary tracking-wider">QUIZ WIEDZY</p>
            </button>
          </div>
        )}
        {game === "2048" && <div className="animate-fadeInUp"><Game2048 /></div>}
        {game === "quiz" && <div className="animate-fadeInUp"><Quiz /></div>}
      </div>
    </div>
  );
}
