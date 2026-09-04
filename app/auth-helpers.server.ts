import { and, eq } from "drizzle-orm";
import { redirect } from "react-router";

import { getAuthUser } from "./auth.server";
import { db } from "./db/client.server";
import { space, spaceMember } from "./db/schema";

import type { SpaceRole } from "./db/schema";

const activeSpaceCookie = "active_space_id";
const activeSpaceDurationSeconds = 60 * 60 * 24 * 365;

export async function getSession(request: Request) {
  const user = await getAuthUser(request);
  return user ? { user } : null;
}

export async function requireUser(request: Request) {
  const session = await getSession(request);
  // React Router uses the thrown redirect as the loader's control flow.
  if (!session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/login");
  }
  return session;
}

export async function requireSpaceMember(request: Request, spaceId: string) {
  const session = await requireUser(request);
  const membership = await db
    .select({ space, role: spaceMember.role })
    .from(spaceMember)
    .innerJoin(space, eq(spaceMember.spaceId, space.id))
    .where(
      and(
        eq(spaceMember.spaceId, spaceId),
        eq(spaceMember.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!membership[0]) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Space not found", { status: 404 });
  }
  return { ...session, space: membership[0].space, role: membership[0].role };
}

export async function requireSpaceRole(
  request: Request,
  spaceId: string,
  allowedRoles: readonly SpaceRole[],
) {
  const context = await requireSpaceMember(request, spaceId);

  if (!allowedRoles.includes(context.role)) {
    // React Router uses thrown responses as route control flow.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Forbidden", { status: 403 });
  }

  return context;
}

export function requireSpaceOwner(request: Request, spaceId: string) {
  return requireSpaceRole(request, spaceId, ["owner"]);
}

export async function getActiveSpace(request: Request) {
  const session = await requireUser(request);
  const requestedId = readCookie(request, activeSpaceCookie);
  const memberships = await db
    .select({ space, role: spaceMember.role })
    .from(spaceMember)
    .innerJoin(space, eq(spaceMember.spaceId, space.id))
    .where(eq(spaceMember.userId, session.user.id));
  const selected = memberships.find(
    (membership) => membership.space.id === requestedId,
  );
  const active = selected ?? memberships[0];

  if (!active) {
    // A registered user should always have a personal Space.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("No Space available", { status: 500 });
  }

  return { ...session, ...active, spaces: memberships };
}

export function activeSpaceCookieHeader(spaceId: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${activeSpaceCookie}=${encodeURIComponent(spaceId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${activeSpaceDurationSeconds}${secure}`;
}

function readCookie(request: Request, name: string) {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([cookieName]) => cookieName === name)?.[1];

  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}
