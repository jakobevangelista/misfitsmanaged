ALTER TABLE `members` MODIFY COLUMN `user_id` text NOT NULL;
ALTER TABLE `members` MODIFY COLUMN `qr_code` text NOT NULL;
ALTER TABLE `members` ADD `is_admin` boolean DEFAULT false NOT NULL;