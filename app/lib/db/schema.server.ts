import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { user } from "./schema.auth.server";

export * from "./schema.auth.server";

const timestampNow = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

export const space = sqliteTable(
  "space",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type", { enum: ["personal", "family"] }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(timestampNow)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(timestampNow)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check("space_type_check", sql`${table.type} in ('personal', 'family')`),
  ],
);

export const spaceMember = sqliteTable(
  "space_member",
  {
    id: text("id").primaryKey(),
    spaceId: text("space_id")
      .notNull()
      .references(() => space.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "admin", "member"] }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(timestampNow)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(timestampNow)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("space_member_space_id_user_id_unique").on(
      table.spaceId,
      table.userId,
    ),
    index("space_member_user_id_idx").on(table.userId),
    index("space_member_space_id_idx").on(table.spaceId),
    check(
      "space_member_role_check",
      sql`${table.role} in ('owner', 'admin', 'member')`,
    ),
  ],
);

export const spaceRelations = relations(space, ({ many }) => ({
  members: many(spaceMember),
}));

export const spaceMemberRelations = relations(spaceMember, ({ one }) => ({
  space: one(space, {
    fields: [spaceMember.spaceId],
    references: [space.id],
  }),
  user: one(user, {
    fields: [spaceMember.userId],
    references: [user.id],
  }),
}));
