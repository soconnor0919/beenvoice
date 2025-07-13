import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";

async function exportData() {
  console.log("📦 Exporting data from local SQLite database...\n");

  try {
    // Check if local database exists
    if (!existsSync("./db.sqlite")) {
      console.error("❌ Local database db.sqlite not found!");
      process.exit(1);
    }
    console.log("✅ Found local database");

    // Create SQL dump
    console.log("🔄 Creating SQL dump...");
    const dumpPath = "./data_export.sql";

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
    console.log("🔍 Extracting data statements...");
    const dumpContent = readFileSync(dumpPath, "utf8");
    const lines = dumpContent.split("\n");

    // Extract only INSERT statements for beenvoice tables
    const dataStatements = [];

    // Add header comment
    dataStatements.push("-- beenvoice Data Export");
    dataStatements.push("-- Generated: " + new Date().toISOString());
    dataStatements.push(
      "-- Run these INSERT statements in your Turso database",
    );
    dataStatements.push("");

    // Extract table data in proper order (for foreign keys)
    const tableOrder = [
      "beenvoice_user",
      "beenvoice_account",
      "beenvoice_session",
      "beenvoice_client",
      "beenvoice_business",
      "beenvoice_invoice",
      "beenvoice_invoice_item",
    ];

    for (const tableName of tableOrder) {
      const tableStatements = lines.filter(
        (line) =>
          line.startsWith(`INSERT INTO ${tableName}`) ||
          line.startsWith(`INSERT INTO \`${tableName}\``),
      );

      if (tableStatements.length > 0) {
        dataStatements.push(
          `-- Data for ${tableName} (${tableStatements.length} records)`,
        );
        dataStatements.push(...tableStatements);
        dataStatements.push("");
      }
    }

    // Write clean export file
    const exportContent = dataStatements.join("\n");
    writeFileSync("./beenvoice_data_export.sql", exportContent);

    // Count total records
    const totalInserts = dataStatements.filter((line) =>
      line.startsWith("INSERT"),
    ).length;

    console.log(`\n🎉 Data export completed!`);
    console.log(`   📄 File: beenvoice_data_export.sql`);
    console.log(`   📊 Total records: ${totalInserts}`);
    console.log(`\n📋 Manual steps to complete migration:`);
    console.log(`   1. Run: bun run db:push (to create tables in Turso)`);
    console.log(
      `   2. Copy the INSERT statements from beenvoice_data_export.sql`,
    );
    console.log(`   3. Run them in your Turso database`);
    console.log(
      `\n💡 Or use turso db shell beenvoice < beenvoice_data_export.sql`,
    );

    // Clean up temp file
    try {
      execSync(`rm ${dumpPath}`);
    } catch (e) {
      // Cleanup failed, that's okay
    }
  } catch (error) {
    console.error(
      "\n❌ Export failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

exportData().catch(console.error);
