import { NextResponse } from "next/server";
import { get, all } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type TxRow = { amount: number };
type TxFull = { id: number; amount: number; type: string; description: string; created_at: string };

export async function GET() {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const rows = await all<TxRow>("SELECT amount FROM wallet_transactions WHERE user_id = ?", [u.userId]);
  const balance = rows.reduce((s, r) => s + r.amount, 0);

  const history = await all<TxFull>(
    "SELECT id, amount, type, description, created_at FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 20",
    [u.userId],
  );

  return NextResponse.json({ balance: Math.round(balance * 100) / 100, history });
}
