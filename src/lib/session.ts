import { cookies } from "next/headers";
import { TOKEN_NAME, TokenPayload, verifyToken } from "@/lib/auth";

export async function getCurrentUserFromSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
