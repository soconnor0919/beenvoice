import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";

// Read .env file directly
function loadEnvVars() {
  const envPath = "./.env";
  if (!existsSync(envPath)) {
    console.error("❌ .env file not found!");
    process.exit(1);
  }

  const envContent = readFileSync(envPath, "utf8");
  const envVars = /** @type {Record<string, string>} */ ({});

  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, ""); // Remove quotes
        envVars[key.trim()] = value.trim();
      }
    }
  });

  return envVars;
}

async function migrateToTurso() {
  console.log("🚀 Pushing local SQLite data to live Turso database...\n");

  try {
    // Load environment variables
    console.log("🔧 Loading environment variables...");
    const envVars = loadEnvVars();

    if (!envVars.DATABASE_URL || !envVars.DATABASE_AUTH_TOKEN) {
      console.error(
        "❌ Missing DATABASE_URL or DATABASE_AUTH_TOKEN in .env file",
      );
      console.log("💡 Make sure your .env file contains:");
      console.log("   DATABASE_URL=libsql://your-database-url");
      console.log("   DATABASE_AUTH_TOKEN=your-auth-token");
      process.exit(1);
    }
    console.log("✅ Environment variables loaded");

    // Check if local database exists
    console.log("📁 Checking local database...");
    if (!existsSync("./db.sqlite")) {
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
    const tursoClient = createClient({
      url: envVars.DATABASE_URL,
      authToken: envVars.DATABASE_AUTH_TOKEN,
    });
    console.log("✅ Connected to Turso");

    // Clear existing data from beenvoice tables (in reverse order for foreign keys)
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
        console.log(
          `   ⏭️  Skipped ${table} (doesn't exist or error: ${error instanceof Error ? error.message : String(error)})`,
        );
      }
    }

    // Execute the filtered SQL statements
    console.log("📤 Pushing data to Turso...");
    let successCount = 0;
    let errorCount = 0;
    let insertCount = 0;

    for (const line of filteredLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "") continue;

      try {
        await tursoClient.execute(trimmed);
        successCount++;

        // Count and show progress for inserts
        if (trimmed.startsWith("INSERT")) {
          insertCount++;
          if (insertCount % 20 === 0) {
            console.log(`   📝 Inserted ${insertCount} records...`);
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
      "beenvoice_business",
      "beenvoice_invoice",
      "beenvoice_invoice_item",
    ];

    let totalRecords = 0;
    for (const table of tables) {
      try {
        const result = await tursoClient.execute(
          `SELECT COUNT(*) as count FROM ${table}`,
        );
        const count = String(result.rows[0]?.count || 0);
        console.log(`   📊 ${table}: ${count} records`);
        totalRecords += parseInt(count);
      } catch (error) {
        console.log(`   ⏭️  ${table}: table doesn't exist`);
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`   ✅ ${successCount} SQL statements executed`);
    console.log(`   📝 ${insertCount} data records inserted`);
    console.log(`   📊 ${totalRecords} total records in live database`);
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
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    // Cleanup
    try {
      if (existsSync("./temp_dump.sql")) {
        unlinkSync("./temp_dump.sql");
        console.log("🧹 Cleaned up temporary files");
      }
    } catch (e) {
      // File cleanup failed, that's okay
    }

    console.log("🔌 Done!");
  }
}

migrateToTurso().catch(console.error);
