import postgres from "postgres";

declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
}

// postgres.js connects lazily on first query, so this never touches DATABASE_URL at
// module-load time — required so importing this module during Next.js's build-time
// route analysis doesn't need the env var (only set at runtime/deploy).
// Reuse the connection pool across hot reloads in dev instead of opening a new one per request.
// `transform: postgres.camel` maps snake_case columns <-> camelCase JS keys automatically.
export const sql =
  globalThis.__sql ?? postgres(process.env.DATABASE_URL as string, { max: 10, transform: postgres.camel });

if (process.env.NODE_ENV !== "production") {
  globalThis.__sql = sql;
}
