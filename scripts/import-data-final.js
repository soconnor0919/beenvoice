import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";

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
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        envVars[key.trim()] = value.trim();
      }
    }
  });

  return envVars;
}

async function importData() {
  console.log("🚀 Importing data to live Turso database...\n");

  try {
    // Load environment variables
    console.log("🔧 Loading environment variables...");
    const envVars = loadEnvVars();

    if (!envVars.DATABASE_URL || !envVars.DATABASE_AUTH_TOKEN) {
      console.error(
        "❌ Missing DATABASE_URL or DATABASE_AUTH_TOKEN in .env file",
      );
      console.log(
        "💡 Make sure your .env file contains your Turso credentials",
      );
      process.exit(1);
    }
    console.log("✅ Environment variables loaded");

    // Check if export file exists
    const exportFile = "./beenvoice_data_export.sql";
    if (!existsSync(exportFile)) {
      console.error("❌ Export file not found!");
      console.log(
        "💡 Run 'bun run db:export-data' first to create the export file",
      );
      process.exit(1);
    }
    console.log("✅ Found data export file");

    // Connect to Turso
    console.log("🔗 Connecting to live Turso database...");
    const tursoClient = createClient({
      url: envVars.DATABASE_URL,
      authToken: envVars.DATABASE_AUTH_TOKEN,
    });
    console.log("✅ Connected to Turso");

    // Read the export file
    console.log("📖 Reading export file...");
    const sqlContent = readFileSync(exportFile, "utf8");
    const lines = sqlContent.split("\n");

    // Filter for INSERT statements only
    const insertStatements = lines.filter((line) =>
      line.trim().startsWith("INSERT INTO beenvoice_"),
    );

    console.log(`📊 Found ${insertStatements.length} data records to import`);

    if (insertStatements.length === 0) {
      console.log("⚠️  No INSERT statements found in export file");
      process.exit(0);
    }

    // Clear existing data first (in reverse foreign key order)
    console.log("🗑️  Clearing existing data...");
    const tablesToClear = [
      "beenvoice_invoice_item",
      "beenvoice_invoice",
      "beenvoice_business",
      "beenvoice_client",
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
          `   ⏭️  Skipped ${table} (${error instanceof Error ? error.message : String(error)})`,
        );
      }
    }

    // Execute INSERT statements
    console.log("📤 Importing data...");
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < insertStatements.length; i++) {
      const statementLine = insertStatements[i];
      if (!statementLine) continue;

      const statement = statementLine.trim();

      try {
        await tursoClient.execute(statement);
        successCount++;

        // Show progress every 50 records
        if (successCount % 50 === 0) {
          console.log(
            `   📝 Imported ${successCount}/${insertStatements.length} records...`,
          );
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          // Only show first 5 errors
          console.error(
            `   ❌ Error importing record ${i + 1}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    // Verify the import
    console.log("\n🔍 Verifying import...");
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
        const count = parseInt(String(result.rows[0]?.count || 0));
        if (count > 0) {
          console.log(`   📊 ${table}: ${count} records`);
          totalRecords += count;
        }
      } catch (error) {
        console.log(`   ⏭️  ${table}: not accessible`);
      }
    }

    console.log(`\n🎉 Import completed!`);
    console.log(`   ✅ ${successCount} records imported successfully`);
    if (errorCount > 0) {
      console.log(`   ⚠️  ${errorCount} records had errors`);
    }
    console.log(`   📊 ${totalRecords} total records now in live database`);
    console.log(`\n💡 Your local data is now live on Turso!`);
    console.log(`💡 Your Vercel deployment will use this data.`);
  } catch (error) {
    console.error(
      "\n❌ Import failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    console.log("🔌 Done!");
  }
}

importData().catch(console.error);
