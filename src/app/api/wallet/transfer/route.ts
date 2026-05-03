import { NextResponse } from "next/server";
import { run, get, all } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type TxRow = { amount: number };

export async function POST(request: Request) {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const body = (await request.json()) as { amount?: number; to?: string; description?: string };
  const amount = Number(body.amount);
  const to = body.to?.trim() || "";
  const description = body.description?.trim() || `Przelew do ${to}`;

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Nieprawidłowa kwota." }, { status: 400 });
  }

  const rows = await all<TxRow>("SELECT amount FROM wallet_transactions WHERE user_id = ?", [u.userId]);
  const balance = rows.reduce((s, r) => s + r.amount, 0);

  if (balance < amount) {
    return NextResponse.json({ error: "Brak wystarczających środków." }, { status: 400 });
  }

  await run(
    "INSERT INTO wallet_transactions (user_id, amount, type, description, created_at) VALUES (?, ?, 'transfer', ?, ?)",
    [u.userId, -amount, description, new Date().toISOString()],
  );

  return NextResponse.json({ ok: true });
}
