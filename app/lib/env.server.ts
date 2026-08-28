function requireServerEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export const serverEnv = {
  get tursoDatabaseUrl() {
    return requireServerEnv("TURSO_DATABASE_URL");
  },
  get tursoAuthToken() {
    return requireServerEnv("TURSO_AUTH_TOKEN");
  },
  get betterAuthSecret() {
    return requireServerEnv("BETTER_AUTH_SECRET");
  },
  get betterAuthUrl() {
    return process.env.BETTER_AUTH_URL ?? "http://localhost:5173";
  },
};
