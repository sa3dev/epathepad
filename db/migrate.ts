import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        name       TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    const applied = new Set(
      (await sql<{ name: string }[]>`SELECT name FROM migrations`).map((row) => row.name),
    );

    const files = readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (applied.has(file)) continue;

      const contents = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Applying migration: ${file}`);

      await sql.begin(async (tx) => {
        await tx.unsafe(contents);
        await tx`INSERT INTO migrations (name) VALUES (${file})`;
      });
    }

    console.log("Migrations up to date.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
