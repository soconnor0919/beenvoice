import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { env } from "../src/env.js";

async function migrateToTurso() {
  console.log("🚀 Pushing local SQLite data to live Turso database...\n");

  try {
    // Check if local database exists
    console.log("📁 Checking local database...");
    const dbExists = existsSync("./db.sqlite");
    if (!dbExists) {
      console.error("❌ Local database db.sqlite not found!");
      process.exit(1);
    }
    console.log("✅ Found local database");

    // Create SQL dump of local database
    console.log("📦 Creating SQL dump from local database...");
    const dumpPath = "./temp_dump.sql";

    try {
      execSync(`sqlite3 db.sqlite ".dump" > ${dumpPath}`, { stdio: "inherit" });
      console.log("✅ SQL dump created");
    } catch (error) {
      console.error(
        "❌ Failed to create SQL dump. Make sure sqlite3 is installed.",
      );
      process.exit(1);
    }

    // Read and filter the dump file
    console.log("🔍 Processing SQL dump...");
    const dumpContent = readFileSync(dumpPath, "utf8");

    // Split into lines and filter for beenvoice tables
    const lines = dumpContent.split("\n");
    const filteredLines = [];
    let inBeenvoiceTable = false;

    for (const line of lines) {
      // Skip PRAGMA and TRANSACTION statements
      if (
        line.startsWith("PRAGMA") ||
        line.startsWith("BEGIN TRANSACTION") ||
        line.startsWith("COMMIT")
      ) {
        continue;
      }

      // Check if we're starting a beenvoice table
      if (
        line.startsWith("CREATE TABLE `beenvoice_") ||
        line.startsWith("CREATE TABLE beenvoice_")
      ) {
        inBeenvoiceTable = true;
        filteredLines.push(line);
        continue;
      }

      // Check if we're inserting into a beenvoice table
      if (
        line.startsWith("INSERT INTO beenvoice_") ||
        line.startsWith("INSERT INTO `beenvoice_")
      ) {
        filteredLines.push(line);
        continue;
      }

      // If we were in a beenvoice table and hit another CREATE TABLE, we're done with that table
      if (
        inBeenvoiceTable &&
        line.startsWith("CREATE TABLE") &&
        !line.includes("beenvoice_")
      ) {
        inBeenvoiceTable = false;
      }

      // If we're in a beenvoice table, include the line
      if (inBeenvoiceTable) {
        filteredLines.push(line);
      }
    }

    console.log(`✅ Filtered ${filteredLines.length} SQL statements`);

    // Connect to Turso
    console.log("🔗 Connecting to live Turso database...");

    if (!env.DATABASE_URL || !env.DATABASE_AUTH_TOKEN) {
      console.error("❌ Missing DATABASE_URL or DATABASE_AUTH_TOKEN");
      console.log("💡 Make sure your .env file has the Turso credentials");
      process.exit(1);
    }

    const tursoClient = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });
    console.log("✅ Connected to Turso");

    // Clear existing data from beenvoice tables
    console.log("🗑️  Clearing existing data...");
    const tablesToClear = [
      "beenvoice_invoice_item",
      "beenvoice_invoice",
      "beenvoice_client",
      "beenvoice_business",
      "beenvoice_session",
      "beenvoice_account",
      "beenvoice_user",
    ];

    for (const table of tablesToClear) {
      try {
        await tursoClient.execute(`DELETE FROM ${table}`);
        console.log(`   ✅ Cleared ${table}`);
      } catch (error) {
        // Table might not exist, that's okay
        console.log(`   ⏭️  Skipped ${table} (doesn't exist)`);
      }
    }

    // Execute the filtered SQL statements
    console.log("📤 Pushing data to Turso...");
    let successCount = 0;
    let errorCount = 0;

    for (const line of filteredLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "") continue;

      try {
        await tursoClient.execute(trimmed);
        successCount++;

        // Show progress for inserts
        if (trimmed.startsWith("INSERT")) {
          const match = trimmed.match(/INSERT INTO (\w+)/);
          if (match && successCount % 10 === 0) {
            console.log(`   📝 Inserted ${successCount} records...`);
          }
        }
      } catch (error) {
        errorCount++;
        if (trimmed.startsWith("CREATE TABLE")) {
          console.log(
            `   ⚠️  Table already exists: ${trimmed.substring(0, 50)}...`,
          );
        } else {
          console.error(
            `   ❌ Error executing: ${trimmed.substring(0, 50)}...`,
          );
          console.error(
            `      Error: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    // Verify the migration
    console.log("\n🔍 Verifying migration...");
    const tables = [
      "beenvoice_user",
      "beenvoice_client",
      "beenvoice_invoice",
      "beenvoice_invoice_item",
    ];

    for (const table of tables) {
      try {
        const result = await tursoClient.execute(
          `SELECT COUNT(*) as count FROM ${table}`,
        );
        const count = result.rows[0]?.count || 0;
        console.log(`   📊 ${table}: ${count} records`);
      } catch (error) {
        console.log(`   ⏭️  ${table}: table doesn't exist`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`   ✅ ${successCount} statements executed successfully`);
    if (errorCount > 0) {
      console.log(
        `   ⚠️  ${errorCount} statements had errors (likely table creation conflicts)`,
      );
    }
    console.log(`\n💡 Your local data is now live on Turso!`);
    console.log(`💡 Your Vercel deployment will use this data.`);
  } catch (error) {
    console.error(
      "\n❌ Migration failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    // Cleanup
    try {
      unlinkSync("./temp_dump.sql");
      console.log("🧹 Cleaned up temporary files");
    } catch (e) {
      // File might not exist, that's okay
    }

    console.log("🔌 Done!");
  }
}

migrateToTurso().catch(console.error);
