import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React from "react";

Font.register({
  family: "Frutiger",
  fonts: [
    {
      src: "/fonts/frutiger/Frutiger.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/frutiger/Frutiger_bold.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "Frutiger-Bold",
  src: "/fonts/frutiger/Frutiger_bold.ttf",
});

// Fallback download function for better browser compatibility
function downloadBlob(blob: Blob, filename: string): void {
  try {
    // Validate blob before download
    if (!blob || blob.size === 0) {
      throw new Error("Invalid blob for download");
    }

    // First try using file-saver
    saveAs(blob, filename);
  } catch (error) {
    console.warn("file-saver failed, using fallback method:", error);

    try {
      // Fallback to manual download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      // Add MIME type hint to link
      if (blob.type) {
        link.type = blob.type;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("PDF download initiated successfully via fallback method");

      // Clean up the object URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log("Object URL cleaned up");
      }, 1000);
    } catch (fallbackError) {
      console.error("Both download methods failed:", fallbackError);
      throw new Error("Unable to download PDF file");
    }
  }
}

interface InvoiceData {
  invoiceNumber: string;
  invoicePrefix?: string | null;
  issueDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  taxRate: number;
  currency?: string | null;
  notes?: string | null;
  business?: {
    name: string;
    nickname?: string | null;
    email?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    website?: string | null;
    taxId?: string | null;
  } | null;
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
  } | null> | null;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontFamily: "Frutiger",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 40,
  },

  // Dense header (first page)
  denseHeader: {
    marginBottom: 30,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  businessSection: {
    flexDirection: "column",
    flex: 1,
  },

  businessName: {
    fontFamily: "Frutiger-Bold",
    fontSize: 18,
    color: "#0f0f0f",
    marginBottom: 4,
  },

  businessInfo: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: 3,
  },

  businessAddress: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#6b7280",
    lineHeight: 1.4,
    marginTop: 4,
  },

  invoiceSection: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  invoiceTitle: {
    fontSize: 28,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
    marginBottom: 8,
  },

  invoiceNumber: {
    fontSize: 14,
    fontFamily: "Frutiger-Bold",
    color: "#374151",
    marginBottom: 4,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontFamily: "Frutiger-Bold",
    textAlign: "center",
  },

  statusPaid: {
    backgroundColor: "#f9fafb",
    color: "#374151",
  },

  statusUnpaid: {
    backgroundColor: "#f9fafb",
    color: "#6b7280",
  },

  // Details section (first page only)
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  detailsColumn: {
    flex: 1,
    marginRight: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
    marginBottom: 12,
  },

  clientName: {
    fontFamily: "Frutiger-Bold",
    fontSize: 12,
    color: "#0f0f0f",
    marginBottom: 2,
  },

  clientInfo: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: 2,
  },

  clientAddress: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#6b7280",
    lineHeight: 1.4,
    marginTop: 4,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  detailLabel: {
    fontSize: 11,
    fontFamily: "Frutiger",
    color: "#6b7280",
    flex: 1,
  },

  detailValue: {
    fontSize: 10,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
    flex: 1,
    textAlign: "right",
  },

  // Notes section (first page only)
  notesSection: {
    marginTop: 0,
    marginBottom: 0,
    padding: 12,
    backgroundColor: "#f9fafb",
  },

  notesTitle: {
    fontSize: 11,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
    marginBottom: 6,
  },

  notesContent: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#374151",
    lineHeight: 1.4,
  },

  businessContact: {
    fontSize: 9,
    fontFamily: "Frutiger",
    color: "#6b7280",
    lineHeight: 1.4,
  },

  // Separator styles
  headerSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },

  // Abridged header (other pages)
  abridgedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid #e5e7eb",
  },

  abridgedBusinessName: {
    fontSize: 12,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
  },

  abridgedInvoiceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  abridgedInvoiceTitle: {
    fontSize: 14,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
  },

  abridgedInvoiceNumber: {
    fontSize: 12,
    fontFamily: "Frutiger-Bold",
    color: "#374151",
  },

  // Table styles
  tableContainer: {
    flex: 1,
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  tableHeaderCell: {
    fontSize: 10,
    fontFamily: "Frutiger-Bold",
    color: "#374151",
    paddingHorizontal: 4,
  },

  tableHeaderDate: {
    width: "15%",
  },

  tableHeaderDescription: {
    width: "40%",
  },

  tableHeaderHours: {
    width: "12%",
    textAlign: "right",
  },

  tableHeaderRate: {
    width: "15%",
    textAlign: "right",
  },

  tableHeaderAmount: {
    width: "18%",
    textAlign: "right",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 6,
    alignItems: "flex-start",
    minHeight: 24,
  },

  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },

  tableCell: {
    fontSize: 10,
    color: "#0f0f0f",
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontFamily: "Frutiger",
  },

  tableCellDate: {
    width: "15%",
    fontFamily: "Courier",
    alignSelf: "flex-start",
  },

  tableCellDescription: {
    width: "40%",
    lineHeight: 1.4,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "left",
    flexWrap: "wrap",
    fontFamily: "Frutiger",
  },

  tableCellHours: {
    width: "12%",
    textAlign: "right",
    fontFamily: "Courier",
    alignSelf: "flex-start",
  },

  tableCellRate: {
    width: "15%",
    textAlign: "right",
    fontFamily: "Courier",
    alignSelf: "flex-start",
  },

  tableCellAmount: {
    width: "18%",
    textAlign: "right",
    fontFamily: "Courier-Bold",
    alignSelf: "flex-start",
  },

  // Bottom section with notes and totals
  bottomSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  notesContainer: {
    width: 240,
  },

  totalsContainer: {
    width: 240,
    break: false,
  },

  totalsBox: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f9fafb",
    break: false,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingVertical: 1,
  },

  totalLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontFamily: "Frutiger",
  },

  totalAmount: {
    fontSize: 11,
    fontFamily: "Courier-Bold",
    color: "#0f0f0f",
  },

  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
  },

  finalTotalLabel: {
    fontSize: 12,
    fontFamily: "Frutiger-Bold",
    color: "#0f0f0f",
  },

  finalTotalAmount: {
    fontSize: 14,
    fontFamily: "Courier-Bold",
    color: "#0f0f0f",
  },

  itemCount: {
    fontSize: 9,
    fontFamily: "Frutiger",
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 6,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
  },

  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  pageNumber: {
    fontSize: 10,
    fontFamily: "Frutiger",
    color: "#6b7280",
  },
});

// Helper functions
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "paid":
      return "PAID";
    case "draft":
    case "sent":
    case "overdue":
    default:
      return "UNPAID";
  }
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return [styles.statusBadge, styles.statusPaid];
    case "sent":
      return [styles.statusBadge, styles.statusPaid];
    case "overdue":
      return [
        styles.statusBadge,
        { backgroundColor: "#fef2f2", color: "#dc2626" },
      ];
    case "draft":
      return [
        styles.statusBadge,
        { backgroundColor: "#f9fafb", color: "#9ca3af" },
      ];
    default:
      return [styles.statusBadge, styles.statusUnpaid];
  }
};

function pageContentBudget(isFirstPage: boolean, hasNotes: boolean): number {
  // 792pt page - 40pt paddingTop - 80pt paddingBottom = 672pt usable
  let h = 672;
  h -= isFirstPage ? 285 : 50; // dense vs abridged header
  h -= hasNotes ? 185 : 130;   // totals box (+ notes section if present)
  h -= 28;                      // table header row
  return h;
}

function estimateRowHeight(
  item: NonNullable<NonNullable<InvoiceData["items"]>[0]>,
  showRate: boolean,
): number {
  // 532pt usable width (612 - 80pt horizontal padding); description takes 40% or 48%
  const descColWidth = 532 * (showRate ? 0.4 : 0.48);
  // Frutiger at 10pt: 0.45em gives ~47 chars/line, matching real wrap behaviour
  const charsPerLine = Math.max(1, Math.floor(descColWidth / (10 * 0.45)));
  const lines = Math.ceil((item.description.length || 1) / charsPerLine);
  // row paddingVertical:6 (×2=12) + cell paddingVertical:4 (×2=8) = 20pt overhead,
  // but react-pdf measures the line box at slightly under full lineHeight, so 16pt in practice
  return lines * 10 * 1.4 + 16;
}

function paginateItems(
  items: NonNullable<InvoiceData["items"]>,
  hasNotes = false,
  showRate = true,
) {
  const validItems = items.filter(Boolean) as NonNullable<typeof items[0]>[];
  if (validItems.length === 0) return [[]];

  const rowHeights = validItems.map((item) => estimateRowHeight(item, showRate));

  function pack(startIdx: number, budget: number): number {
    let used = 0, count = 0;
    for (let i = startIdx; i < validItems.length; i++) {
      if (used + rowHeights[i]! > budget) break;
      used += rowHeights[i]!;
      count++;
    }
    return Math.max(1, count);
  }

  const pages: (typeof validItems)[] = [];
  let idx = 0;

  while (idx < validItems.length) {
    const isFirst = pages.length === 0;
    const countFull = pack(idx, pageContentBudget(isFirst, false));

    if (idx + countFull >= validItems.length) {
      // All remaining items fit — if there are notes, verify they also fit with the notes reservation
      if (hasNotes) {
        const countWithNotes = pack(idx, pageContentBudget(isFirst, true));
        if (idx + countWithNotes >= validItems.length) {
          pages.push(validItems.slice(idx));
          break;
        }
        // Notes don't fit alongside all items — push what fits, notes go on next page
        pages.push(validItems.slice(idx, idx + countWithNotes));
        idx += countWithNotes;
      } else {
        pages.push(validItems.slice(idx));
        break;
      }
    } else {
      pages.push(validItems.slice(idx, idx + countFull));
      idx += countFull;
    }
  }

  return pages;
}

function getColumnWidths(showRate: boolean) {
  return showRate
    ? { date: "15%", description: "40%", hours: "12%", rate: "15%", amount: "18%" }
    : { date: "15%", description: "48%", hours: "14%", amount: "23%" };
}

// Dense header component (first page)
const DenseHeader: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => (
  <View style={styles.denseHeader}>
    <View style={styles.headerTop}>
      <View style={styles.businessSection}>
        <Text style={styles.businessName}>
          {invoice.business?.name ?? "Your Business Name"}
        </Text>
        {invoice.business?.email && (
          <Text style={styles.businessInfo}>{invoice.business.email}</Text>
        )}
        {invoice.business?.phone && (
          <Text style={styles.businessInfo}>{invoice.business.phone}</Text>
        )}
        {(invoice.business?.addressLine1 ??
          invoice.business?.city ??
          invoice.business?.state) && (
          <Text style={styles.businessAddress}>
            {[
              invoice.business?.addressLine1,
              invoice.business?.addressLine2,
              invoice.business?.city &&
              invoice.business?.state &&
              invoice.business?.postalCode
                ? `${invoice.business.city}, ${invoice.business.state} ${invoice.business.postalCode}`
                : [
                    invoice.business?.city,
                    invoice.business?.state,
                    invoice.business?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", "),
              invoice.business?.country,
            ]
              .filter(Boolean)
              .join("\n")}
          </Text>
        )}
      </View>

      <View style={styles.invoiceSection}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>
          {invoice.invoicePrefix ?? "#"}
          {invoice.invoiceNumber}
        </Text>
        <View style={getStatusStyle(invoice.status)}>
          <Text>{getStatusLabel(invoice.status)}</Text>
        </View>
      </View>
    </View>

    <View style={styles.headerSeparator} />

    <View style={styles.detailsSection}>
      <View style={styles.detailsColumn}>
        <Text style={styles.sectionTitle}>BILL TO:</Text>
        <Text style={styles.clientName}>{invoice.client?.name ?? "N/A"}</Text>
        {invoice.client?.email && (
          <Text style={styles.clientInfo}>{invoice.client.email}</Text>
        )}
        {invoice.client?.phone && (
          <Text style={styles.clientInfo}>{invoice.client.phone}</Text>
        )}
        {(invoice.client?.addressLine1 ??
          invoice.client?.city ??
          invoice.client?.state) && (
          <Text style={styles.clientAddress}>
            {[
              invoice.client?.addressLine1,
              invoice.client?.addressLine2,
              invoice.client?.city,
              invoice.client?.state,
              invoice.client?.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
            {invoice.client?.country ? "\n" + invoice.client.country : ""}
          </Text>
        )}
      </View>

      <View style={styles.detailsColumn}>
        <Text style={styles.sectionTitle}>INVOICE DETAILS:</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Issue Date:</Text>
          <Text style={styles.detailValue}>
            {formatDate(invoice.issueDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Date:</Text>
          <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invoice #:</Text>
          <Text style={styles.detailValue}>{invoice.invoiceNumber}</Text>
        </View>
      </View>
    </View>
  </View>
);

// Abridged header component (other pages)
const AbridgedHeader: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => (
  <View style={styles.abridgedHeader}>
    <Text style={styles.abridgedBusinessName}>
      {invoice.business?.name ?? "Your Business Name"}
    </Text>
    <View style={styles.abridgedInvoiceInfo}>
      <Text style={styles.abridgedInvoiceTitle}>INVOICE</Text>
      <Text style={styles.abridgedInvoiceNumber}>
        {invoice.invoicePrefix ?? "#"}
        {invoice.invoiceNumber}
      </Text>
    </View>
  </View>
);

// Table header component
const TableHeader: React.FC<{ showRate: boolean }> = ({ showRate }) => {
  const cols = getColumnWidths(showRate);
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, { width: cols.date }]}>Date</Text>
      <Text style={[styles.tableHeaderCell, { width: cols.description }]}>
        Description
      </Text>
      <Text style={[styles.tableHeaderCell, styles.tableHeaderHours, { width: cols.hours }]}>Hours</Text>
      {showRate && (
        <Text style={[styles.tableHeaderCell, styles.tableHeaderRate]}>Rate</Text>
      )}
      <Text style={[styles.tableHeaderCell, styles.tableHeaderAmount, { width: cols.amount }]}>
        Amount
      </Text>
    </View>
  );
};

// Footer component
const NotesSection: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
  if (!invoice.notes) return null;

  return (
    <View style={styles.notesContainer}>
      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>NOTES</Text>
        <Text style={styles.notesContent}>{invoice.notes}</Text>
      </View>
    </View>
  );
};

const Footer: React.FC = () => (
  <View style={styles.footer} fixed>
    <View style={styles.footerLogo}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src="/beenvoice-logo.png"
        style={{
          width: 120,
          height: 18,
          marginRight: 8,
        }}
      />
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Frutiger",
          color: "#6b7280",
          marginLeft: 8,
        }}
      >
        Professional Invoicing
      </Text>
    </View>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
    />
  </View>
);

// Enhanced totals section component
const TotalsSection: React.FC<{
  invoice: InvoiceData;
  items: Array<NonNullable<InvoiceData["items"]>[0]>;
}> = ({ invoice, items }) => {
  const currency = invoice.currency ?? "USD";
  const subtotal = items.reduce((sum, item) => sum + (item?.amount ?? 0), 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <View style={styles.totalsContainer}>
      <View style={styles.totalsBox}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Frutiger-Bold",
            color: "#0f0f0f",
            textAlign: "center",
            marginBottom: 8,
            paddingBottom: 6,
          }}
        >
          INVOICE SUMMARY
        </Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(subtotal, currency)}
          </Text>
        </View>

        {invoice.taxRate > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(taxAmount, currency)}
            </Text>
          </View>
        )}

        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>TOTAL:</Text>
          <Text style={styles.finalTotalAmount}>
            {formatCurrency(total, currency)}
          </Text>
        </View>

        <Text style={styles.itemCount}>
          {items.length} line item{items.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
};

// Main PDF component
const InvoicePDF: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
  const items = invoice.items?.filter(Boolean) ?? [];
  const currency = invoice.currency ?? "USD";
  const showRate = new Set(items.map((item) => item?.rate)).size > 1;
  const cols = getColumnWidths(showRate);
  const paginatedItems = paginateItems(items, Boolean(invoice.notes), showRate);

  return (
    <Document>
      {paginatedItems.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === paginatedItems.length - 1;
        const hasItems = pageItems.length > 0;

        return (
          <Page key={`page-${pageIndex}`} size="LETTER" style={styles.page}>
            {/* Header */}
            {isFirstPage ? (
              <DenseHeader invoice={invoice} />
            ) : (
              <AbridgedHeader invoice={invoice} />
            )}

            {/* Table */}
            {hasItems && (
              <View style={styles.tableContainer}>
                <TableHeader showRate={showRate} />
                {pageItems.map(
                  (item, index) =>
                    item && (
                      <View
                        key={`${pageIndex}-${index}`}
                        style={[
                          styles.tableRow,
                          index % 2 === 0 ? styles.tableRowAlt : {},
                        ]}
                      >
                        <Text style={[styles.tableCell, styles.tableCellDate, { width: cols.date }]}>
                          {formatDate(item.date)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            styles.tableCellDescription,
                            { width: cols.description },
                          ]}
                        >
                          {item.description}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellHours, { width: cols.hours }]}>
                          {item.hours}
                        </Text>
                        {showRate && (
                          <Text style={[styles.tableCell, styles.tableCellRate]}>
                            {formatCurrency(item.rate, currency)}
                          </Text>
                        )}
                        <Text
                          style={[styles.tableCell, styles.tableCellAmount, { width: cols.amount }]}
                        >
                          {formatCurrency(item.amount, currency)}
                        </Text>
                      </View>
                    ),
                )}
              </View>
            )}

            {/* Bottom section with notes and totals (only on last page) */}
            {isLastPage && (
              <View style={styles.bottomSection}>
                {invoice.notes && <NotesSection invoice={invoice} />}
                <TotalsSection invoice={invoice} items={items} />
              </View>
            )}

            {/* Footer */}
            <Footer />
          </Page>
        );
      })}
    </Document>
  );
};

// Export functions
export async function generateInvoicePDF(invoice: InvoiceData): Promise<void> {
  try {
    // Validate invoice data
    if (!invoice) {
      throw new Error("Invoice data is required");
    }

    if (!invoice.invoiceNumber) {
      throw new Error("Invoice number is required");
    }

    if (!invoice.client?.name) {
      throw new Error("Client information is required");
    }

    // Generate PDF blob
    const originalBlob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

    // Validate blob
    if (!originalBlob || originalBlob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    // Create a new blob with explicit MIME type to ensure proper PDF handling
    const blob = new Blob([originalBlob], { type: "application/pdf" });

    // Create filename with timestamp for uniqueness
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Invoice_${invoice.invoiceNumber}_${timestamp}.pdf`;

    // Download the PDF with fallback support
    downloadBlob(blob, filename);
  } catch (error) {
    // Log the actual error for debugging
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

// Additional utility function for generating PDF without downloading
export async function generateInvoicePDFBlob(
  invoice: InvoiceData,
): Promise<Blob> {
  try {
    // Validate invoice data
    if (!invoice) {
      throw new Error("Invoice data is required");
    }

    if (!invoice.invoiceNumber) {
      throw new Error("Invoice number is required");
    }

    if (!invoice.client?.name) {
      throw new Error("Client information is required");
    }

    // Generate PDF blob
    const originalBlob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

    // Validate blob
    if (!originalBlob || originalBlob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    // Create a new blob with explicit MIME type to ensure proper PDF handling
    const blob = new Blob([originalBlob], { type: "application/pdf" });

    return blob;
  } catch (error) {
    // Re-throw with consistent error handling
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate PDF blob");
  }
}
