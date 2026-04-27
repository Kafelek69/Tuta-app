import { NextRequest, NextResponse } from "next/server";
const TOKEN_NAME = "superapp_token";

const publicPaths = ["/auth", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/auth/me"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_NAME)?.value;
  const isPublic = publicPaths.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
