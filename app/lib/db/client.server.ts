import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { serverEnv } from "~/lib/env.server";

import * as schema from "./schema.server";

const client = createClient({
  url: serverEnv.tursoDatabaseUrl,
  authToken: serverEnv.tursoAuthToken,
});

export const db = drizzle(client, { schema });
