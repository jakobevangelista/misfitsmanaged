CREATE TABLE `contracts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`type` text NOT NULL,
	`length` datetime NOT NULL,
	`start_date` datetime NOT NULL,
	`email_address` datetime NOT NULL,
	`paid` boolean DEFAULT false);

ALTER TABLE `members` MODIFY COLUMN `name` text NOT NULL;