import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema/*",
  connectionString: process.env.DATABASE_URL,
  out: "./drizzle",
} satisfies Config;
