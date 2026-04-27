import { NextResponse } from "next/server";
import { registerUser, signToken, TOKEN_NAME, validateUser } from "@/lib/auth";

type RegisterBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBody;
  const username = body.username?.trim() || "";
  const password = body.password || "";

  if (username.length < 3) {
    return NextResponse.json({ error: "Nazwa użytkownika musi mieć min. 3 znaki." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Hasło musi mieć min. 6 znaków." }, { status: 400 });
  }

  try {
    await registerUser(username, password);
    const user = await validateUser(username, password);

    if (!user) {
      return NextResponse.json({ error: "Błąd tworzenia konta." }, { status: 500 });
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
  } catch {
    return NextResponse.json({ error: "Użytkownik o tej nazwie już istnieje." }, { status: 409 });
  }
}
