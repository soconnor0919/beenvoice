import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
// Load .env.local if it exists
dotenv.config({ path: ".env.local" });
// Load .env if it exists (fallback)
dotenv.config({ path: ".env" });

// Use a relative import; path alias "~" may not resolve in CLI context
// import { env } from "./src/env.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ["beenvoice_*"],
} satisfies Config;
