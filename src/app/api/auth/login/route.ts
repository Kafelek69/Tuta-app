import { NextResponse } from "next/server";
import { signToken, TOKEN_NAME, validateUser } from "@/lib/auth";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const username = body.username?.trim() || "";
  const password = body.password || "";

  if (!username || !password) {
    return NextResponse.json({ error: "Podaj login i hasło." }, { status: 400 });
  }

  const user = await validateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Nieprawidłowy login lub hasło." }, { status: 401 });
  }

  const token = signToken(user);
  const response = NextResponse.json({ username: user.username });
  response.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
