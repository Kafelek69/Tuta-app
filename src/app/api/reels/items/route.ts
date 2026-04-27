import { NextResponse } from "next/server";
import { all, run } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type ReelRow = {
  id: number;
  author: string;
  caption: string;
  colorClass: string;
  createdAt: string;
};

type NewReelBody = {
  caption?: string;
};

const colorVariants = [
  "from-orange-500/40 to-yellow-500/10",
  "from-sky-500/40 to-indigo-500/10",
  "from-emerald-500/40 to-cyan-500/10",
  "from-fuchsia-500/40 to-rose-500/10",
];

export async function GET() {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const items = await all<ReelRow>(
    `
      SELECT r.id, u.username as author, r.caption, r.color_class as colorClass, r.created_at as createdAt
      FROM reels r
      JOIN users u ON u.id = r.author_user_id
      ORDER BY r.id DESC
      LIMIT 30
    `,
  );

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await request.json()) as NewReelBody;
  const caption = body.caption?.trim() || "";
  if (caption.length < 3) {
    return NextResponse.json({ error: "Opis rolki jest za krótki." }, { status: 400 });
  }

  const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
  await run("INSERT INTO reels (author_user_id, caption, color_class, created_at) VALUES (?, ?, ?, ?)", [
    currentUser.userId,
    caption,
    colorClass,
    new Date().toISOString(),
  ]);

  return NextResponse.json({ ok: true });
}
