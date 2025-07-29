import { generateInvoiceEmailTemplate } from "./email-templates";

// Simple test utility to verify the email template works
export function testEmailTemplate() {
  const mockInvoice = {
    invoiceNumber: "INV-001",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "draft",
    totalAmount: 1000,
    taxRate: 8.5,
    notes: null,
    client: {
      name: "Test Client",
      email: "client@example.com",
    },
    business: {
      name: "Test Business",
      email: "business@example.com",
      phone: "(555) 123-4567",
      addressLine1: "123 Business St",
      addressLine2: null,
      city: "Business City",
      state: "CA",
      postalCode: "12345",
      country: "United States",
    },
    items: [
      {
        date: new Date(),
        description: "Development Services",
        hours: 10,
        rate: 100,
        amount: 1000,
      },
    ],
  };

  try {
    const template = generateInvoiceEmailTemplate({
      invoice: mockInvoice,
      userName: "John Doe",
      userEmail: "john@example.com",
    });

    return {
      success: true,
      hasHtml: !!template.html,
      hasText: !!template.text,
      htmlLength: template.html.length,
      textLength: template.text.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Format currency for display
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// Format date for email display
export function formatEmailDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Get time-based greeting
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
