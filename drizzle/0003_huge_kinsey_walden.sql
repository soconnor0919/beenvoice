PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_beenvoice_invoice` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`invoiceNumber` text(100) NOT NULL,
	`businessId` text(255),
	`clientId` text(255) NOT NULL,
	`issueDate` integer NOT NULL,
	`dueDate` integer NOT NULL,
	`status` text(50) DEFAULT 'draft' NOT NULL,
	`totalAmount` real DEFAULT 0 NOT NULL,
	`taxRate` real DEFAULT 0 NOT NULL,
	`notes` text(1000),
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`businessId`) REFERENCES `beenvoice_business`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clientId`) REFERENCES `beenvoice_client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_beenvoice_invoice`("id", "invoiceNumber", "businessId", "clientId", "issueDate", "dueDate", "status", "totalAmount", "taxRate", "notes", "createdById", "createdAt", "updatedAt") SELECT "id", "invoiceNumber", "businessId", "clientId", "issueDate", "dueDate", "status", "totalAmount", "taxRate", "notes", "createdById", "createdAt", "updatedAt" FROM `beenvoice_invoice`;--> statement-breakpoint
DROP TABLE `beenvoice_invoice`;--> statement-breakpoint
ALTER TABLE `__new_beenvoice_invoice` RENAME TO `beenvoice_invoice`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `invoice_business_id_idx` ON `beenvoice_invoice` (`businessId`);--> statement-breakpoint
CREATE INDEX `invoice_client_id_idx` ON `beenvoice_invoice` (`clientId`);--> statement-breakpoint
CREATE INDEX `invoice_created_by_idx` ON `beenvoice_invoice` (`createdById`);--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `beenvoice_invoice` (`invoiceNumber`);--> statement-breakpoint
CREATE INDEX `invoice_status_idx` ON `beenvoice_invoice` (`status`);