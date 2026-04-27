import { NextResponse } from "next/server";
import { all, get, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type FriendRow = {
  id: number;
  username: string;
};

type AddFriendBody = {
  friendUserId?: number;
};

export async function GET() {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const friends = await all<FriendRow>(
    `
      SELECT u.id, u.username
      FROM friends f
      JOIN users u ON u.id = f.friend_user_id
      WHERE f.user_id = ?
      ORDER BY u.username ASC
    `,
    [currentUser.userId],
  );

  return NextResponse.json({ friends });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await request.json()) as AddFriendBody;
  const friendUserId = body.friendUserId;
  if (!friendUserId || friendUserId === currentUser.userId) {
    return NextResponse.json({ error: "Nieprawidłowy znajomy." }, { status: 400 });
  }

  const friendExists = await get<{ id: number }>("SELECT id FROM users WHERE id = ?", [friendUserId]);
  if (!friendExists) {
    return NextResponse.json({ error: "Użytkownik nie istnieje." }, { status: 404 });
  }

  await run(
    "INSERT OR IGNORE INTO friends (user_id, friend_user_id, created_at) VALUES (?, ?, ?)",
    [currentUser.userId, friendUserId, new Date().toISOString()],
  );
  await run(
    "INSERT OR IGNORE INTO friends (user_id, friend_user_id, created_at) VALUES (?, ?, ?)",
    [friendUserId, currentUser.userId, new Date().toISOString()],
  );

  return NextResponse.json({ ok: true });
}
