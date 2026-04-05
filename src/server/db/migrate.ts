/**
 * Programmatic migration runner for production deployments.
 *
 * Run with: bun src/server/db/migrate.ts
 *
 * This applies any pending migrations from the drizzle/ directory to the
 * database specified by DATABASE_URL. It is safe to run multiple times —
 * Drizzle tracks applied migrations in the __drizzle_migrations table.
 *
 * If the database was previously set up via `db:push` (no migration history),
 * this script will baseline it: seed the migration history without re-running
 * the SQL, so only future migrations are applied.
 */
import * as dotenv from "dotenv";

// Load env files before importing anything that reads process.env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[migrate] ERROR: DATABASE_URL is not set");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(__dirname, "../../../drizzle");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DB_DISABLE_SSL === "true" ? false : { rejectUnauthorized: false },
  max: 1,
});

const db = drizzle(pool);

/**
 * Baseline: if the DB has existing tables but no migration history, seed the
 * __drizzle_migrations table for only the migrations already reflected in the
 * schema. Any migrations whose schema changes are NOT yet present will be left
 * out so Drizzle runs them normally.
 */
async function baselineIfNeeded(client: Pool) {
  // Check if migration tracking table exists and has entries
  const { rows: migRows } = await client.query<{ count: string }>(`
    SELECT COUNT(*)::text AS count
    FROM information_schema.tables
    WHERE table_schema = 'drizzle'
      AND table_name = '__drizzle_migrations'
  `);
  const hasMigrationsTable = parseInt(migRows[0]?.count ?? "0") > 0;

  if (hasMigrationsTable) {
    const { rows: entryRows } = await client.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM drizzle.__drizzle_migrations`
    );
    if (parseInt(entryRows[0]?.count ?? "0") > 0) {
      // Migration history exists — normal flow
      return;
    }
  }

  // No migration history. Check if the DB already has our core tables (was db:push'd).
  const { rows: tableRows } = await client.query<{ count: string }>(`
    SELECT COUNT(*)::text AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'beenvoice_account'
  `);
  const dbAlreadyExists = parseInt(tableRows[0]?.count ?? "0") > 0;

  if (!dbAlreadyExists) {
    // Fresh database — let migrate() run all SQL normally
    return;
  }

  console.log("[migrate] Existing database detected without migration history — baselining...");

  // Create the drizzle schema + migrations table if needed
  await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  // For each migration, check whether its schema changes already exist in the DB.
  // Only seed a record for migrations that are fully applied; leave the rest for
  // migrate() to run.
  const journal = JSON.parse(
    fs.readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8")
  ) as { entries: { idx: number; tag: string; when: number }[] };

  for (const entry of journal.entries) {
    const alreadyApplied = await isMigrationApplied(client, entry.tag);
    if (!alreadyApplied) {
      console.log(`[migrate] Not yet applied, will run: ${entry.tag}`);
      continue;
    }

    const sqlPath = path.join(migrationsFolder, `${entry.tag}.sql`);
    const sql = fs.readFileSync(sqlPath, "utf8");
    const hash = crypto.createHash("sha256").update(sql).digest("hex");

    await client.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
      [hash, entry.when]
    );
    console.log(`[migrate] Baselined: ${entry.tag}`);
  }

  console.log("[migrate] Baseline complete");
}

/**
 * Check whether a specific migration's schema changes already exist in the DB.
 * Each migration tag maps to a sentinel check that uniquely identifies it.
 */
async function isMigrationApplied(client: Pool, tag: string): Promise<boolean> {
  if (tag === "0000_glossy_magneto") {
    // 0000 creates beenvoice_account — check it exists
    const { rows } = await client.query<{ count: string }>(`
      SELECT COUNT(*)::text AS count FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'beenvoice_account'
    `);
    return parseInt(rows[0]?.count ?? "0") > 0;
  }

  if (tag === "0001_supreme_the_enforcers") {
    // 0001 adds currency column to beenvoice_client — check it exists
    const { rows } = await client.query<{ count: string }>(`
      SELECT COUNT(*)::text AS count FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'beenvoice_client'
        AND column_name = 'currency'
    `);
    return parseInt(rows[0]?.count ?? "0") > 0;
  }

  // Unknown migration — assume not applied so it runs
  return false;
}

console.log("[migrate] Running migrations from", migrationsFolder);

try {
  await baselineIfNeeded(pool);
  await migrate(db, { migrationsFolder });
  console.log("[migrate] All migrations applied successfully");
} catch (err) {
  console.error("[migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
