import { text, mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";

// declaring enum in database
export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name"),
  qrCodeUrl: text("qr_code"),
});
