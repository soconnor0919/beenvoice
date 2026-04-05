CREATE TABLE "beenvoice_expense" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"businessId" varchar(255),
	"clientId" varchar(255),
	"invoiceId" varchar(255),
	"date" timestamp NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" real NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"category" varchar(100),
	"billable" boolean DEFAULT false NOT NULL,
	"reimbursable" boolean DEFAULT false NOT NULL,
	"notes" varchar(500),
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "beenvoice_invoice_template" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'notes' NOT NULL,
	"content" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "beenvoice_client" ADD COLUMN "currency" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD COLUMN "currency" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "beenvoice_expense" ADD CONSTRAINT "beenvoice_expense_businessId_beenvoice_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."beenvoice_business"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_expense" ADD CONSTRAINT "beenvoice_expense_clientId_beenvoice_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."beenvoice_client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_expense" ADD CONSTRAINT "beenvoice_expense_invoiceId_beenvoice_invoice_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."beenvoice_invoice"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_expense" ADD CONSTRAINT "beenvoice_expense_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice_template" ADD CONSTRAINT "beenvoice_invoice_template_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_created_by_idx" ON "beenvoice_expense" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "expense_client_id_idx" ON "beenvoice_expense" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "expense_invoice_id_idx" ON "beenvoice_expense" USING btree ("invoiceId");--> statement-breakpoint
CREATE INDEX "expense_date_idx" ON "beenvoice_expense" USING btree ("date");--> statement-breakpoint
CREATE INDEX "expense_billable_idx" ON "beenvoice_expense" USING btree ("billable");--> statement-breakpoint
CREATE INDEX "invoice_template_created_by_idx" ON "beenvoice_invoice_template" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "invoice_template_type_idx" ON "beenvoice_invoice_template" USING btree ("type");