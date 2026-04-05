import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { invoiceTemplates } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  type: z.enum(["notes", "terms"]).default("notes"),
  content: z.string().min(1, "Content is required"),
  isDefault: z.boolean().default(false),
});

const updateTemplateSchema = createTemplateSchema.partial().extend({
  id: z.string(),
});

export const invoiceTemplatesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.invoiceTemplates.findMany({
      where: eq(invoiceTemplates.createdById, ctx.session.user.id),
      orderBy: (t, { asc }) => [asc(t.type), asc(t.name)],
    });
  }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(["notes", "terms"]) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.invoiceTemplates.findMany({
        where: and(
          eq(invoiceTemplates.createdById, ctx.session.user.id),
          eq(invoiceTemplates.type, input.type),
        ),
        orderBy: (t, { asc }) => [asc(t.name)],
      });
    }),

  create: protectedProcedure
    .input(createTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      // If setting as default, unset others of same type
      if (input.isDefault) {
        await ctx.db
          .update(invoiceTemplates)
          .set({ isDefault: false })
          .where(
            and(
              eq(invoiceTemplates.createdById, ctx.session.user.id),
              eq(invoiceTemplates.type, input.type),
            ),
          );
      }

      const [template] = await ctx.db
        .insert(invoiceTemplates)
        .values({ ...input, createdById: ctx.session.user.id })
        .returning();

      return template;
    }),

  update: protectedProcedure
    .input(updateTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.query.invoiceTemplates.findFirst({
        where: and(
          eq(invoiceTemplates.id, id),
          eq(invoiceTemplates.createdById, ctx.session.user.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Template not found" });
      }

      // If setting as default, unset others of same type
      if (data.isDefault) {
        const type = data.type ?? existing.type;
        await ctx.db
          .update(invoiceTemplates)
          .set({ isDefault: false })
          .where(
            and(
              eq(invoiceTemplates.createdById, ctx.session.user.id),
              eq(invoiceTemplates.type, type),
            ),
          );
      }

      await ctx.db
        .update(invoiceTemplates)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(invoiceTemplates.id, id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.invoiceTemplates.findFirst({
        where: and(
          eq(invoiceTemplates.id, input.id),
          eq(invoiceTemplates.createdById, ctx.session.user.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Template not found" });
      }

      await ctx.db
        .delete(invoiceTemplates)
        .where(eq(invoiceTemplates.id, input.id));

      return { success: true };
    }),
});
