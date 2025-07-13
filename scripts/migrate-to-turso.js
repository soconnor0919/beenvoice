import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import { env } from "../src/env.js";

async function migrateToTurso() {
  console.log("🚀 Pushing local data to live Turso database...\n");

  // Connect to local SQLite database
  const localDb = new Database("./db.sqlite");
  console.log("✅ Connected to local database");

  // Connect to live Turso database using existing env vars
  const tursoClient = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  console.log("✅ Connected to live Turso database");

  try {
    // Get all tables with data
    const tables = localDb
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'beenvoice_%'",
      )
      .all();

    console.log(`\n📋 Found ${tables.length} tables to migrate:`);
    tables.forEach((table) => console.log(`   - ${table.name}`));

    // Migration order to handle foreign key constraints
    const migrationOrder = [
      "beenvoice_user",
      "beenvoice_account",
      "beenvoice_session",
      "beenvoice_client",
      "beenvoice_business",
      "beenvoice_invoice",
      "beenvoice_invoice_item",
    ];

    for (const tableName of migrationOrder) {
      if (!tables.find((t) => t.name === tableName)) {
        console.log(`⏭️  Skipping ${tableName} (not found locally)`);
        continue;
      }

      console.log(`\n📦 Processing ${tableName}...`);

      // Get local data
      const localData = localDb.prepare(`SELECT * FROM ${tableName}`).all();
      console.log(`   Found ${localData.length} local records`);

      if (localData.length === 0) {
        console.log(`   ✅ No data to migrate`);
        continue;
      }

      // Clear remote table first
      await tursoClient.execute(`DELETE FROM ${tableName}`);
      console.log(`   🗑️  Cleared remote table`);

      // Insert all local data
      for (const row of localData) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = columns.map(() => "?").join(", ");

        const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

        await tursoClient.execute({
          sql,
          args: values,
        });
      }

      console.log(`   ✅ Pushed ${localData.length} records to live database`);
    }

    console.log("\n🎉 Migration completed!");
    console.log("💡 Local data is now live on Turso");
    console.log("💡 Your Vercel deployment will use this data");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    localDb.close();
    tursoClient.close();
    console.log("\n🔌 Connections closed");
  }
}

migrateToTurso().catch(console.error);
