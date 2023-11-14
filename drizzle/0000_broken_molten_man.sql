-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `contracts` (
	`status` text NOT NULL,
	`type` text NOT NULL,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`owner_id` text NOT NULL,
	`stripe_id` varchar(60) NOT NULL,
	`remaining_days` int,
	CONSTRAINT `contracts_stripe_id_pk` PRIMARY KEY(`stripe_id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`qr_code` text NOT NULL,
	`is_admin` tinyint NOT NULL DEFAULT 0,
	`email_address` text NOT NULL,
	`phone_number` text,
	`is_waiver_signed` tinyint DEFAULT 0,
	`customer_id` text,
	`waiver_signature` text,
	`waiver_date` text,
	`real_scan_id` text NOT NULL DEFAULT '0',
	`parent_name` text,
	`parent_signature` text,
	`minor_dob` text,
	`DOB` date,
	`contract_status` text NOT NULL DEFAULT 'none',
	`profile_picture` text,
	CONSTRAINT `members_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`name` text NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`price_id` varchar(60) NOT NULL,
	CONSTRAINT `products_price_id_pk` PRIMARY KEY(`price_id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`amount` int NOT NULL,
	`date` text NOT NULL,
	`payment_method` text NOT NULL,
	`type` text NOT NULL,
	`created_at` datetime NOT NULL,
	`quantity` int DEFAULT 1,
	CONSTRAINT `transactions_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`qr_code` text NOT NULL,
	`is_admin` tinyint NOT NULL DEFAULT 0,
	`email_address` varchar(255) NOT NULL,
	`phone_number` text,
	`is_waiver_signed` tinyint DEFAULT 0,
	`customer_id` text,
	`waiver_signature` text,
	`waiver_date` text,
	`real_scan_id` text NOT NULL DEFAULT '0',
	`parent_name` text,
	`parent_signature` text,
	`minor_dob` text,
	`DOB` date,
	`contract_status` text NOT NULL DEFAULT 'none',
	`profile_picture` text,
	CONSTRAINT `users_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`),
	CONSTRAINT `email_idx` UNIQUE(`email_address`)
);

*/