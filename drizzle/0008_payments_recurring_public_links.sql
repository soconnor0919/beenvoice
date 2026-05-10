-- New columns on beenvoice_invoice
ALTER TABLE "beenvoice_invoice" ADD COLUMN IF NOT EXISTS "invoicePrefix" varchar(20) DEFAULT '#';
--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD COLUMN IF NOT EXISTS "publicToken" varchar(255);
--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD COLUMN IF NOT EXISTS "lastReminderSentAt" timestamp;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_invoice_publicToken_unique'
  ) THEN
    ALTER TABLE "beenvoice_invoice" ADD CONSTRAINT "beenvoice_invoice_publicToken_unique" UNIQUE("publicToken");
  END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_public_token_idx" ON "beenvoice_invoice" USING btree ("publicToken");
--> statement-breakpoint

-- Partial payment tracking
CREATE TABLE IF NOT EXISTS "beenvoice_invoice_payment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoiceId" varchar(255) NOT NULL,
	"amount" real NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"date" timestamp NOT NULL,
	"method" varchar(50) DEFAULT 'other' NOT NULL,
	"notes" varchar(500),
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_invoice_payment_invoiceId_beenvoice_invoice_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_invoice_payment" ADD CONSTRAINT "beenvoice_invoice_payment_invoiceId_beenvoice_invoice_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."beenvoice_invoice"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_invoice_payment_createdById_beenvoice_user_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_invoice_payment" ADD CONSTRAINT "beenvoice_invoice_payment_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_payment_invoice_id_idx" ON "beenvoice_invoice_payment" USING btree ("invoiceId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_payment_created_by_idx" ON "beenvoice_invoice_payment" USING btree ("createdById");
--> statement-breakpoint

-- Recurring invoices
CREATE TABLE IF NOT EXISTS "beenvoice_recurring_invoice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"clientId" varchar(255) NOT NULL,
	"businessId" varchar(255),
	"schedule" varchar(20) DEFAULT 'monthly' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"invoicePrefix" varchar(20) DEFAULT '#',
	"taxRate" real DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"notes" varchar(1000),
	"emailMessage" varchar(2000),
	"nextDueAt" timestamp NOT NULL,
	"lastGeneratedAt" timestamp,
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_recurring_invoice_clientId_beenvoice_client_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_recurring_invoice" ADD CONSTRAINT "beenvoice_recurring_invoice_clientId_beenvoice_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."beenvoice_client"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_recurring_invoice_businessId_beenvoice_business_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_recurring_invoice" ADD CONSTRAINT "beenvoice_recurring_invoice_businessId_beenvoice_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."beenvoice_business"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_recurring_invoice_createdById_beenvoice_user_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_recurring_invoice" ADD CONSTRAINT "beenvoice_recurring_invoice_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recurring_invoice_created_by_idx" ON "beenvoice_recurring_invoice" USING btree ("createdById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recurring_invoice_client_id_idx" ON "beenvoice_recurring_invoice" USING btree ("clientId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recurring_invoice_status_idx" ON "beenvoice_recurring_invoice" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recurring_invoice_next_due_idx" ON "beenvoice_recurring_invoice" USING btree ("nextDueAt");
--> statement-breakpoint

-- Recurring invoice line items
CREATE TABLE IF NOT EXISTS "beenvoice_recurring_invoice_item" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"recurringInvoiceId" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"hours" real NOT NULL,
	"rate" real NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'beenvoice_recurring_invoice_item_recurringInvoiceId_beenvoice_recurring_invoice_id_fk'
  ) THEN
    ALTER TABLE "beenvoice_recurring_invoice_item" ADD CONSTRAINT "beenvoice_recurring_invoice_item_recurringInvoiceId_beenvoice_recurring_invoice_id_fk" FOREIGN KEY ("recurringInvoiceId") REFERENCES "public"."beenvoice_recurring_invoice"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recurring_invoice_item_recurring_id_idx" ON "beenvoice_recurring_invoice_item" USING btree ("recurringInvoiceId");
