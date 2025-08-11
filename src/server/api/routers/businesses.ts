import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { businesses } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { invoices } from "~/server/db/schema";
import { sql } from "drizzle-orm";

const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(255, "Business name must be 255 characters or less"),
  nickname: z
    .string()
    .trim()
    .max(255, "Nickname must be 255 characters or less")
    .optional()
    .or(z.literal("")),
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

const emailConfigSchema = z.object({
  resendApiKey: z
    .string()
    .min(1, "Resend API Key is required")
    .optional()
    .or(z.literal("")),
  resendDomain: z
    .string()
    .min(1, "Resend Domain is required")
    .optional()
    .or(z.literal("")),
  emailFromName: z.string().optional().or(z.literal("")),
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
            eq(businesses.createdById, ctx.session.user.id),
          ),
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
          eq(businesses.isDefault, true),
        ),
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
          name: input.name.trim(),
          nickname:
            input.nickname && input.nickname.trim() !== ""
              ? input.nickname.trim()
              : null,
          email:
            input.email && input.email.trim() !== ""
              ? input.email.trim()
              : null,
          phone:
            input.phone && input.phone.trim() !== ""
              ? input.phone.trim()
              : null,
          addressLine1:
            input.addressLine1 && input.addressLine1.trim() !== ""
              ? input.addressLine1.trim()
              : null,
          addressLine2:
            input.addressLine2 && input.addressLine2.trim() !== ""
              ? input.addressLine2.trim()
              : null,
          city:
            input.city && input.city.trim() !== "" ? input.city.trim() : null,
          state:
            input.state && input.state.trim() !== ""
              ? input.state.trim()
              : null,
          postalCode:
            input.postalCode && input.postalCode.trim() !== ""
              ? input.postalCode.trim()
              : null,
          country:
            input.country && input.country.trim() !== ""
              ? input.country.trim()
              : null,
          website:
            input.website && input.website.trim() !== ""
              ? input.website.trim()
              : null,
          taxId:
            input.taxId && input.taxId.trim() !== ""
              ? input.taxId.trim()
              : null,
          logoUrl:
            input.logoUrl && input.logoUrl.trim() !== ""
              ? input.logoUrl.trim()
              : null,
          isDefault: input.isDefault ?? false,
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // If setting this business as default, unset other defaults
      if (updateData.isDefault) {
        await ctx.db
          .update(businesses)
          .set({ isDefault: false })
          .where(eq(businesses.createdById, ctx.session.user.id));
      }

      const [updatedBusiness] = await ctx.db
        .update(businesses)
        .set({
          name: (updateData.name ?? "").trim(),
          nickname:
            updateData.nickname && updateData.nickname.trim() !== ""
              ? updateData.nickname.trim()
              : null,
          email:
            updateData.email && updateData.email.trim() !== ""
              ? updateData.email.trim()
              : null,
          phone:
            updateData.phone && updateData.phone.trim() !== ""
              ? updateData.phone.trim()
              : null,
          addressLine1:
            updateData.addressLine1 && updateData.addressLine1.trim() !== ""
              ? updateData.addressLine1.trim()
              : null,
          addressLine2:
            updateData.addressLine2 && updateData.addressLine2.trim() !== ""
              ? updateData.addressLine2.trim()
              : null,
          city:
            updateData.city && updateData.city.trim() !== ""
              ? updateData.city.trim()
              : null,
          state:
            updateData.state && updateData.state.trim() !== ""
              ? updateData.state.trim()
              : null,
          postalCode:
            updateData.postalCode && updateData.postalCode.trim() !== ""
              ? updateData.postalCode.trim()
              : null,
          country:
            updateData.country && updateData.country.trim() !== ""
              ? updateData.country.trim()
              : null,
          website:
            updateData.website && updateData.website.trim() !== ""
              ? updateData.website.trim()
              : null,
          taxId:
            updateData.taxId && updateData.taxId.trim() !== ""
              ? updateData.taxId.trim()
              : null,
          logoUrl:
            updateData.logoUrl && updateData.logoUrl.trim() !== ""
              ? updateData.logoUrl.trim()
              : null,
          isDefault: updateData.isDefault ?? false,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(businesses.id, id),
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .returning();

      if (!updatedBusiness) {
        throw new Error(
          "Business not found or you don't have permission to update it",
        );
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
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!business[0]) {
        throw new Error(
          "Business not found or you don't have permission to delete it",
        );
      }

      // Check if this business has any invoices
      const invoiceCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(eq(invoices.businessId, input.id));

      if (invoiceCount[0] && invoiceCount[0].count > 0) {
        throw new Error(
          "Cannot delete business that has invoices. Please delete all invoices first.",
        );
      }

      await ctx.db
        .delete(businesses)
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id),
          ),
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
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .returning();

      if (!updatedBusiness) {
        throw new Error(
          "Business not found or you don't have permission to update it",
        );
      }

      return updatedBusiness;
    }),

  // Update email configuration for a business
  updateEmailConfig: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ...emailConfigSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...emailConfig } = input;

      // Validate that business belongs to user
      const business = await ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            eq(businesses.id, id),
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!business[0]) {
        throw new Error(
          "Business not found or you don't have permission to update it",
        );
      }

      // Update email configuration
      const [updatedBusiness] = await ctx.db
        .update(businesses)
        .set({
          resendApiKey: emailConfig.resendApiKey ?? null,
          resendDomain: emailConfig.resendDomain ?? null,
          emailFromName: emailConfig.emailFromName ?? null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(businesses.id, id),
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .returning();

      if (!updatedBusiness) {
        throw new Error("Failed to update email configuration");
      }

      return {
        success: true,
        message: "Email configuration updated successfully",
      };
    }),

  // Get email configuration for a business (without exposing the API key)
  getEmailConfig: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db
        .select({
          id: businesses.id,
          name: businesses.name,
          resendDomain: businesses.resendDomain,
          emailFromName: businesses.emailFromName,
          hasApiKey: businesses.resendApiKey,
        })
        .from(businesses)
        .where(
          and(
            eq(businesses.id, input.id),
            eq(businesses.createdById, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!business[0]) {
        throw new Error(
          "Business not found or you don't have permission to view it",
        );
      }

      return {
        ...business[0],
        hasApiKey: !!business[0].hasApiKey,
      };
    }),
});
