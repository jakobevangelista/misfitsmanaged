import type { Config } from "drizzle-kit";

// import * as dotenv from "dotenv";
// dotenv.config({
//   path: ".env.local",
// });

// const env = process.env["DATABASE_URL"] || "NULL";
// if (env == "NULL") {
//   throw new Error("DATABASE_URL is not set");
// }

import { env } from "@/env.mjs";
console.log(env.DATABASE_URL);

export default {
  schema: "./src/server/db/schema/*",
  driver: "mysql2",
  dbCredentials: {
    // uri: env,
    uri: env.DATABASE_URL,
  },
} satisfies Config;
