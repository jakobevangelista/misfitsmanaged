import type { Config } from "drizzle-kit";

import { env } from "@/env.mjs";
// console.log(env.DATABASE_URL);

export default {
  schema: "./src/server/db/schema/*",
  driver: "mysql2",
  dbCredentials: {
    // uri: `mysql://2d3igfqkkp19btvvweup:pscale_pw_qPmH57PwzA0yuKwHg4VYR8A99Iym1HdQsLTbEXWA6Pw@aws.connect.psdb.cloud/misfitsmanaged?ssl={"rejectUnauthorized":true}`,
    uri: `mysql://dmgdowte0uy4mkxeprpe:pscale_pw_bMvfqkrwdKG0DPKCnqVZG5H6Jk8oejfkn10tmBB1Mk4@aws.connect.psdb.cloud/misfitsmanaged?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config;
