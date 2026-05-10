import { z } from "zod";
import { eq, sum } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { invoicePayments, invoices } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

const PAYMENT_METHODS = ["cash", "check", "bank_transfer", "credit_card", "paypal", "other"] as const;

export const paymentsRouter = createTRPCRouter({
  getByInvoice: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.invoiceId),
      });
      if (invoice?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return ctx.db.query.invoicePayments.findMany({
        where: eq(invoicePayments.invoiceId, input.invoiceId),
        orderBy: (p, { desc }) => [desc(p.date)],
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        amount: z.number().positive(),
        date: z.date(),
        method: z.enum(PAYMENT_METHODS).default("other"),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.invoiceId),
      });
      if (invoice?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db.insert(invoicePayments).values({
        invoiceId: input.invoiceId,
        amount: input.amount,
        currency: invoice.currency,
        date: input.date,
        method: input.method,
        notes: input.notes ?? null,
        createdById: ctx.session.user.id,
      });

      // Auto-mark paid if total payments >= invoice total
      const [totals] = await ctx.db
        .select({ paid: sum(invoicePayments.amount) })
        .from(invoicePayments)
        .where(eq(invoicePayments.invoiceId, input.invoiceId));

      const totalPaid = Number(totals?.paid ?? 0);
      if (totalPaid >= invoice.totalAmount && invoice.status !== "paid") {
        await ctx.db
          .update(invoices)
          .set({ status: "paid" })
          .where(eq(invoices.id, input.invoiceId));
      }

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.query.invoicePayments.findFirst({
        where: eq(invoicePayments.id, input.id),
      });
      if (!payment) throw new TRPCError({ code: "NOT_FOUND" });

      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, payment.invoiceId),
      });
      if (invoice?.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.delete(invoicePayments).where(eq(invoicePayments.id, input.id));

      // Re-check paid status after deletion
      const [totals] = await ctx.db
        .select({ paid: sum(invoicePayments.amount) })
        .from(invoicePayments)
        .where(eq(invoicePayments.invoiceId, payment.invoiceId));

      const totalPaid = Number(totals?.paid ?? 0);
      if (totalPaid < invoice.totalAmount && invoice.status === "paid") {
        await ctx.db
          .update(invoices)
          .set({ status: "sent" })
          .where(eq(invoices.id, payment.invoiceId));
      }

      return { success: true };
    }),
});
