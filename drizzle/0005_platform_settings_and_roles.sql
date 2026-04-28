ALTER TABLE "beenvoice_user"
ADD COLUMN "role" varchar(20) DEFAULT 'user' NOT NULL;
--> statement-breakpoint
UPDATE "beenvoice_user"
SET "role" = 'admin'
WHERE "id" = (
  SELECT "id"
  FROM "beenvoice_user"
  ORDER BY "createdAt" ASC
  LIMIT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beenvoice_platform_setting" (
  "id" varchar(50) PRIMARY KEY DEFAULT 'global' NOT NULL,
  "brandName" varchar(100) DEFAULT 'beenvoice' NOT NULL,
  "brandTagline" varchar(255) DEFAULT 'Simple and efficient invoicing for freelancers and small businesses' NOT NULL,
  "brandLogoText" varchar(100) DEFAULT 'beenvoice' NOT NULL,
  "brandIcon" varchar(20) DEFAULT '$' NOT NULL,
  "colorTheme" varchar(50) DEFAULT 'slate' NOT NULL,
  "customColor" varchar(50),
  "theme" varchar(20) DEFAULT 'system' NOT NULL,
  "interfaceTheme" varchar(50) DEFAULT 'beenvoice' NOT NULL,
  "bodyFontPreference" varchar(50) DEFAULT 'brand' NOT NULL,
  "headingFontPreference" varchar(50) DEFAULT 'brand' NOT NULL,
  "radiusPreference" varchar(20) DEFAULT 'xl' NOT NULL,
  "sidebarStyle" varchar(20) DEFAULT 'floating' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "beenvoice_platform_setting" (
  "id",
  "brandName",
  "brandTagline",
  "brandLogoText",
  "brandIcon",
  "colorTheme",
  "customColor",
  "theme",
  "interfaceTheme",
  "bodyFontPreference",
  "headingFontPreference",
  "radiusPreference",
  "sidebarStyle"
) VALUES (
  'global',
  'beenvoice',
  'Simple and efficient invoicing for freelancers and small businesses',
  'beenvoice',
  '$',
  'slate',
  NULL,
  'system',
  'beenvoice',
  'brand',
  'brand',
  'xl',
  'floating'
) ON CONFLICT ("id") DO NOTHING;
