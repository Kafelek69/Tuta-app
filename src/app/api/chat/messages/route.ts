import { NextResponse } from "next/server";
import { all, get, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type MessageRow = {
  id: number;
  sender: string;
  senderId: number;
  receiverId: number;
  encryptedText: string;
  createdAt: string;
};

type SendMessageBody = {
  receiverId?: number;
  encryptedText?: string;
};

export async function GET(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const url = new URL(request.url);
  const withUserId = Number(url.searchParams.get("withUserId"));

  if (!Number.isFinite(withUserId) || withUserId <= 0) {
    return NextResponse.json({ messages: [] });
  }

  const messages = await all<MessageRow>(
    `
      SELECT
        m.id,
        su.username as sender,
        m.sender_user_id as senderId,
        m.receiver_user_id as receiverId,
        m.encrypted_text as encryptedText,
        m.created_at as createdAt
      FROM messages m
      JOIN users su ON su.id = m.sender_user_id
      WHERE
        (m.sender_user_id = ? AND m.receiver_user_id = ?)
        OR
        (m.sender_user_id = ? AND m.receiver_user_id = ?)
      ORDER BY m.id ASC
    `,
    [currentUser.userId, withUserId, withUserId, currentUser.userId],
  );

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await request.json()) as SendMessageBody;
  const receiverId = body.receiverId;
  const encryptedText = body.encryptedText?.trim();

  if (!receiverId || !encryptedText) {
    return NextResponse.json({ error: "Brak danych wiadomości." }, { status: 400 });
  }

  const receiver = await get<{ id: number }>("SELECT id FROM users WHERE id = ?", [receiverId]);
  if (!receiver) {
    return NextResponse.json({ error: "Odbiorca nie istnieje." }, { status: 404 });
  }

  await run(
    "INSERT INTO messages (sender_user_id, receiver_user_id, encrypted_text, created_at) VALUES (?, ?, ?, ?)",
    [currentUser.userId, receiverId, encryptedText, new Date().toISOString()],
  );

  return NextResponse.json({ ok: true });
}
