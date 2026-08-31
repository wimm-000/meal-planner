import { and, eq } from "drizzle-orm";
import { redirect } from "react-router";

import { getAuthUser } from "./auth.server";
import { db } from "./db/client.server";
import { space, spaceMember } from "./db/schema";

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

export async function getActiveSpace(request: Request) {
  const session = await requireUser(request);
  const requestedId = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)active_space_id=([^;]+)/)?.[1];
  const memberships = await db
    .select({ space, role: spaceMember.role })
    .from(spaceMember)
    .innerJoin(space, eq(spaceMember.spaceId, space.id))
    .where(eq(spaceMember.userId, session.user.id));
  const selected = memberships.find(
    (membership) => membership.space.id === requestedId,
  );
  return { ...session, ...(selected || memberships[0]) };
}
