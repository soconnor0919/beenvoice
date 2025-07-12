CREATE TABLE `beenvoice_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `beenvoice_account` (`userId`);--> statement-breakpoint
CREATE TABLE `beenvoice_business` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255),
	`phone` text(50),
	`addressLine1` text(255),
	`addressLine2` text(255),
	`city` text(100),
	`state` text(50),
	`postalCode` text(20),
	`country` text(100),
	`website` text(255),
	`taxId` text(100),
	`logoUrl` text(500),
	`isDefault` integer DEFAULT false,
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `business_created_by_idx` ON `beenvoice_business` (`createdById`);--> statement-breakpoint
CREATE INDEX `business_name_idx` ON `beenvoice_business` (`name`);--> statement-breakpoint
CREATE INDEX `business_email_idx` ON `beenvoice_business` (`email`);--> statement-breakpoint
CREATE INDEX `business_is_default_idx` ON `beenvoice_business` (`isDefault`);--> statement-breakpoint
CREATE TABLE `beenvoice_client` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255),
	`phone` text(50),
	`addressLine1` text(255),
	`addressLine2` text(255),
	`city` text(100),
	`state` text(50),
	`postalCode` text(20),
	`country` text(100),
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `client_created_by_idx` ON `beenvoice_client` (`createdById`);--> statement-breakpoint
CREATE INDEX `client_name_idx` ON `beenvoice_client` (`name`);--> statement-breakpoint
CREATE INDEX `client_email_idx` ON `beenvoice_client` (`email`);--> statement-breakpoint
CREATE TABLE `beenvoice_invoice_item` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`invoiceId` text(255) NOT NULL,
	`date` integer NOT NULL,
	`description` text(500) NOT NULL,
	`hours` real NOT NULL,
	`rate` real NOT NULL,
	`amount` real NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`invoiceId`) REFERENCES `beenvoice_invoice`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `invoice_item_invoice_id_idx` ON `beenvoice_invoice_item` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `invoice_item_date_idx` ON `beenvoice_invoice_item` (`date`);--> statement-breakpoint
CREATE INDEX `invoice_item_position_idx` ON `beenvoice_invoice_item` (`position`);--> statement-breakpoint
CREATE TABLE `beenvoice_invoice` (
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
CREATE INDEX `invoice_business_id_idx` ON `beenvoice_invoice` (`businessId`);--> statement-breakpoint
CREATE INDEX `invoice_client_id_idx` ON `beenvoice_invoice` (`clientId`);--> statement-breakpoint
CREATE INDEX `invoice_created_by_idx` ON `beenvoice_invoice` (`createdById`);--> statement-breakpoint
CREATE INDEX `invoice_number_idx` ON `beenvoice_invoice` (`invoiceNumber`);--> statement-breakpoint
CREATE INDEX `invoice_status_idx` ON `beenvoice_invoice` (`status`);--> statement-breakpoint
CREATE TABLE `beenvoice_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `beenvoice_session` (`userId`);--> statement-breakpoint
CREATE TABLE `beenvoice_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`password` text(255),
	`emailVerified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `beenvoice_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
