import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  invoices,
  invoiceItems,
  clients,
  businesses,
} from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

const invoiceItemSchema = z.object({
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  hours: z.number().min(0, "Hours must be positive"),
  rate: z.number().min(0, "Rate must be positive"),
});

const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoicePrefix: z.string().optional().default("#"),
  businessId: z
    .string()
    .min(1, "Business is required")
    .optional()
    .or(z.literal("")),
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(["draft", "sent", "paid"]).default("draft"),
  notes: z.string().optional().or(z.literal("")),
  taxRate: z.number().min(0).max(100).default(0),
  currency: z.string().length(3).default("USD"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["draft", "sent", "paid"]),
});

const calculateInvoiceTotal = (
  items: Array<z.infer<typeof invoiceItemSchema>>,
  taxRate: number,
) => {
  const subtotal = items.reduce((sum, item) => sum + item.hours * item.rate, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  return subtotal + taxAmount;
};

export const invoicesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.invoices.findMany({
        where: eq(invoices.createdById, ctx.session.user.id),
        with: {
          business: true,
          client: true,
          items: true,
        },
        orderBy: (invoices, { desc }) => [desc(invoices.issueDate)],
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch invoices",
        cause: error,
      });
    }
  }),

  getCurrentOpen: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get the most recent draft invoice
      const currentInvoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.createdById, ctx.session.user.id),
        with: {
          business: true,
          client: true,
          items: {
            orderBy: (items, { asc }) => [asc(items.position)],
          },
        },
        orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
      });

      // Return null if no draft invoice exists
      if (currentInvoice?.status !== "draft") {
        return null;
      }

      return currentInvoice;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current open invoice",
        cause: error,
      });
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.db.query.invoices.findFirst({
          where: eq(invoices.id, input.id),
          with: {
            business: true,
            client: true,
            items: {
              orderBy: (items, { asc }) => [asc(items.position)],
            },
          },
        });

        if (!invoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        // Check if user owns this invoice
        if (invoice.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this invoice",
          });
        }

        return invoice;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch invoice",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { items, ...invoiceData } = input;
        const cleanInvoiceData = {
          ...invoiceData,
          businessId:
            !invoiceData.businessId || invoiceData.businessId.trim() === ""
              ? null
              : invoiceData.businessId,
          notes: invoiceData.notes === "" ? null : invoiceData.notes,
        };

        // Verify business exists and belongs to user (if provided)
        if (cleanInvoiceData.businessId) {
          const business = await ctx.db.query.businesses.findFirst({
            where: eq(businesses.id, cleanInvoiceData.businessId),
          });

          if (!business) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Business not found",
            });
          }

          if (business.createdById !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "You don't have permission to create invoices for this business",
            });
          }
        }

        // Verify client exists and belongs to user
        const client = await ctx.db.query.clients.findFirst({
          where: eq(clients.id, cleanInvoiceData.clientId),
        });

        if (!client) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Client not found",
          });
        }

        if (client.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to create invoices for this client",
          });
        }

        const totalAmount = calculateInvoiceTotal(
          items,
          cleanInvoiceData.taxRate,
        );

        return await ctx.db.transaction(async (tx) => {
          const [invoice] = await tx
            .insert(invoices)
            .values({
              ...cleanInvoiceData,
              totalAmount,
              createdById: ctx.session.user.id,
            })
            .returning();

          if (!invoice) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create invoice",
            });
          }

          await tx.insert(invoiceItems).values(
            items.map((item, idx) => ({
              ...item,
              invoiceId: invoice.id,
              amount: item.hours * item.rate,
              position: idx,
            })),
          );

          return invoice;
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create invoice",
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(updateInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, items, ...invoiceData } = input;

        // Clean up empty strings to null for optional string fields only
        const cleanInvoiceData = {
          ...invoiceData,
          ...(invoiceData.businessId !== undefined
            ? {
                businessId:
                  invoiceData.businessId.trim() === ""
                    ? null
                    : invoiceData.businessId,
              }
            : {}),
          ...(invoiceData.notes !== undefined
            ? { notes: invoiceData.notes === "" ? null : invoiceData.notes }
            : {}),
        };

        // Verify invoice exists and belongs to user
        const existingInvoice = await ctx.db.query.invoices.findFirst({
          where: eq(invoices.id, id),
        });

        if (!existingInvoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        if (existingInvoice.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update this invoice",
          });
        }

        // If business is being updated, verify it belongs to user
        if (
          cleanInvoiceData.businessId &&
          cleanInvoiceData.businessId.trim() !== ""
        ) {
          const business = await ctx.db.query.businesses.findFirst({
            where: eq(businesses.id, cleanInvoiceData.businessId),
          });

          if (!business || business.createdById !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to use this business",
            });
          }
        }

        // If client is being updated, verify it belongs to user
        if (cleanInvoiceData.clientId) {
          const client = await ctx.db.query.clients.findFirst({
            where: eq(clients.id, cleanInvoiceData.clientId),
          });

          if (!client || client.createdById !== ctx.session.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to use this client",
            });
          }
        }

        await ctx.db.transaction(async (tx) => {
          if (items) {
            const totalAmount = calculateInvoiceTotal(
              items,
              cleanInvoiceData.taxRate ?? existingInvoice.taxRate,
            );

            const [updatedInvoice] = await tx
              .update(invoices)
              .set({
                ...cleanInvoiceData,
                totalAmount,
                updatedAt: new Date(),
              })
              .where(eq(invoices.id, id))
              .returning();

            if (!updatedInvoice) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update invoice",
              });
            }

            await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

            await tx.insert(invoiceItems).values(
              items.map((item, idx) => ({
                ...item,
                invoiceId: id,
                amount: item.hours * item.rate,
                position: idx,
              })),
            );
          } else {
            const [updatedInvoice] = await tx
              .update(invoices)
              .set({
                ...cleanInvoiceData,
                updatedAt: new Date(),
              })
              .where(eq(invoices.id, id))
              .returning();

            if (!updatedInvoice) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update invoice",
              });
            }
          }
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update invoice",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify invoice exists and belongs to user
        const invoice = await ctx.db.query.invoices.findFirst({
          where: eq(invoices.id, input.id),
        });

        if (!invoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        if (invoice.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this invoice",
          });
        }

        // Items will be deleted automatically due to cascade
        await ctx.db.delete(invoices).where(eq(invoices.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete invoice",
          cause: error,
        });
      }
    }),

  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.db.query.invoices.findFirst({
          where: eq(invoices.id, input.id),
        });

        if (!invoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        if (invoice.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update this invoice",
          });
        }

        await ctx.db
          .update(invoices)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(invoices.id, input.id));

        return {
          success: true,
          message: `Invoice status updated to ${input.status}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update invoice status",
          cause: error,
        });
      }
    }),

  bulkUpdateStatus: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1),
        status: z.enum(["draft", "sent", "paid"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Only update invoices owned by this user
      const owned = await ctx.db.query.invoices.findMany({
        where: inArray(invoices.id, input.ids),
        columns: { id: true, createdById: true },
      });

      const ownedIds = owned
        .filter((inv) => inv.createdById === ctx.session.user.id)
        .map((inv) => inv.id);

      if (ownedIds.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No matching invoices found",
        });
      }

      await ctx.db
        .update(invoices)
        .set({ status: input.status, updatedAt: new Date() })
        .where(inArray(invoices.id, ownedIds));

      return { success: true, updated: ownedIds.length };
    }),

  bulkDelete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const owned = await ctx.db.query.invoices.findMany({
        where: inArray(invoices.id, input.ids),
        columns: { id: true, createdById: true },
      });

      const ownedIds = owned
        .filter((inv) => inv.createdById === ctx.session.user.id)
        .map((inv) => inv.id);

      if (ownedIds.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No matching invoices found",
        });
      }

      await ctx.db.delete(invoices).where(inArray(invoices.id, ownedIds));

      return { success: true, deleted: ownedIds.length };
    }),
});
