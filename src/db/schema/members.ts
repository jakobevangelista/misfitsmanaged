import { relations } from "drizzle-orm";
import {
  text,
  mysqlTable,
  serial,
  boolean,
  int,
  datetime,
  mysqlEnum,
  varchar,
  date,
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
  customerId: text("customer_id"),
  waiverSignature: text("waiver_signature"),
  waiverSignDate: text("waiver_date"),
  realScanId: text("real_scan_id").notNull().default("0"),
  parentName: text("parent_name"),
  parentSignature: text("parent_signature"),
  minorDOB: text("minor_dob"),
  DOB: date("DOB"),
  contractStatus: text("contract_status").default("none").notNull(), //"active","incomplete","incomplete_expired","past_due","canceled","unpaid","none",
  profilePicture: text("profile_picture"),
});

export const contracts = mysqlTable("contracts", {
  stripeId: varchar("stripe_id", { length: 60 }).primaryKey(),
  ownerId: text("owner_id").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("end_date").notNull(),
  remainingDays: int("remaining_days"),
});

export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  amount: int("amount").notNull(),
  date: text("date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  type: text("type").notNull(),
  createdAt: datetime("created_at").notNull(),
  quantity: int("quantity").default(1),
});

export const products = mysqlTable("products", {
  priceId: varchar("price_id", { length: 60 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: int("price").notNull(),
});
