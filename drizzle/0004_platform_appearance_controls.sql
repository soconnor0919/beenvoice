ALTER TABLE "beenvoice_user"
ADD COLUMN "bodyFontPreference" varchar(50) DEFAULT 'brand' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_user"
ADD COLUMN "headingFontPreference" varchar(50) DEFAULT 'brand' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_user"
ADD COLUMN "radiusPreference" varchar(20) DEFAULT 'xl' NOT NULL;
--> statement-breakpoint
ALTER TABLE "beenvoice_user"
ADD COLUMN "sidebarStyle" varchar(20) DEFAULT 'floating' NOT NULL;
