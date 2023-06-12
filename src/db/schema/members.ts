import { relations } from "drizzle-orm";
import {
  text,
  mysqlTable,
  serial,
  boolean,
  int,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  qrCodeUrl: text("qr_code").notNull(),
  isAdmin: boolean("is_admin").default(false),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number"),
  isWaiverSigned: boolean("is_waiver_signed").default(false),
  contractStatus: mysqlEnum("contract_status", ["active", "expired", "none"])
    .default("none")
    .notNull(),
});

export const memebersRelations = relations(members, ({ many }) => ({
  contracts: many(contracts),
}));

export const contracts = mysqlTable("contracts", {
  id: serial("id").primaryKey(),
  ownerId: int("owner_id").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  length: datetime("length").notNull(),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("email_address").notNull(),
  paid: boolean("paid").default(false),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  ownerId: one(members, {
    fields: [contracts.ownerId],
    references: [members.id],
  }),
}));
