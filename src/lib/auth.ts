import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { get, run } from "@/lib/db";

const TOKEN_NAME = "superapp_token";
const JWT_EXPIRES_IN = "7d";

type UserRow = {
  id: number;
  username: string;
  password_hash: string;
};

export type TokenPayload = {
  userId: number;
  username: string;
};

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

export async function registerUser(username: string, password: string): Promise<void> {
  const normalizedUsername = username.trim();
  const passwordHash = await bcrypt.hash(password, 10);

  await run(
    "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
    [normalizedUsername, passwordHash, new Date().toISOString()],
  );
}

export async function validateUser(username: string, password: string): Promise<TokenPayload | null> {
  const user = await get<UserRow>("SELECT id, username, password_hash FROM users WHERE username = ?", [
    username.trim(),
  ]);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  return { userId: user.id, username: user.username };
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export { TOKEN_NAME };
