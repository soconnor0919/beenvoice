import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `beenvoice_${name}`);

// Auth-related tables (keeping existing)
export const users = createTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull(),
  password: d.text({ length: 255 }),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  image: d.text({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clients: many(clients),
  businesses: many(businesses),
  invoices: many(invoices),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.text({ length: 255 }).notNull(),
    providerAccountId: d.text({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text({ length: 255 }),
    scope: d.text({ length: 255 }),
    id_token: d.text(),
    session_state: d.text({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.text({ length: 255 }).notNull(),
    token: d.text({ length: 255 }).notNull(),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Invoicing app tables
export const clients = createTable(
  "client",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text({ length: 255 }).notNull(),
    email: d.text({ length: 255 }),
    phone: d.text({ length: 50 }),
    addressLine1: d.text({ length: 255 }),
    addressLine2: d.text({ length: 255 }),
    city: d.text({ length: 100 }),
    state: d.text({ length: 50 }),
    postalCode: d.text({ length: 20 }),
    country: d.text({ length: 100 }),
    defaultHourlyRate: d.real().notNull().default(100.0),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text({ length: 255 }).notNull(),
    email: d.text({ length: 255 }),
    phone: d.text({ length: 50 }),
    addressLine1: d.text({ length: 255 }),
    addressLine2: d.text({ length: 255 }),
    city: d.text({ length: 100 }),
    state: d.text({ length: 50 }),
    postalCode: d.text({ length: 20 }),
    country: d.text({ length: 100 }),
    website: d.text({ length: 255 }),
    taxId: d.text({ length: 100 }),
    logoUrl: d.text({ length: 500 }),
    isDefault: d.integer({ mode: "boolean" }).default(false),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("business_created_by_idx").on(t.createdById),
    index("business_name_idx").on(t.name),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceNumber: d.text({ length: 100 }).notNull(),
    businessId: d.text({ length: 255 }).references(() => businesses.id),
    clientId: d
      .text({ length: 255 })
      .notNull()
      .references(() => clients.id),
    issueDate: d.integer({ mode: "timestamp" }).notNull(),
    dueDate: d.integer({ mode: "timestamp" }).notNull(),
    status: d.text({ length: 50 }).notNull().default("draft"), // draft, sent, paid, overdue
    totalAmount: d.real().notNull().default(0),
    taxRate: d.real().notNull().default(0.0),
    notes: d.text({ length: 1000 }),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceId: d
      .text({ length: 255 })
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    date: d.integer({ mode: "timestamp" }).notNull(),
    description: d.text({ length: 500 }).notNull(),
    hours: d.real().notNull(),
    rate: d.real().notNull(),
    amount: d.real().notNull(),
    position: d.integer().notNull().default(0), // NEW: position for ordering
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
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
