import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `beenvoice_${name}`);

// Auth-related tables (keeping existing)
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  emailVerified: d.boolean().default(false).notNull(),
  image: d.varchar({ length: 255 }),
  createdAt: d.timestamp().notNull().defaultNow(),
  updatedAt: d.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  password: d.varchar({ length: 255 }), // Matched DB: varchar(255)
  resetToken: d.varchar({ length: 255 }), // Matched DB: varchar(255)
  resetTokenExpiry: d.timestamp(),
  // Custom fields
  prefersReducedMotion: d.boolean().default(false).notNull(),
  animationSpeedMultiplier: d.real().default(1).notNull(),
  colorTheme: d.varchar({ length: 50 }).default("slate").notNull(),
  customColor: d.varchar({ length: 50 }),
  theme: d.varchar({ length: 20 }).default("system").notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clients: many(clients),
  businesses: many(businesses),
  invoices: many(invoices),
  sessions: many(sessions), // Added missing relation
}));

export const accounts = createTable(
  "account",
  (d) => ({
    id: d.text().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()), // Matched DB: text
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    accountId: d.varchar({ length: 255 }).notNull(),
    providerId: d.varchar({ length: 255 }).notNull(),
    accessToken: d.text(),
    refreshToken: d.text(),
    accessTokenExpiresAt: d.timestamp(),
    refreshTokenExpiresAt: d.timestamp(),
    scope: d.varchar({ length: 255 }),
    idToken: d.text(),
    password: d.text(), // Matched DB: text
    createdAt: d.timestamp().notNull().defaultNow(),
    updatedAt: d.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }),
  (t) => [
    index("account_userId_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    id: d.text().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()), // Matched DB: text
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    token: d.varchar({ length: 255 }).notNull().unique(),
    expiresAt: d.timestamp().notNull(),
    ipAddress: d.text(), // Matched DB: text
    userAgent: d.text(), // Matched DB: text
    createdAt: d.timestamp().notNull().defaultNow(),
    updatedAt: d.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    id: d.text().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()), // Matched DB: text
    identifier: d.varchar({ length: 255 }).notNull(),
    value: d.varchar({ length: 255 }).notNull(),
    expiresAt: d.timestamp().notNull(),
    createdAt: d.timestamp().notNull().defaultNow(),
    updatedAt: d.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }),
  (t) => [index("verification_token_identifier_idx").on(t.identifier)],
);

export const ssoProviders = createTable(
  "sso_provider",
  (d) => ({
    id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    providerId: d.varchar({ length: 255 }).notNull().unique(),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    redirectURI: d.varchar({ length: 255 }).notNull().default(""), // Added detailed fields
    oidcConfig: d.text(),
    samlConfig: d.text(),
    createdAt: d.timestamp().notNull().defaultNow(),
    updatedAt: d.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }),
  (t) => [index("sso_provider_user_id_idx").on(t.userId)],
);

// Invoicing app tables
export const clients = createTable(
  "client",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.varchar({ length: 255 }).notNull(),
    email: d.varchar({ length: 255 }),
    phone: d.varchar({ length: 50 }),
    addressLine1: d.varchar({ length: 255 }),
    addressLine2: d.varchar({ length: 255 }),
    city: d.varchar({ length: 100 }),
    state: d.varchar({ length: 50 }),
    postalCode: d.varchar({ length: 20 }),
    country: d.varchar({ length: 100 }),
    defaultHourlyRate: d.real(),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().$onUpdate(() => new Date()),
  }),
  (t) => [
    index("client_created_by_idx").on(t.createdById),
    index("client_name_idx").on(t.name),
    index("client_email_idx").on(t.email),
  ],
);

export const clientsRelations = relations(clients, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [clients.createdById],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const businesses = createTable(
  "business",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.varchar({ length: 255 }).notNull(),
    nickname: d.varchar({ length: 255 }),
    email: d.varchar({ length: 255 }),
    phone: d.varchar({ length: 50 }),
    addressLine1: d.varchar({ length: 255 }),
    addressLine2: d.varchar({ length: 255 }),
    city: d.varchar({ length: 100 }),
    state: d.varchar({ length: 50 }),
    postalCode: d.varchar({ length: 20 }),
    country: d.varchar({ length: 100 }),
    website: d.varchar({ length: 255 }),
    taxId: d.varchar({ length: 100 }),
    logoUrl: d.varchar({ length: 500 }),
    isDefault: d.boolean().default(false),
    // Email configuration for custom Resend setup
    resendApiKey: d.varchar({ length: 255 }),
    resendDomain: d.varchar({ length: 255 }),
    emailFromName: d.varchar({ length: 255 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().$onUpdate(() => new Date()),
  }),
  (t) => [
    index("business_created_by_idx").on(t.createdById),
    index("business_name_idx").on(t.name),
    index("business_nickname_idx").on(t.nickname),
    index("business_email_idx").on(t.email),
    index("business_is_default_idx").on(t.isDefault),
  ],
);

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [businesses.createdById],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoices = createTable(
  "invoice",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceNumber: d.varchar({ length: 100 }).notNull(),
    businessId: d.varchar({ length: 255 }).references(() => businesses.id),
    clientId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => clients.id),
    issueDate: d.timestamp().notNull(),
    dueDate: d.timestamp().notNull(),
    status: d.varchar({ length: 50 }).notNull().default("draft"), // draft, sent, paid (overdue computed)
    totalAmount: d.real().notNull().default(0),
    taxRate: d.real().notNull().default(0.0),
    notes: d.varchar({ length: 1000 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().$onUpdate(() => new Date()),
  }),
  (t) => [
    index("invoice_business_id_idx").on(t.businessId),
    index("invoice_client_id_idx").on(t.clientId),
    index("invoice_created_by_idx").on(t.createdById),
    index("invoice_number_idx").on(t.invoiceNumber),
    index("invoice_status_idx").on(t.status),
  ],
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  business: one(businesses, {
    fields: [invoices.businessId],
    references: [businesses.id],
  }),
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  createdBy: one(users, {
    fields: [invoices.createdById],
    references: [users.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItems = createTable(
  "invoice_item",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    date: d.timestamp().notNull(),
    description: d.varchar({ length: 500 }).notNull(),
    hours: d.real().notNull(),
    rate: d.real().notNull(),
    amount: d.real().notNull(),
    position: d.integer().notNull().default(0), // NEW: position for ordering
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("invoice_item_invoice_id_idx").on(t.invoiceId),
    index("invoice_item_date_idx").on(t.date),
    index("invoice_item_position_idx").on(t.position), // NEW: index for position
  ],
);

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));
