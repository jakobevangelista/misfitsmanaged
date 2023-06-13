ALTER TABLE `members` MODIFY COLUMN `contract_status` enum('active','expired','none') NOT NULL DEFAULT 'none';
ALTER TABLE `members` ADD `customer_id` text;