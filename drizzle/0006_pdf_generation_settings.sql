ALTER TABLE "beenvoice_platform_setting"
ADD COLUMN "pdfTemplate" varchar(20) DEFAULT 'classic' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_platform_setting"
ADD COLUMN "pdfAccentColor" varchar(50) DEFAULT '#111827' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_platform_setting"
ADD COLUMN "pdfFooterText" varchar(120) DEFAULT 'Professional Invoicing' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_platform_setting"
ADD COLUMN "pdfShowLogo" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_platform_setting"
ADD COLUMN "pdfShowPageNumbers" boolean DEFAULT true NOT NULL;
