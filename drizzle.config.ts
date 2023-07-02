import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const env = process.env.DATABASE_URL || "NULL";
if (env == "NULL") {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env,
  },
} satisfies Config;
