import { text, mysqlTable, serial, boolean } from "drizzle-orm/mysql-core";

export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  qrCodeUrl: text("qr_code").notNull(),
  isAdmin: boolean("is_admin").default(false),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number"),
  isWaiverSigned: boolean("is_waiver_signed").default(false),
});
