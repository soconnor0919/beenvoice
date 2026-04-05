/**
 * Programmatic migration runner for production deployments.
 *
 * Run with: bun src/server/db/migrate.ts
 *
 * This applies any pending migrations from the drizzle/ directory to the
 * database specified by DATABASE_URL. It is safe to run multiple times —
 * Drizzle tracks applied migrations in the __drizzle_migrations table.
 */
import * as dotenv from "dotenv";

// Load env files before importing anything that reads process.env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
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

console.log("[migrate] Running migrations from", migrationsFolder);

try {
  await migrate(db, { migrationsFolder });
  console.log("[migrate] All migrations applied successfully");
} catch (err) {
  console.error("[migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
