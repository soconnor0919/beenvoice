export type StoredInvoiceStatus = "draft" | "sent" | "paid";
export type EffectiveInvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string | null;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  status: StoredInvoiceStatus;
  totalAmount: number;
  taxRate: number;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface InvoiceWithRelations extends Invoice {
  client: {
    id: string;
    name: string;
    email: string | null;
  };
  business: {
    id: string;
    name: string;
    nickname: string | null;
    email: string | null;
  } | null;
  invoiceItems: Array<{
    id: string;
    date: Date;
    description: string;
    hours: number;
    rate: number;
  }>;
}
