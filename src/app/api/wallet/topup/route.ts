import { NextResponse } from "next/server";
import { run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

export async function POST(request: Request) {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const body = (await request.json()) as { amount?: number };
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return NextResponse.json({ error: "Nieprawidłowa kwota." }, { status: 400 });
  }

  await run(
    "INSERT INTO wallet_transactions (user_id, amount, type, description, created_at) VALUES (?, ?, 'deposit', ?, ?)",
    [u.userId, amount, `Doładowanie +${amount.toFixed(2)} PLN`, new Date().toISOString()],
  );

  return NextResponse.json({ ok: true });
}
