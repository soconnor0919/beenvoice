import { z } from "zod";
import { Resend } from "resend";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { invoices } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { generateInvoicePDFBlob } from "~/lib/pdf-export";
import { generateInvoiceEmailTemplate } from "~/lib/email-templates";

// Default Resend instance - will be overridden if business has custom API key
const defaultResend = new Resend(env.RESEND_API_KEY);

export const emailRouter = createTRPCRouter({
  sendInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        customSubject: z.string().optional(),
        customContent: z.string().optional(),
        customMessage: z.string().optional(),
        useHtml: z.boolean().default(false),
        ccEmails: z.string().optional(),
        bccEmails: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch invoice with relations
      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.invoiceId),
        with: {
          client: true,
          business: true,
          items: true,
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      // Check if invoice belongs to the current user
      if (invoice.createdById !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      if (!invoice.client?.email) {
        throw new Error("Client has no email address");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(invoice.client.email)) {
        throw new Error("Invalid client email address format");
      }

      // Generate PDF for attachment
      let pdfBuffer: Buffer;
      try {
        const pdfBlob = await generateInvoicePDFBlob(invoice);
        pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Validate PDF was generated successfully
        if (pdfBuffer.length === 0) {
          throw new Error("Generated PDF is empty");
        }
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        // Re-throw the original error with more context
        if (pdfError instanceof Error) {
          throw new Error(
            `Failed to generate invoice PDF for attachment: ${pdfError.message}`,
          );
        }
        throw new Error("Failed to generate invoice PDF for attachment");
      }

      // Create email content
      const subject =
        input.customSubject ??
        `Invoice ${invoice.invoiceNumber} from ${invoice.business?.name ?? "Your Business"}`;

      const userName =
        invoice.business?.emailFromName ??
        invoice.business?.name ??
        ctx.session.user?.name ??
        "Your Name";
      const userEmail =
        invoice.business?.email ?? ctx.session.user?.email ?? "";

      // Generate branded email template
      const emailTemplate = generateInvoiceEmailTemplate({
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          totalAmount: invoice.totalAmount,
          taxRate: invoice.taxRate,
          notes: invoice.notes,
          client: {
            name: invoice.client.name,
            email: invoice.client.email,
          },
          business: invoice.business,
          items: invoice.items,
        },
        customContent: input.customContent,
        customMessage: input.customMessage,
        userName,
        userEmail,
        baseUrl: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NODE_ENV === "production"
            ? "https://beenvoice.app"
            : "http://localhost:3000",
      });

      // Determine Resend instance and email configuration to use
      let resendInstance: Resend;
      let fromEmail: string;

      // Check if business has custom Resend configuration
      if (invoice.business?.resendApiKey && invoice.business?.resendDomain) {
        // Use business's custom Resend setup
        resendInstance = new Resend(invoice.business.resendApiKey);
        const fromName =
          invoice.business.emailFromName ?? invoice.business.name ?? userName;
        fromEmail = `${fromName} <noreply@${invoice.business.resendDomain}>`;
      } else if (env.RESEND_DOMAIN) {
        // Use system Resend configuration
        resendInstance = defaultResend;
        fromEmail = `noreply@${env.RESEND_DOMAIN}`;
      } else {
        // Fallback to business email if no configured domains
        resendInstance = defaultResend;
        fromEmail = invoice.business?.email ?? "noreply@yourdomain.com";
      }

      // Prepare CC and BCC lists
      const ccEmails: string[] = [];
      const bccEmails: string[] = [];

      // Parse CC emails from input
      if (input.ccEmails) {
        const ccList = input.ccEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
        for (const email of ccList) {
          if (emailRegex.test(email)) {
            ccEmails.push(email);
          }
        }
      }

      // Parse BCC emails from input
      if (input.bccEmails) {
        const bccList = input.bccEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
        for (const email of bccList) {
          if (emailRegex.test(email)) {
            bccEmails.push(email);
          }
        }
      }

      // Include business email in CC if it exists and is different from sender
      if (invoice.business?.email && invoice.business.email !== fromEmail) {
        // Validate business email format before adding to CC
        if (emailRegex.test(invoice.business.email)) {
          ccEmails.push(invoice.business.email);
        }
      }

      // Send email with Resend
      let emailResult;
      try {
        // Send HTML email with plain text fallback
        emailResult = await resendInstance.emails.send({
          from: fromEmail,
          to: [invoice.client?.email ?? ""],
          cc: ccEmails.length > 0 ? ccEmails : undefined,
          bcc: bccEmails.length > 0 ? bccEmails : undefined,
          subject: subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          headers: {
            "X-Priority": "3",
            "X-MSMail-Priority": "Normal",
            "X-Mailer": "beenvoice",
            "MIME-Version": "1.0",
          },
          attachments: [
            {
              filename: `invoice-${invoice.invoiceNumber}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch {
        throw new Error(
          "Email service is currently unavailable. Please try again later.",
        );
      }

      // Enhanced error checking
      if (emailResult.error) {
        const errorMsg = emailResult.error.message?.toLowerCase() ?? "";

        // Provide more specific error messages based on error type
        if (
          errorMsg.includes("invalid email") ||
          errorMsg.includes("invalid recipient")
        ) {
          throw new Error("Invalid recipient email address");
        } else if (
          errorMsg.includes("domain") ||
          errorMsg.includes("not verified")
        ) {
          throw new Error(
            "Email domain not verified. Please configure your Resend domain in business settings.",
          );
        } else if (
          errorMsg.includes("rate limit") ||
          errorMsg.includes("too many")
        ) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (
          errorMsg.includes("api key") ||
          errorMsg.includes("unauthorized")
        ) {
          throw new Error(
            "Email service configuration error. Please check your Resend API key.",
          );
        } else if (
          errorMsg.includes("attachment") ||
          errorMsg.includes("file size")
        ) {
          throw new Error("Invoice PDF is too large to send via email.");
        } else {
          throw new Error(
            `Email delivery failed: ${emailResult.error.message ?? "Unknown error"}`,
          );
        }
      }

      if (!emailResult.data?.id) {
        throw new Error(
          "Email was not sent successfully - no delivery ID received",
        );
      }

      // Update invoice status to "sent" if it was draft
      if (invoice.status === "draft") {
        try {
          await ctx.db
            .update(invoices)
            .set({
              status: "sent",
              updatedAt: new Date(),
            })
            .where(eq(invoices.id, input.invoiceId));
        } catch {
          // Don't throw here - email was sent successfully, status update is secondary
        }
      }

      return {
        success: true,
        emailId: emailResult.data.id,
        message: `Invoice sent successfully to ${invoice.client?.email ?? "client"}${ccEmails.length > 0 ? ` (CC: ${ccEmails.join(", ")})` : ""}${bccEmails.length > 0 ? ` (BCC: ${bccEmails.join(", ")})` : ""}`,
        deliveryDetails: {
          to: invoice.client?.email ?? "",
          cc: ccEmails,
          bcc: bccEmails,
          sentAt: new Date().toISOString(),
        },
      };
    }),
});
