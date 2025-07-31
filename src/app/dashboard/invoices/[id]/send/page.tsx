"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { PageHeader } from "~/components/layout/page-header";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { EmailComposer } from "~/components/forms/email-composer";
import { EmailPreview } from "~/components/forms/email-preview";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Mail,
  Send,
  Eye,
  Edit3,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";

function SendEmailPageSkeleton() {
  return (
    <div className="space-y-6 pb-32">
      <PageHeader
        title="Loading..."
        description="Loading invoice email"
        variant="gradient"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-muted h-96 animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="bg-muted h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function SendEmailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  // State management
  const [activeTab, setActiveTab] = useState("compose");
  const [isSending, setIsSending] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Email content state
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  // Fetch invoice data
  const { data: invoiceData, isLoading: invoiceLoading } =
    api.invoices.getById.useQuery({
      id: invoiceId,
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

      // Navigate back to invoice view
      router.push(`/dashboard/invoices/${invoiceId}`);

      // Refresh invoice data
      void utils.invoices.getById.invalidate({ id: invoiceId });
    },
    onError: (error) => {
      let errorMessage = "Failed to send invoice email";
      let errorDescription = error.message;
      let canRetry = false;

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
        canRetry = true;
      } else if (error.message.includes("no email address")) {
        errorMessage = "No Email Address";
        errorDescription = "This client doesn't have an email address on file.";
      } else if (
        error.message.includes("unavailable") ||
        error.message.includes("timeout")
      ) {
        errorMessage = "Service Temporarily Unavailable";
        errorDescription =
          "The email service is temporarily unavailable. Please try again.";
        canRetry = true;
      } else {
        canRetry = true; // Allow retry for unknown errors
      }

      toast.error(errorMessage, {
        description:
          canRetry && retryCount < 2
            ? `${errorDescription} You can retry this operation.`
            : errorDescription,
        duration: 6000,
        action:
          canRetry && retryCount < 2
            ? {
                label: "Retry",
                onClick: () => handleRetry(),
              }
            : undefined,
      });

      setIsSending(false);
    },
  });

  // Transform invoice data for components
  const invoice = useMemo(() => {
    return invoiceData
      ? {
          id: invoiceData.id,
          invoiceNumber: invoiceData.invoiceNumber,
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          status: invoiceData.status,
          taxRate: invoiceData.taxRate,
          client: invoiceData.client
            ? {
                name: invoiceData.client.name,
                email: invoiceData.client.email,
              }
            : undefined,
          business: invoiceData.business
            ? {
                name: invoiceData.business.name,
                email: invoiceData.business.email,
              }
            : undefined,
          items: invoiceData.items?.map((item) => ({
            id: item.id,
            hours: item.hours,
            rate: item.rate,
          })),
        }
      : undefined;
  }, [invoiceData]);

  // Initialize email content when invoice loads
  useEffect(() => {
    if (!invoice || isInitialized) return;

    // Set default subject
    const defaultSubject = `Invoice ${invoice.invoiceNumber} from ${invoice.business?.name ?? "Your Business"}`;
    setSubject(defaultSubject);

    // Set default content (empty since template handles everything)
    const defaultContent = ``;

    setEmailContent(defaultContent);
    setIsInitialized(true);
  }, [invoice, isInitialized]);

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

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmSendEmail = async () => {
    setShowConfirmDialog(false);
    setIsSending(true);

    try {
      await sendEmailMutation.mutateAsync({
        invoiceId,
        customSubject: subject,
        customContent: emailContent,
        customMessage: customMessage?.trim() || undefined,
        useHtml: true,
        ccEmails: ccEmail.trim() || undefined,
        bccEmails: bccEmail.trim() || undefined,
      });
      setRetryCount(0); // Reset retry count on success
    } catch {
      // Error handling is done in the mutation's onError
    }
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1);
      void confirmSendEmail();
    }
  };

  const fromEmail = invoice?.business?.email ?? "noreply@yourdomain.com";
  const toEmail = invoice?.client?.email ?? "";

  const canSend =
    !isSending && subject.trim() && toEmail && toEmail.trim() !== "";

  if (invoiceLoading) {
    return <SendEmailPageSkeleton />;
  }

  if (!invoice) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Invoice not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 pb-32">
      <PageHeader
        title={`Send Invoice ${invoice.invoiceNumber}`}
        description={`Compose and send invoice email to ${invoice.client?.name ?? "client"} • ${new Intl.DateTimeFormat(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        ).format(new Date())}`}
        variant="gradient"
      >
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/invoices/${invoiceId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoice
        </Button>
      </PageHeader>

      {/* Warning for missing email */}
      {(!toEmail || toEmail.trim() === "") && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This client doesn&apos;t have an email address. Please add an email
            address to the client before sending the invoice.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Compose
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="compose" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Compose Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isInitialized ? (
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
                    ) : (
                      <div className="bg-muted flex h-[400px] items-center justify-center border">
                        <div className="text-center">
                          <div className="border-primary mx-auto mb-2 h-4 w-4 animate-spin border-2 border-t-transparent"></div>
                          <p className="text-muted-foreground text-sm">
                            Initializing email content...
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Email Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <EmailPreview
                        subject={subject}
                        fromEmail={fromEmail}
                        toEmail={toEmail}
                        ccEmail={ccEmail}
                        bccEmail={bccEmail}
                        content={emailContent}
                        customMessage={customMessage}
                        invoice={invoice}
                        className="min-w-0 border-0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="text-primary h-5 w-5" />
                Invoice #{invoice.invoiceNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Client
                </Label>
                <p className="text-sm font-medium">
                  {invoice.client?.name ?? "Client"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Issue Date
                </Label>
                <p className="text-sm">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(invoice.issueDate))}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Status
                </Label>
                <Badge variant="outline">{invoice.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  From
                </Label>
                <p className="font-mono text-sm break-all">{fromEmail}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  To
                </Label>
                <p className="font-mono text-sm break-all">
                  {toEmail || "No email address"}
                </p>
              </div>
              {ccEmail && (
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    CC
                  </Label>
                  <p className="font-mono text-sm break-all">{ccEmail}</p>
                </div>
              )}
              {bccEmail && (
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    BCC
                  </Label>
                  <p className="font-mono text-sm break-all">{bccEmail}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Subject
                </Label>
                <p className="text-sm break-words">{subject || "No subject"}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Attachment
                </Label>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-3 w-3" />
                  <span>invoice-{invoice.invoiceNumber}.pdf</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTab === "compose" && (
                <Button
                  onClick={() => setActiveTab("preview")}
                  disabled={!subject.trim()}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Email
                </Button>
              )}

              {activeTab === "preview" && (
                <Button
                  onClick={() => setActiveTab("compose")}
                  variant="outline"
                  className="w-full"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Email
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        leftContent={
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2">
              <Send className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Send Invoice</p>
              <p className="text-muted-foreground text-sm">
                Email invoice to {invoice.client?.name ?? "client"}
              </p>
            </div>
          </div>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/invoices/${invoiceId}`)}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSendEmail}
          disabled={!canSend || isSending}
          variant="default"
          size="sm"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
              <span className="hidden sm:inline">Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Send Email</span>
            </>
          )}
        </Button>
      </FloatingActionBar>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice Email?</DialogTitle>
            <DialogDescription>
              This will send invoice #{invoice.invoiceNumber} to{" "}
              <strong>{invoice.client?.email}</strong>
              {ccEmail && (
                <>
                  {" "}
                  with CC to <strong>{ccEmail}</strong>
                </>
              )}
              {bccEmail && (
                <>
                  {" "}
                  and BCC to <strong>{bccEmail}</strong>
                </>
              )}
              .
              {retryCount > 0 && (
                <div className="text-muted-foreground mt-2 text-sm">
                  Retry attempt {retryCount} of 2
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSendEmail} variant="default">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
