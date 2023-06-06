import { text, mysqlTable, serial, boolean } from "drizzle-orm/mysql-core";

export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name"),
  qrCodeUrl: text("qr_code").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});
