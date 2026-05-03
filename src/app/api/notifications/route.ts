import { NextResponse } from "next/server";
import { all, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type NotifRow = { id: number; type: string; title: string; body: string; read: number; created_at: string };

export async function GET() {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const notifications = await all<NotifRow>(
    "SELECT id, type, title, body, read, created_at FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 30",
    [u.userId],
  );

  return NextResponse.json({ notifications });
}

export async function POST(request: Request) {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const body = (await request.json()) as { action?: string; id?: number };

  if (body.action === "markRead" && body.id) {
    await run("UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?", [body.id, u.userId]);
  } else if (body.action === "markAllRead") {
    await run("UPDATE notifications SET read = 1 WHERE user_id = ?", [u.userId]);
  }

  return NextResponse.json({ ok: true });
}
