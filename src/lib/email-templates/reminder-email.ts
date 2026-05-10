interface ReminderEmailTemplateProps {
  invoice: {
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    currency?: string | null;
    client: { name: string; email: string | null };
    business?: {
      name: string;
      nickname?: string | null;
      email?: string | null;
    } | null;
  };
  customMessage?: string;
  userName?: string;
  userEmail?: string;
}

export function generateReminderEmailTemplate({
  invoice,
  customMessage,
  userName,
  userEmail,
}: ReminderEmailTemplateProps): { html: string; text: string; subject: string } {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
      new Date(date),
    );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency ?? "USD",
    }).format(amount);

  const senderName =
    invoice.business?.name
      ? invoice.business.nickname
        ? `${invoice.business.name} (${invoice.business.nickname})`
        : invoice.business.name
      : userName ?? "Your service provider";

  const isOverdue = new Date(invoice.dueDate) < new Date();

  const subject = `Payment Reminder: Invoice ${invoice.invoiceNumber} — ${formatCurrency(invoice.totalAmount)}`;

  const defaultMessage = isOverdue
    ? `This is a friendly reminder that Invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.totalAmount)} was due on ${formatDate(invoice.dueDate)} and remains outstanding. Please arrange payment at your earliest convenience.`
    : `This is a friendly reminder that Invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.totalAmount)} is due on ${formatDate(invoice.dueDate)}. Please ensure payment is arranged before the due date.`;

  const bodyMessage = customMessage ?? defaultMessage;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <!-- Header -->
        <tr><td style="background:#111827;padding:24px 32px;">
          <p style="margin:0;color:#f9fafb;font-size:20px;font-weight:700;">${senderName}</p>
          ${userEmail ? `<p style="margin:4px 0 0;color:#9ca3af;font-size:13px;">${userEmail}</p>` : ""}
        </td></tr>
        <!-- Badge -->
        <tr><td style="padding:24px 32px 0;">
          <span style="display:inline-block;background:${isOverdue ? "#fef2f2" : "#fffbeb"};color:${isOverdue ? "#dc2626" : "#d97706"};border:1px solid ${isOverdue ? "#fecaca" : "#fde68a"};border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;">
            ${isOverdue ? "OVERDUE" : "PAYMENT DUE"}
          </span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 16px;color:#374151;font-size:15px;">Dear ${invoice.client.name},</p>
          <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">${bodyMessage}</p>

          <!-- Invoice details box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Invoice number</td>
                  <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;padding:4px 0;">${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Issue date</td>
                  <td style="color:#111827;font-size:13px;text-align:right;padding:4px 0;">${formatDate(invoice.issueDate)}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Due date</td>
                  <td style="color:${isOverdue ? "#dc2626" : "#111827"};font-size:13px;font-weight:${isOverdue ? "600" : "400"};text-align:right;padding:4px 0;">${formatDate(invoice.dueDate)}</td>
                </tr>
                <tr><td colspan="2" style="border-top:1px solid #e5e7eb;padding:8px 0 0;"></td></tr>
                <tr>
                  <td style="color:#111827;font-size:15px;font-weight:700;padding:4px 0;">Amount due</td>
                  <td style="color:#111827;font-size:15px;font-weight:700;text-align:right;padding:4px 0;">${formatCurrency(invoice.totalAmount)}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <p style="margin:0;color:#6b7280;font-size:13px;">If you have already made payment, please disregard this notice. Thank you for your business.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Sent by ${senderName} · Powered by beenvoice</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Payment Reminder from ${senderName}

Dear ${invoice.client.name},

${bodyMessage}

Invoice: ${invoice.invoiceNumber}
Issue date: ${formatDate(invoice.issueDate)}
Due date: ${formatDate(invoice.dueDate)}
Amount due: ${formatCurrency(invoice.totalAmount)}

If you have already made payment, please disregard this notice.
Thank you for your business.

— ${senderName}`;

  return { html, text, subject };
}
