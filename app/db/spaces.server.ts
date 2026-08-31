import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "./client.server";
import { space, spaceMember } from "./schema";

export async function provisionPersonalSpace(userId: string, userName: string) {
  const existing = await db
    .select({ id: space.id })
    .from(spaceMember)
    .innerJoin(space, eq(spaceMember.spaceId, space.id))
    .where(and(eq(spaceMember.userId, userId), eq(space.type, "personal")))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const now = new Date();
  const spaceId = randomUUID();
  await db.batch([
    db.insert(space).values({
      id: spaceId,
      name: `${userName}'s Space`,
      type: "personal",
      createdAt: now,
      updatedAt: now,
    }),
    db.insert(spaceMember).values({
      id: randomUUID(),
      spaceId,
      userId,
      role: "owner",
      createdAt: now,
      updatedAt: now,
    }),
  ]);

  return spaceId;
}
