import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  notes?: string | null;
  client?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  items?: Array<{
    date: Date;
    description: string;
    hours: number;
    rate: number;
    amount: number;
  }> | null;
}

export async function generateInvoicePDF(invoice: InvoiceData): Promise<void> {
  // Create a temporary div to render the invoice
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.4';
  tempDiv.style.color = '#333';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statusColors = {
    draft: '#6B7280',
    sent: '#3B82F6',
    paid: '#10B981',
    overdue: '#EF4444',
  };

  const statusLabels = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
  };

  tempDiv.innerHTML = `
    <div style="max-width: 720px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #10B981; padding-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #10B981;">beenvoice</h1>
          <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Professional Invoicing</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 24px; color: #1F2937;">INVOICE</h2>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #10B981;">${invoice.invoiceNumber}</p>
          <div style="margin-top: 10px; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background-color: ${statusColors[invoice.status as keyof typeof statusColors] || '#6B7280'}; color: white;">
            ${statusLabels[invoice.status as keyof typeof statusLabels] || invoice.status}
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Bill To:</h3>
          <div style="font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 16px;">${invoice.client?.name || 'N/A'}</p>
            ${invoice.client?.email ? `<p style="margin: 0 0 5px 0;">${invoice.client.email}</p>` : ''}
            ${invoice.client?.phone ? `<p style="margin: 0 0 5px 0;">${invoice.client.phone}</p>` : ''}
            ${invoice.client?.addressLine1 || invoice.client?.city || invoice.client?.state ? `
              <p style="margin: 0 0 5px 0;">
                ${[
                  invoice.client?.addressLine1,
                  invoice.client?.addressLine2,
                  invoice.client?.city,
                  invoice.client?.state,
                  invoice.client?.postalCode,
                ].filter(Boolean).join(', ')}
              </p>
            ` : ''}
          </div>
        </div>
        <div style="flex: 1; text-align: right;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Invoice Details:</h3>
          <div style="font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 5px 0;"><strong>Issue Date:</strong> ${formatDate(invoice.issueDate)}</p>
            <p style="margin: 0 0 5px 0;"><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
            <p style="margin: 0 0 5px 0;"><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <!-- Invoice Items Table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #E5E7EB;">
          <thead>
            <tr style="background-color: #F9FAFB;">
              <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: left; font-weight: bold; color: #1F2937;">Date</th>
              <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: left; font-weight: bold; color: #1F2937;">Description</th>
              <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; font-weight: bold; color: #1F2937;">Hours</th>
              <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; font-weight: bold; color: #1F2937;">Rate</th>
              <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; font-weight: bold; color: #1F2937;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map(item => `
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 12px; color: #374151;">${formatDate(item.date)}</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; color: #374151;">${item.description}</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; color: #374151;">${item.hours}</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; color: #374151;">${formatCurrency(item.rate)}</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: right; font-weight: bold; color: #374151;">${formatCurrency(item.amount)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px; border: 2px solid #10B981; border-radius: 8px; padding: 20px; background-color: #F0FDF4;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: bold; color: #1F2937;">Total Amount:</span>
            <span style="font-size: 24px; font-weight: bold; color: #10B981;">${formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${invoice.notes ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Notes:</h3>
          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 15px; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">
            ${invoice.notes}
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 12px;">
        <p style="margin: 0;">Thank you for your business!</p>
        <p style="margin: 5px 0 0 0;">Generated by beenvoice - Professional Invoicing Solution</p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${invoice.invoiceNumber}.pdf`);
  } finally {
    document.body.removeChild(tempDiv);
  }
} 