import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { businesses } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { invoices } from "~/server/db/schema";
import { sql } from "drizzle-orm";

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  addressLine1: z.string().optional().or(z.literal("")),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

export const businessesRouter = createTRPCRouter({
  // Get all businesses for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userBusinesses = await ctx.db
      .select()
      .from(businesses)
      .where(eq(businesses.createdById, ctx.session.user.id))
      .orderBy(desc(businesses.isDefault), desc(businesses.createdAt));

    return userBusinesses;
  }),

  // Get a single business by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id)
          )
        )
        .limit(1);

      return business[0];
    }),

  // Get default business for the current user
  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const defaultBusiness = await ctx.db
      .select()
      .from(businesses)
      .where(
        and(
          eq(businesses.createdById, ctx.session.user.id),
          eq(businesses.isDefault, true)
        )
      )
      .limit(1);

    return defaultBusiness[0];
  }),

  // Create a new business
  create: protectedProcedure
    .input(businessSchema)
    .mutation(async ({ ctx, input }) => {
      // If this is the first business or isDefault is true, unset other defaults
      if (input.isDefault) {
        await ctx.db
          .update(businesses)
          .set({ isDefault: false })
          .where(eq(businesses.createdById, ctx.session.user.id));
      }

      const [newBusiness] = await ctx.db
        .insert(businesses)
        .values({
          ...input,
          createdById: ctx.session.user.id,
        })
        .returning();

      return newBusiness;
    }),

  // Update an existing business
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ...businessSchema.shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // If setting this business as default, unset other defaults
      if (updateData.isDefault) {
        await ctx.db
          .update(businesses)
          .set({ isDefault: false })
          .where(
            and(
              eq(businesses.createdById, ctx.session.user.id),
              eq(businesses.id, id)
            )
          );
      }

      const [updatedBusiness] = await ctx.db
        .update(businesses)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(businesses.id, id),
            eq(businesses.createdById, ctx.session.user.id)
          )
        )
        .returning();

      if (!updatedBusiness) {
        throw new Error("Business not found or you don't have permission to update it");
      }

      return updatedBusiness;
    }),

  // Delete a business
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if business exists and belongs to user
      const business = await ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id)
          )
        )
        .limit(1);

      if (!business[0]) {
        throw new Error("Business not found or you don't have permission to delete it");
      }

      // Check if this business has any invoices
      const invoiceCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(eq(invoices.businessId, input.id));

      if (invoiceCount[0] && invoiceCount[0].count > 0) {
        throw new Error("Cannot delete business that has invoices. Please delete all invoices first.");
      }

      await ctx.db
        .delete(businesses)
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id)
          )
        );

      return { success: true };
    }),

  // Set a business as default
  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First, unset all other defaults for this user
      await ctx.db
        .update(businesses)
        .set({ isDefault: false })
        .where(eq(businesses.createdById, ctx.session.user.id));

      // Then set the specified business as default
      const [updatedBusiness] = await ctx.db
        .update(businesses)
        .set({ isDefault: true })
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id)
          )
        )
        .returning();

      if (!updatedBusiness) {
        throw new Error("Business not found or you don't have permission to update it");
      }

      return updatedBusiness;
    }),
}); 