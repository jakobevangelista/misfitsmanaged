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
  isAdmin: boolean("is_admin").default(false).notNull(),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number"),
  isWaiverSigned: boolean("is_waiver_signed").default(false),
  contractStatus: mysqlEnum("contract_status", ["active", "expired", "none"])
    .default("none")
    .notNull(),
  customerId: text("customer_id"),
  waiverSignature: text("waiver_signature"),
  waiverSignDate: text("waiver_date"),
  realScanId: text("real_scan_id").notNull().default("0"),
});

// export const memebersRelations = relations(members, ({ many }) => ({
//   contracts: many(contracts),
//   transactions: many(transactions),
// }));

export const contracts = mysqlTable("contracts", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  length: text("length").notNull(),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("end_date").notNull(),
});

// export const contractsRelations = relations(contracts, ({ one }) => ({
//   ownerId: one(members, {
//     fields: [contracts.ownerId],
//     references: [members.emailAddress],
//   }),
// }));

export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  amount: int("amount").notNull(),
  date: text("date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  type: text("type").notNull(),
  createdAt: datetime("created_at").notNull(),
});

// export const transactionsRelations = relations(transactions, ({ one }) => ({
//   ownerId: one(members, {
//     fields: [transactions.ownerId],
//     references: [members.emailAddress],
//   }),
// }));
