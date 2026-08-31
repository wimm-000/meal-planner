import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";

import { db } from "./db/client.server";
import { authSession, user } from "./db/schema";
import { provisionPersonalSpace } from "./db/spaces.server";

const scrypt = promisify(nodeScrypt);
const sessionCookie = "meal_planner_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 30;

export type AuthUser = typeof user.$inferSelect;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, saltText, keyText] = stored.split("$");
  if (!saltText || !keyText) return false;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(keyText, "base64url");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  await db.insert(authSession).values({
    id: randomUUID(),
    tokenHash: hashToken(token),
    userId,
    expiresAt: new Date(now.getTime() + sessionDurationMs),
    createdAt: now,
    updatedAt: now,
  });
  return token;
}

export async function getAuthUser(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`(?:^|;\\s*)${sessionCookie}=([^;]+)`))?.[1];
  if (!token) return null;
  const result = await db
    .select({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      session: authSession,
    })
    .from(authSession)
    .innerJoin(user, eq(authSession.userId, user.id))
    .where(eq(authSession.tokenHash, hashToken(token)))
    .limit(1);
  const current = result[0];
  if (!current || current.session.expiresAt <= new Date()) return null;
  return current.user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  if (!name.trim()) throw new Error("Name is required.");
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, normalizedEmail))
    .limit(1);
  if (existing[0])
    throw new Error("An account with that email already exists.");
  const now = new Date();
  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    emailVerified: false,
    passwordHash: await hashPassword(password),
    role: "user" as const,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(user).values(newUser);
  await provisionPersonalSpace(newUser.id, newUser.name);
  return { userId: newUser.id, token: await createSession(newUser.id) };
}

export async function loginUser(email: string, password: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .limit(1);
  const found = result[0];
  if (!found || !(await verifyPassword(password, found.passwordHash)))
    throw new Error("Invalid email or password.");
  return { userId: found.id, token: await createSession(found.id) };
}

export async function destroySession(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`(?:^|;\\s*)${sessionCookie}=([^;]+)`))?.[1];
  if (token)
    await db
      .delete(authSession)
      .where(eq(authSession.tokenHash, hashToken(token)));
}

export function sessionCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${sessionCookie}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDurationMs / 1000}${secure}`;
}

export function clearSessionCookieHeader() {
  return `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}
