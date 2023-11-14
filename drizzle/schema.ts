import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, text, datetime, varchar, int, unique, serial, tinyint, date } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const contracts = mysqlTable("contracts", {
	status: text("status").notNull(),
	type: text("type").notNull(),
	startDate: datetime("start_date", { mode: 'string'}).notNull(),
	endDate: datetime("end_date", { mode: 'string'}).notNull(),
	ownerId: text("owner_id").notNull(),
	stripeId: varchar("stripe_id", { length: 60 }).notNull(),
	remainingDays: int("remaining_days"),
},
(table) => {
	return {
		contractsStripeIdPk: primaryKey({ columns: [table.stripeId], name: "contracts_stripe_id_pk"}),
	}
});

export const members = mysqlTable("members", {
	id: serial("id").notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	qrCode: text("qr_code").notNull(),
	isAdmin: tinyint("is_admin").default(0).notNull(),
	emailAddress: text("email_address").notNull(),
	phoneNumber: text("phone_number"),
	isWaiverSigned: tinyint("is_waiver_signed").default(0),
	customerId: text("customer_id"),
	waiverSignature: text("waiver_signature"),
	waiverDate: text("waiver_date"),
	realScanId: text("real_scan_id").default(sql`'0'`).notNull(),
	parentName: text("parent_name"),
	parentSignature: text("parent_signature"),
	minorDob: text("minor_dob"),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date("DOB", { mode: 'string' }),
	contractStatus: text("contract_status").default(sql`'none'`).notNull(),
	profilePicture: text("profile_picture"),
},
(table) => {
	return {
		membersIdPk: primaryKey({ columns: [table.id], name: "members_id_pk"}),
		id: unique("id").on(table.id),
	}
});

export const products = mysqlTable("products", {
	name: text("name").notNull(),
	description: text("description"),
	price: int("price").notNull(),
	priceId: varchar("price_id", { length: 60 }).notNull(),
},
(table) => {
	return {
		productsPriceIdPk: primaryKey({ columns: [table.priceId], name: "products_price_id_pk"}),
	}
});

export const transactions = mysqlTable("transactions", {
	id: serial("id").notNull(),
	ownerId: text("owner_id").notNull(),
	amount: int("amount").notNull(),
	date: text("date").notNull(),
	paymentMethod: text("payment_method").notNull(),
	type: text("type").notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	quantity: int("quantity").default(1),
},
(table) => {
	return {
		transactionsIdPk: primaryKey({ columns: [table.id], name: "transactions_id_pk"}),
		id: unique("id").on(table.id),
	}
});

export const users = mysqlTable("users", {
	id: serial("id").notNull(),
	userId: text("user_id").notNull(),
	name: text("name").notNull(),
	qrCode: text("qr_code").notNull(),
	isAdmin: tinyint("is_admin").default(0).notNull(),
	emailAddress: varchar("email_address", { length: 255 }).notNull(),
	phoneNumber: text("phone_number"),
	isWaiverSigned: tinyint("is_waiver_signed").default(0),
	customerId: text("customer_id"),
	waiverSignature: text("waiver_signature"),
	waiverDate: text("waiver_date"),
	realScanId: text("real_scan_id").default(sql`'0'`).notNull(),
	parentName: text("parent_name"),
	parentSignature: text("parent_signature"),
	minorDob: text("minor_dob"),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date("DOB", { mode: 'string' }),
	contractStatus: text("contract_status").default(sql`'none'`).notNull(),
	profilePicture: text("profile_picture"),
},
(table) => {
	return {
		usersIdPk: primaryKey({ columns: [table.id], name: "users_id_pk"}),
		id: unique("id").on(table.id),
		emailIdx: unique("email_idx").on(table.emailAddress),
	}
});