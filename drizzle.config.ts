import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

const env = process.env["DATABASE_URL"] || "NULL";
if (env == "NULL") {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/db/schema/*",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env,
  },
} satisfies Config;
