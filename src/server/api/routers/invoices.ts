import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { invoices, invoiceItems, clients } from "~/server/db/schema";

const invoiceItemSchema = z.object({
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  hours: z.number().min(0, "Hours must be positive"),
  rate: z.number().min(0, "Rate must be positive"),
});

const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string(),
});

export const invoicesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.invoices.findMany({
      where: eq(invoices.createdById, ctx.session.user.id),
      with: {
        client: true,
        items: true,
      },
      orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.id),
        with: {
          client: true,
          items: {
            orderBy: (items, { asc }) => [asc(items.date)],
          },
        },
      });
    }),

  create: protectedProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { items, ...invoiceData } = input;
      
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.hours * item.rate), 0);

      // Create invoice
      const [invoice] = await ctx.db.insert(invoices).values({
        ...invoiceData,
        totalAmount,
        createdById: ctx.session.user.id,
      }).returning();

      if (!invoice) {
        throw new Error("Failed to create invoice");
      }

      // Create invoice items
      const itemsToInsert = items.map(item => ({
        ...item,
        invoiceId: invoice.id,
        amount: item.hours * item.rate,
      }));

      await ctx.db.insert(invoiceItems).values(itemsToInsert);

      return invoice;
    }),

  update: protectedProcedure
    .input(updateInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, items, ...invoiceData } = input;
      
      if (items) {
        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.hours * item.rate), 0);
        
        // Update invoice
        await ctx.db
          .update(invoices)
          .set({
            ...invoiceData,
            totalAmount,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, id));

        // Delete existing items and create new ones
        await ctx.db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
        
        const itemsToInsert = items.map(item => ({
          ...item,
          invoiceId: id,
          amount: item.hours * item.rate,
        }));

        await ctx.db.insert(invoiceItems).values(itemsToInsert);
      } else {
        // Update invoice without items
        await ctx.db
          .update(invoices)
          .set({
            ...invoiceData,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, id));
      }

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Items will be deleted automatically due to cascade
      return await ctx.db.delete(invoices).where(eq(invoices.id, input.id));
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["draft", "sent", "paid", "overdue"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(invoices)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, input.id));
    }),
}); 