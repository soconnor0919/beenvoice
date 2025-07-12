ALTER TABLE `beenvoice_invoice` ADD COLUMN `taxRate` real NOT NULL DEFAULT 0;
UPDATE `beenvoice_invoice` SET `taxRate` = 0 WHERE `taxRate` IS NULL;