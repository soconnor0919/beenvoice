import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { expenses, clients, businesses, invoices } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { EXPENSE_CATEGORIES } from "~/lib/expense-categories";

export { EXPENSE_CATEGORIES };

const createExpenseSchema = z.object({
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  category: z.string().optional().or(z.literal("")),
  billable: z.boolean().default(false),
  reimbursable: z.boolean().default(false),
  notes: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().or(z.literal("")),
  businessId: z.string().optional().or(z.literal("")),
  invoiceId: z.string().optional().or(z.literal("")),
});

const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.string(),
});

export const expensesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.expenses.findMany({
      where: eq(expenses.createdById, ctx.session.user.id),
      with: { client: true, business: true, invoice: true },
      orderBy: [desc(expenses.date)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const expense = await ctx.db.query.expenses.findFirst({
        where: and(
          eq(expenses.id, input.id),
          eq(expenses.createdById, ctx.session.user.id),
        ),
        with: { client: true, business: true, invoice: true },
      });

      if (!expense) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Expense not found" });
      }

      return expense;
    }),

  create: protectedProcedure
    .input(createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const clean = {
        ...input,
        clientId: input.clientId?.trim() || null,
        businessId: input.businessId?.trim() || null,
        invoiceId: input.invoiceId?.trim() || null,
        category: input.category?.trim() || null,
        notes: input.notes?.trim() || null,
      };

      if (clean.clientId) {
        const client = await ctx.db.query.clients.findFirst({
          where: and(
            eq(clients.id, clean.clientId),
            eq(clients.createdById, ctx.session.user.id),
          ),
        });
        if (!client) throw new TRPCError({ code: "FORBIDDEN", message: "Client not found" });
      }

      if (clean.businessId) {
        const business = await ctx.db.query.businesses.findFirst({
          where: and(
            eq(businesses.id, clean.businessId),
            eq(businesses.createdById, ctx.session.user.id),
          ),
        });
        if (!business) throw new TRPCError({ code: "FORBIDDEN", message: "Business not found" });
      }

      if (clean.invoiceId) {
        const invoice = await ctx.db.query.invoices.findFirst({
          where: and(
            eq(invoices.id, clean.invoiceId),
            eq(invoices.createdById, ctx.session.user.id),
          ),
        });
        if (!invoice) throw new TRPCError({ code: "FORBIDDEN", message: "Invoice not found" });
      }

      const [expense] = await ctx.db
        .insert(expenses)
        .values({ ...clean, createdById: ctx.session.user.id })
        .returning();

      return expense;
    }),

  update: protectedProcedure
    .input(updateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.query.expenses.findFirst({
        where: and(
          eq(expenses.id, id),
          eq(expenses.createdById, ctx.session.user.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Expense not found" });
      }

      const clean = {
        ...data,
        clientId: data.clientId?.trim() || null,
        businessId: data.businessId?.trim() || null,
        invoiceId: data.invoiceId?.trim() || null,
        category: data.category?.trim() || null,
        notes: data.notes?.trim() || null,
        updatedAt: new Date(),
      };

      await ctx.db.update(expenses).set(clean).where(eq(expenses.id, id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.expenses.findFirst({
        where: and(
          eq(expenses.id, input.id),
          eq(expenses.createdById, ctx.session.user.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Expense not found" });
      }

      await ctx.db.delete(expenses).where(eq(expenses.id, input.id));

      return { success: true };
    }),
});
