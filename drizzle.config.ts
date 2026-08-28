import { defineConfig } from "drizzle-kit";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export default defineConfig({
  dialect: "turso",
  schema: "./app/lib/db/schema.server.ts",
  out: "./drizzle",
  dbCredentials: {
    url: requireEnv("TURSO_DATABASE_URL"),
    authToken: requireEnv("TURSO_AUTH_TOKEN"),
  },
});
