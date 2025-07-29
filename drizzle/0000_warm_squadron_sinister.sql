CREATE TABLE "beenvoice_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "beenvoice_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "beenvoice_business" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"addressLine1" varchar(255),
	"addressLine2" varchar(255),
	"city" varchar(100),
	"state" varchar(50),
	"postalCode" varchar(20),
	"country" varchar(100),
	"website" varchar(255),
	"taxId" varchar(100),
	"logoUrl" varchar(500),
	"isDefault" boolean DEFAULT false,
	"resendApiKey" varchar(255),
	"resendDomain" varchar(255),
	"emailFromName" varchar(255),
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "beenvoice_client" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"addressLine1" varchar(255),
	"addressLine2" varchar(255),
	"city" varchar(100),
	"state" varchar(50),
	"postalCode" varchar(20),
	"country" varchar(100),
	"defaultHourlyRate" real DEFAULT 100 NOT NULL,
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "beenvoice_invoice_item" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoiceId" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"description" varchar(500) NOT NULL,
	"hours" real NOT NULL,
	"rate" real NOT NULL,
	"amount" real NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beenvoice_invoice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoiceNumber" varchar(100) NOT NULL,
	"businessId" varchar(255),
	"clientId" varchar(255) NOT NULL,
	"issueDate" timestamp NOT NULL,
	"dueDate" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"totalAmount" real DEFAULT 0 NOT NULL,
	"taxRate" real DEFAULT 0 NOT NULL,
	"notes" varchar(1000),
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "beenvoice_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beenvoice_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "beenvoice_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "beenvoice_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "beenvoice_account" ADD CONSTRAINT "beenvoice_account_userId_beenvoice_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_business" ADD CONSTRAINT "beenvoice_business_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_client" ADD CONSTRAINT "beenvoice_client_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice_item" ADD CONSTRAINT "beenvoice_invoice_item_invoiceId_beenvoice_invoice_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."beenvoice_invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD CONSTRAINT "beenvoice_invoice_businessId_beenvoice_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."beenvoice_business"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD CONSTRAINT "beenvoice_invoice_clientId_beenvoice_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."beenvoice_client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_invoice" ADD CONSTRAINT "beenvoice_invoice_createdById_beenvoice_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beenvoice_session" ADD CONSTRAINT "beenvoice_session_userId_beenvoice_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."beenvoice_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "beenvoice_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "business_created_by_idx" ON "beenvoice_business" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "business_name_idx" ON "beenvoice_business" USING btree ("name");--> statement-breakpoint
CREATE INDEX "business_email_idx" ON "beenvoice_business" USING btree ("email");--> statement-breakpoint
CREATE INDEX "business_is_default_idx" ON "beenvoice_business" USING btree ("isDefault");--> statement-breakpoint
CREATE INDEX "client_created_by_idx" ON "beenvoice_client" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "client_name_idx" ON "beenvoice_client" USING btree ("name");--> statement-breakpoint
CREATE INDEX "client_email_idx" ON "beenvoice_client" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invoice_item_invoice_id_idx" ON "beenvoice_invoice_item" USING btree ("invoiceId");--> statement-breakpoint
CREATE INDEX "invoice_item_date_idx" ON "beenvoice_invoice_item" USING btree ("date");--> statement-breakpoint
CREATE INDEX "invoice_item_position_idx" ON "beenvoice_invoice_item" USING btree ("position");--> statement-breakpoint
CREATE INDEX "invoice_business_id_idx" ON "beenvoice_invoice" USING btree ("businessId");--> statement-breakpoint
CREATE INDEX "invoice_client_id_idx" ON "beenvoice_invoice" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "invoice_created_by_idx" ON "beenvoice_invoice" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "invoice_number_idx" ON "beenvoice_invoice" USING btree ("invoiceNumber");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "beenvoice_invoice" USING btree ("status");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "beenvoice_session" USING btree ("userId");