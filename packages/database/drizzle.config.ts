import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
  console.warn("⚠️  POSTGRES_URL or DATABASE_URL is not defined in the environment variables.");
}

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
  },
} satisfies Config;
