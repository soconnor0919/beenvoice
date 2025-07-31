import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clients, invoices } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .max(50, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  addressLine1: z
    .string()
    .max(255, "Address is too long")
    .optional()
    .or(z.literal("")),
  addressLine2: z
    .string()
    .max(255, "Address is too long")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "City name is too long")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(50, "State name is too long")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .max(20, "Postal code is too long")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .max(100, "Country name is too long")
    .optional()
    .or(z.literal("")),
  defaultHourlyRate: z.number().min(0, "Rate must be positive").optional(),
});

const updateClientSchema = createClientSchema.partial().extend({
  id: z.string(),
});

export const clientsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.clients.findMany({
        where: eq(clients.createdById, ctx.session.user.id),
        orderBy: (clients, { desc }) => [desc(clients.createdAt)],
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch clients",
        cause: error,
      });
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const client = await ctx.db.query.clients.findFirst({
          where: eq(clients.id, input.id),
          with: {
            invoices: {
              orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
            },
          },
        });

        if (!client) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        }

        // Check if user owns this client
        if (client.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this client",
          });
        }

        return client;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch client",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Clean up empty strings to null, but preserve required fields
        const cleanInput = Object.fromEntries(
          Object.entries(input).map(([key, value]) => [
            key,
            value === "" ? null : value,
          ]),
        );

        const [client] = await ctx.db
          .insert(clients)
          .values({
            name: input.name, // Ensure name is included
            ...cleanInput,
            createdById: ctx.session.user.id,
          })
          .returning();

        if (!client) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create client",
          });
        }

        return client;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create client",
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(updateClientSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;

        // Verify client exists and belongs to user
        const existingClient = await ctx.db.query.clients.findFirst({
          where: eq(clients.id, id),
        });

        if (!existingClient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        }

        if (existingClient.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update this client",
          });
        }

        // Clean up empty strings to null
        const cleanData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            value === "" ? null : value,
          ]),
        );

        const [updatedClient] = await ctx.db
          .update(clients)
          .set({
            ...cleanData,
            updatedAt: new Date(),
          })
          .where(eq(clients.id, id))
          .returning();

        if (!updatedClient) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update client",
          });
        }

        return updatedClient;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update client",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify client exists and belongs to user
        const client = await ctx.db.query.clients.findFirst({
          where: eq(clients.id, input.id),
        });

        if (!client) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        }

        if (client.createdById !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this client",
          });
        }

        // Check if client has invoices
        const clientInvoices = await ctx.db.query.invoices.findMany({
          where: eq(invoices.clientId, input.id),
        });

        if (clientInvoices.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Cannot delete client with existing invoices. Please delete or reassign the invoices first.",
          });
        }

        await ctx.db.delete(clients).where(eq(clients.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete client",
          cause: error,
        });
      }
    }),
});
