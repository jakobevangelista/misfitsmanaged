ALTER TABLE `contracts` ADD `owner_id` int NOT NULL;
ALTER TABLE `members` ADD `contract_status` text DEFAULT ('none');