import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type LikeRow = { id: number };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ error: "Nieprawidłowe ID posta." }, { status: 400 });
  }

  const existing = await get<LikeRow>(
    "SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?",
    [currentUser.userId, postId],
  );

  if (existing) {
    await run("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", [
      currentUser.userId,
      postId,
    ]);
    return NextResponse.json({ liked: false });
  }

  await run(
    "INSERT INTO post_likes (user_id, post_id, created_at) VALUES (?, ?, ?)",
    [currentUser.userId, postId, new Date().toISOString()],
  );

  return NextResponse.json({ liked: true });
}
