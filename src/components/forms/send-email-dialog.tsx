"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { EmailComposer } from "./email-composer";
import { EmailPreview } from "./email-preview";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  Send,
  Loader2,
  Eye,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface SendEmailDialogProps {
  invoiceId: string;
  trigger: React.ReactNode;
  invoice?: {
    id: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    status: string;
    taxRate: number;
    client?: {
      name: string;
      email: string | null;
    };
    business?: {
      name: string;
      email: string | null;
    };
    items?: Array<{
      id: string;
      hours: number;
      rate: number;
    }>;
  };
  onEmailSent?: () => void;
}

export function SendEmailDialog({
  invoiceId,
  trigger,
  invoice,
  onEmailSent,
}: SendEmailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Email content state
  const [subject, setSubject] = useState(() =>
    invoice
      ? `Invoice ${invoice.invoiceNumber} from ${invoice.business?.name ?? "Your Business"}`
      : "Invoice from Your Business",
  );
  const [ccEmail, setCcEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const [emailContent, setEmailContent] = useState(() => {
    const getTimeOfDayGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date));
    };

    if (!invoice) return "";

    const businessName = invoice.business?.name ?? "Your Business";

    const issueDate = formatDate(invoice.issueDate);

    // Calculate total from items
    const subtotal =
      invoice.items?.reduce((sum, item) => sum + item.hours * item.rate, 0) ??
      0;
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;

    return `<p>${getTimeOfDayGreeting()},</p>

<p>I hope this email finds you well. Please find attached invoice <strong>${invoice.invoiceNumber}</strong> dated ${issueDate}.</p>

<p>The invoice details are as follows:</p>
<ul>
  <li><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</li>
  <li><strong>Issue Date:</strong> ${issueDate}</li>
  <li><strong>Amount Due:</strong> ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total)}</li>
</ul>

<p>Please let me know if you have any questions or need any clarification regarding this invoice. I appreciate your prompt attention to this matter.</p>

<p>Thank you for your business!</p>

<p>Best regards,<br><strong>${businessName}</strong></p>`;
  });

  // Get utils for cache invalidation
  const utils = api.useUtils();

  // Email sending mutation
  const sendEmailMutation = api.email.sendInvoice.useMutation({
    onSuccess: (data) => {
      toast.success("Email sent successfully!", {
        description: data.message,
        duration: 5000,
      });

      // Reset state and close dialog
      setIsOpen(false);
      setActiveTab("compose");
      setIsSending(false);
      setIsConfirming(false);

      // Refresh invoice data
      void utils.invoices.getById.invalidate({ id: invoiceId });

      // Callback for parent component
      onEmailSent?.();
    },
    onError: (error) => {
      console.error("Email send error:", error);

      let errorMessage = "Failed to send invoice email";
      let errorDescription = error.message;

      if (error.message.includes("Invalid recipient")) {
        errorMessage = "Invalid Email Address";
        errorDescription =
          "Please check the client's email address and try again.";
      } else if (error.message.includes("domain not verified")) {
        errorMessage = "Email Configuration Issue";
        errorDescription = "Please contact support to configure email sending.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too Many Emails";
        errorDescription = "Please wait a moment before sending another email.";
      } else if (error.message.includes("no email address")) {
        errorMessage = "No Email Address";
        errorDescription = "This client doesn't have an email address on file.";
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });

      setIsSending(false);
      setIsConfirming(false);
    },
  });

  const handleSendEmail = async () => {
    if (!invoice?.client?.email || invoice.client.email.trim() === "") {
      toast.error("No email address", {
        description: "This client doesn't have an email address on file.",
      });
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject required", {
        description: "Please enter an email subject before sending.",
      });
      return;
    }

    if (!emailContent.trim()) {
      toast.error("Message required", {
        description: "Please enter an email message before sending.",
      });
      return;
    }

    setIsSending(true);

    try {
      // Use the enhanced API with custom subject and content
      await sendEmailMutation.mutateAsync({
        invoiceId,
        customSubject: subject,
        customContent: emailContent,
        customMessage: customMessage.trim() || undefined,
        useHtml: true,
        ccEmails: ccEmail.trim() || undefined,
        bccEmails: bccEmail.trim() || undefined,
      });
    } catch (error) {
      // Error handling is done in the mutation's onError
      console.error("Send email error:", error);
    }
  };

  const handleConfirmSend = () => {
    setIsConfirming(true);
    setActiveTab("confirm");
  };

  const fromEmail = invoice?.business?.email ?? "noreply@yourdomain.com";
  const toEmail = invoice?.client?.email ?? "";

  const canSend =
    !isSending &&
    subject.trim() &&
    emailContent.trim() &&
    toEmail &&
    toEmail.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="text-primary h-5 w-5" />
            Send Invoice Email
          </DialogTitle>
          <DialogDescription>
            Compose and preview your invoice email before sending to{" "}
            {invoice?.client?.name ?? "client"}.
          </DialogDescription>
        </DialogHeader>

        {/* Warning for missing email */}
        {(!toEmail || toEmail.trim() === "") && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This client doesn&apos;t have an email address. Please add an
              email address to the client before sending the invoice.
            </AlertDescription>
          </Alert>
        )}

        {/* Branded Template Info */}
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Professional Email Template:</strong> Your email will be
            sent using a beautifully designed, beenvoice-branded template with
            proper fonts and styling. Any custom content you add will be
            incorporated into the professional template automatically.
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="min-h-0 flex-1"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="confirm"
              className="flex items-center gap-2"
              disabled={!isConfirming}
            >
              <CheckCircle className="h-4 w-4" />
              Confirm
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="compose"
              className="mt-4 h-full overflow-y-auto"
            >
              <EmailComposer
                subject={subject}
                onSubjectChange={setSubject}
                content={emailContent}
                onContentChange={setEmailContent}
                customMessage={customMessage}
                onCustomMessageChange={setCustomMessage}
                fromEmail={fromEmail}
                toEmail={toEmail}
                ccEmail={ccEmail}
                onCcEmailChange={setCcEmail}
                bccEmail={bccEmail}
                onBccEmailChange={setBccEmail}
              />
            </TabsContent>

            <TabsContent
              value="preview"
              className="mt-4 h-full overflow-y-auto"
            >
              <EmailPreview
                subject={subject}
                fromEmail={fromEmail}
                toEmail={toEmail}
                ccEmail={ccEmail}
                bccEmail={bccEmail}
                content={emailContent}
                customMessage={customMessage}
                invoice={invoice}
                className="pr-2"
              />
            </TabsContent>

            <TabsContent
              value="confirm"
              className="mt-4 h-full overflow-y-auto"
            >
              <div className="space-y-6 pr-2">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You&apos;re about to send this email to{" "}
                    <strong>{toEmail}</strong>. The invoice PDF will be
                    automatically attached.
                  </AlertDescription>
                </Alert>

                <EmailPreview
                  subject={subject}
                  fromEmail={fromEmail}
                  toEmail={toEmail}
                  content={emailContent}
                  customMessage={customMessage}
                  invoice={invoice}
                />

                {invoice?.status === "draft" && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This invoice is currently in <strong>draft</strong>{" "}
                      status. Sending it will automatically change the status to{" "}
                      <strong>sent</strong>.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === "compose" && (
              <Button
                variant="outline"
                onClick={() => setActiveTab("preview")}
                disabled={isSending}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}

            {activeTab === "preview" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("compose")}
                  disabled={isSending}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleConfirmSend}
                  disabled={!canSend}
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review & Send
                </Button>
              </>
            )}

            {activeTab === "confirm" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={isSending}
                >
                  Back to Preview
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={!canSend || isSending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
