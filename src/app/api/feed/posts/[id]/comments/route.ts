import { NextResponse } from "next/server";
import { all, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type CommentRow = { id: number; author: string; content: string; createdAt: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);

  const comments = await all<CommentRow>(
    `SELECT c.id, u.username as author, c.content, c.created_at as createdAt
     FROM post_comments c JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ? ORDER BY c.id ASC LIMIT 50`,
    [postId],
  );

  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const u = await getCurrentUserFromSession();
  if (!u) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);
  const body = (await request.json()) as { content?: string };
  const content = body.content?.trim() || "";
  if (content.length < 1) return NextResponse.json({ error: "Komentarz pusty." }, { status: 400 });

  await run(
    "INSERT INTO post_comments (user_id, post_id, content, created_at) VALUES (?, ?, ?, ?)",
    [u.userId, postId, content, new Date().toISOString()],
  );

  return NextResponse.json({ ok: true });
}
