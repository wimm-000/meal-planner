import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "~/lib/db/client.server";
import * as schema from "~/lib/db/schema.server";
import { serverEnv } from "~/lib/env.server";

export const auth = betterAuth({
  appName: "Weekly Meal Planner",
  baseURL: serverEnv.betterAuthUrl,
  secret: serverEnv.betterAuthSecret,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
