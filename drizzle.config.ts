import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:./data/local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
