ALTER TABLE `beenvoice_invoice_item` ADD COLUMN `position` integer DEFAULT 0 NOT NULL;
CREATE INDEX `invoice_item_position_idx` ON `beenvoice_invoice_item` (`position`);
