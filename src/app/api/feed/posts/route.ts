import { NextResponse } from "next/server";
import { all, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type PostRow = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

type NewPostBody = {
  content?: string;
};

export async function GET(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const url = new URL(request.url);
  const cursorParam = url.searchParams.get("cursor");
  const limitParam = Number(url.searchParams.get("limit") || 10);
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 30)) : 10;

  const cursor = cursorParam ? Number(cursorParam) : null;

  const posts = cursor
    ? await all<PostRow>(
        `
          SELECT p.id, u.username as author, p.content, p.created_at as createdAt
          FROM feed_posts p
          JOIN users u ON u.id = p.author_user_id
          WHERE p.id < ?
          ORDER BY p.id DESC
          LIMIT ?
        `,
        [cursor, limit],
      )
    : await all<PostRow>(
        `
          SELECT p.id, u.username as author, p.content, p.created_at as createdAt
          FROM feed_posts p
          JOIN users u ON u.id = p.author_user_id
          ORDER BY p.id DESC
          LIMIT ?
        `,
        [limit],
      );

  const nextCursor = posts.length > 0 ? posts[posts.length - 1]?.id ?? null : null;
  return NextResponse.json({ posts, nextCursor, hasMore: posts.length === limit });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await request.json()) as NewPostBody;
  const content = body.content?.trim() || "";
  if (content.length < 3) {
    return NextResponse.json({ error: "Post jest za krótki." }, { status: 400 });
  }

  await run("INSERT INTO feed_posts (author_user_id, content, created_at) VALUES (?, ?, ?)", [
    currentUser.userId,
    content,
    new Date().toISOString(),
  ]);

  return NextResponse.json({ ok: true });
}
