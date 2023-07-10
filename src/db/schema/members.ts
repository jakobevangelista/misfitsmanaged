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
  customerId: text("customer_id"),
  waiverSignature: text("waiver_signature"),
  waiverSignDate: text("waiver_date"),
  scanId: text("scan_id").notNull(), // make not null
});

export const memebersRelations = relations(members, ({ many }) => ({
  contracts: many(contracts),
  transactions: many(transactions),
}));

export const contracts = mysqlTable("contracts", {
  id: serial("id").primaryKey(),
  ownerId: int("owner_id").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  length: text("length").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("email_address").notNull(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  ownerId: one(members, {
    fields: [contracts.ownerId],
    references: [members.id],
  }),
}));

export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  ownerId: int("owner_id").notNull(),
  amount: text("amount").notNull(),
  date: text("date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  type: text("type").notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  ownerId: one(members, {
    fields: [transactions.ownerId],
    references: [members.id],
  }),
}));
