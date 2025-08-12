import type { Config } from "drizzle-kit";
// Use a relative import; path alias "~" may not resolve in CLI context
import { env } from "./src/env.js";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["beenvoice_*"],
} satisfies Config;
