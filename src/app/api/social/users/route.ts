import { NextResponse } from "next/server";
import { all } from "@/lib/db";
import { getCurrentUserFromSession } from "@/lib/session";

type UserItem = {
  id: number;
  username: string;
};

export async function GET() {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const users = await all<UserItem>(
    "SELECT id, username FROM users WHERE id != ? ORDER BY username ASC",
    [currentUser.userId],
  );
  return NextResponse.json({ users });
}
