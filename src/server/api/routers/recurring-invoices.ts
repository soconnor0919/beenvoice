import { z } from "zod";
import { and, eq, lte } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  recurringInvoices,
  recurringInvoiceItems,
  invoices,
  invoiceItems,
  clients,
  businesses,
} from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { db as DbType } from "~/server/db";

export function nextDueDate(schedule: string, from = new Date()): Date {
  const d = new Date(from);
  switch (schedule) {
    case "weekly":    d.setDate(d.getDate() + 7); break;
    case "biweekly":  d.setDate(d.getDate() + 14); break;
    case "monthly":   d.setMonth(d.getMonth() + 1); break;
    case "quarterly": d.setMonth(d.getMonth() + 3); break;
    case "yearly":    d.setFullYear(d.getFullYear() + 1); break;
  }
  return d;
}

type RecurringWithItems = typeof recurringInvoices.$inferSelect & {
  items: (typeof recurringInvoiceItems.$inferSelect)[];
};

export async function generateInvoiceFromRecurring(
  db: typeof DbType,
  recurring: RecurringWithItems,
): Promise<{ id: string }> {
  const now = new Date();
  const invoiceNumber = `REC-${Date.now()}`;

  const subtotal = recurring.items.reduce((s, i) => s + i.hours * i.rate, 0);
  const taxAmount = (subtotal * recurring.taxRate) / 100;
  const total = subtotal + taxAmount;

  const [newInvoice] = await db
    .insert(invoices)
    .values({
      invoiceNumber,
      invoicePrefix: recurring.invoicePrefix ?? "#",
      clientId: recurring.clientId,
      businessId: recurring.businessId ?? null,
      issueDate: now,
      dueDate: nextDueDate("monthly", now),
      status: "draft",
      totalAmount: total,
      taxRate: recurring.taxRate,
      notes: recurring.notes ?? null,
      emailMessage: recurring.emailMessage ?? null,
      currency: recurring.currency,
      createdById: recurring.createdById,
    })
    .returning({ id: invoices.id });

  if (!newInvoice) throw new Error("Failed to create invoice");

  if (recurring.items.length > 0) {
    await db.insert(invoiceItems).values(
      recurring.items.map((item, idx) => ({
        invoiceId: newInvoice.id,
        date: now,
        description: item.description,
        hours: item.hours,
        rate: item.rate,
        amount: item.hours * item.rate,
        position: item.position ?? idx,
      })),
    );
  }

  return newInvoice;
}

export async function generateDueRecurringInvoices(db: typeof DbType): Promise<number> {
  const now = new Date();
  const due = await db.query.recurringInvoices.findMany({
    where: and(
      eq(recurringInvoices.status, "active"),
      lte(recurringInvoices.nextDueAt, now),
    ),
    with: { items: true },
  });

  let generated = 0;
  for (const rec of due) {
    try {
      await generateInvoiceFromRecurring(db, rec);
      await db
        .update(recurringInvoices)
        .set({ lastGeneratedAt: now, nextDueAt: nextDueDate(rec.schedule, now) })
        .where(eq(recurringInvoices.id, rec.id));
      generated++;
    } catch {
      // continue on individual failures
    }
  }
  return generated;
}

const scheduleEnum = z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]);

const recurringItemSchema = z.object({
  description: z.string().min(1),
  hours: z.number().min(0),
  rate: z.number().min(0),
  position: z.number().int().default(0),
});

const recurringInvoiceSchema = z.object({
  name: z.string().min(1).max(255),
  clientId: z.string().min(1),
  businessId: z.string().optional().or(z.literal("")),
  schedule: scheduleEnum,
  invoicePrefix: z.string().optional().default("#"),
  taxRate: z.number().min(0).max(100).default(0),
  currency: z.string().length(3).default("USD"),
  notes: z.string().optional().or(z.literal("")),
  emailMessage: z.string().optional().or(z.literal("")),
  items: z.array(recurringItemSchema).min(1),
});

export const recurringInvoicesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.recurringInvoices.findMany({
      where: eq(recurringInvoices.createdById, ctx.session.user.id),
      with: { client: true, business: true, items: true },
      orderBy: (r, { asc }) => [asc(r.nextDueAt)],
    });
  }),

  create: protectedProcedure
    .input(recurringInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.query.clients.findFirst({
        where: eq(clients.id, input.clientId),
      });
      if (client?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Client not found" });
      }
      if (input.businessId) {
        const biz = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.id, input.businessId),
        });
        if (biz?.createdById !== ctx.session.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Business not found" });
        }
      }

      const [rec] = await ctx.db
        .insert(recurringInvoices)
        .values({
          name: input.name,
          clientId: input.clientId,
          businessId: input.businessId ?? null,
          schedule: input.schedule,
          status: "active",
          invoicePrefix: input.invoicePrefix,
          taxRate: input.taxRate,
          currency: input.currency,
          notes: input.notes ?? null,
          emailMessage: input.emailMessage ?? null,
          nextDueAt: nextDueDate(input.schedule),
          createdById: ctx.session.user.id,
        })
        .returning({ id: recurringInvoices.id });

      if (!rec) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await ctx.db.insert(recurringInvoiceItems).values(
        input.items.map((item, idx) => ({
          recurringInvoiceId: rec.id,
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          position: item.position ?? idx,
        })),
      );

      return rec;
    }),

  update: protectedProcedure
    .input(recurringInvoiceSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.recurringInvoices.findFirst({
        where: eq(recurringInvoices.id, input.id),
      });
      if (existing?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(recurringInvoices)
        .set({
          name: input.name,
          clientId: input.clientId,
          businessId: input.businessId ?? null,
          schedule: input.schedule,
          invoicePrefix: input.invoicePrefix,
          taxRate: input.taxRate,
          currency: input.currency,
          notes: input.notes ?? null,
          emailMessage: input.emailMessage ?? null,
        })
        .where(eq(recurringInvoices.id, input.id));

      await ctx.db
        .delete(recurringInvoiceItems)
        .where(eq(recurringInvoiceItems.recurringInvoiceId, input.id));

      await ctx.db.insert(recurringInvoiceItems).values(
        input.items.map((item, idx) => ({
          recurringInvoiceId: input.id,
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          position: item.position ?? idx,
        })),
      );

      return { success: true };
    }),

  pause: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rec = await ctx.db.query.recurringInvoices.findFirst({
        where: eq(recurringInvoices.id, input.id),
      });
      if (rec?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(recurringInvoices)
        .set({ status: "paused" })
        .where(eq(recurringInvoices.id, input.id));
      return { success: true };
    }),

  resume: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rec = await ctx.db.query.recurringInvoices.findFirst({
        where: eq(recurringInvoices.id, input.id),
      });
      if (rec?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(recurringInvoices)
        .set({ status: "active" })
        .where(eq(recurringInvoices.id, input.id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rec = await ctx.db.query.recurringInvoices.findFirst({
        where: eq(recurringInvoices.id, input.id),
      });
      if (rec?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .delete(recurringInvoices)
        .where(eq(recurringInvoices.id, input.id));
      return { success: true };
    }),

  generateNow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rec = await ctx.db.query.recurringInvoices.findFirst({
        where: eq(recurringInvoices.id, input.id),
        with: { items: true },
      });
      if (rec?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const newInvoice = await generateInvoiceFromRecurring(ctx.db, rec);

      await ctx.db
        .update(recurringInvoices)
        .set({ lastGeneratedAt: new Date(), nextDueAt: nextDueDate(rec.schedule) })
        .where(eq(recurringInvoices.id, input.id));

      return { invoiceId: newInvoice.id };
    }),
});
