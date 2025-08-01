import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React from "react";

interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  taxRate: number;
  notes?: string | null;
  business?: {
    name: string;
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
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: "#0f0f0f",
    marginBottom: 4,
  },

  businessInfo: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: 3,
  },

  businessAddress: {
    fontSize: 10,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
    marginBottom: 8,
  },

  invoiceNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 4,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
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
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
    marginBottom: 12,
  },

  clientName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#0f0f0f",
    marginBottom: 2,
  },

  clientInfo: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: 2,
  },

  clientAddress: {
    fontSize: 10,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    color: "#6b7280",
    flex: 1,
  },

  detailValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
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
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
    marginBottom: 6,
  },

  notesContent: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#374151",
    lineHeight: 1.4,
  },

  businessContact: {
    fontSize: 9,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
  },

  abridgedInvoiceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  abridgedInvoiceTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
  },

  abridgedInvoiceNumber: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
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
    fontFamily: "Helvetica-Bold",
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
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica-Bold",
    color: "#0f0f0f",
  },

  finalTotalAmount: {
    fontSize: 14,
    fontFamily: "Courier-Bold",
    color: "#0f0f0f",
  },

  itemCount: {
    fontSize: 9,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    color: "#6b7280",
  },
});

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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

// Helper function to estimate text height based on content and width
function estimateTextHeight(
  text: string,
  maxWidth: number,
  fontSize = 10,
  lineHeight = 1.3,
): number {
  if (!text) return fontSize * lineHeight;

  // Rough character width estimation for Helvetica at given font size
  const avgCharWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  if (maxCharsPerLine <= 0) return fontSize * lineHeight;

  const lines = Math.ceil(text.length / maxCharsPerLine);
  return lines * fontSize * lineHeight;
}

// Calculate estimated height for a table row based on actual content
function calculateRowHeight(
  item: NonNullable<InvoiceData["items"]>[0],
): number {
  if (!item) return 18; // fallback

  const basePadding = 8; // Row padding
  const fontSize = 10;
  const lineHeight = 1.3;

  // Description column is 40% of table width
  // Table width is roughly 512 points (letter width - margins)
  const descriptionWidth = 512 * 0.4;

  const descriptionHeight = estimateTextHeight(
    item.description,
    descriptionWidth,
    fontSize,
    lineHeight,
  );

  // Minimum row height for other columns
  const minRowHeight = fontSize * lineHeight;

  // Row height is the maximum of description height and minimum height, plus padding
  // Ensure minimum row height of 24 points for readability
  return Math.max(descriptionHeight, minRowHeight, 24) + basePadding;
}

// Dynamic pagination calculation based on actual content
function calculateItemsForPage(
  items: NonNullable<InvoiceData["items"]>,
  startIndex: number,
  isFirstPage: boolean,
  hasNotes: boolean,
): number {
  // Estimate available space in points (1 point = 1/72 inch)
  const pageHeight = 792; // Letter size height in points
  const margins = 80; // Top + bottom margins
  const footerSpace = 60; // Footer space

  let availableHeight = pageHeight - margins - footerSpace;

  if (isFirstPage) {
    // Dense header takes significant space
    availableHeight -= 300; // Dense header space
  } else {
    // Abridged header is smaller
    availableHeight -= 60; // Abridged header space
  }

  if (hasNotes) {
    // Last page needs space for totals and notes
    availableHeight -= 200; // Totals + notes space (much more conservative)
  } else {
    // Regular page just needs totals space
    availableHeight -= 150; // Totals space only (much more conservative)
  }

  // Table header takes space
  availableHeight -= 30; // Table header

  // Calculate how many items can fit based on actual row heights
  let usedHeight = 0;
  let itemCount = 0;

  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;

    const rowHeight = calculateRowHeight(item);

    if (usedHeight + rowHeight > availableHeight) {
      break; // This item won't fit
    }

    usedHeight += rowHeight;
    itemCount++;
  }

  return Math.max(1, itemCount); // Always return at least 1 item
}

// Fallback function for backward compatibility
function calculateItemsPerPage(
  isFirstPage: boolean,
  hasNotes: boolean,
): number {
  // Estimate available space in points (1 point = 1/72 inch)
  const pageHeight = 792; // Letter size height in points
  const margins = 80; // Top + bottom margins
  const footerSpace = 60; // Footer space

  let availableHeight = pageHeight - margins - footerSpace;

  if (isFirstPage) {
    // Dense header takes significant space
    availableHeight -= 300; // Dense header space
  } else {
    // Abridged header is smaller
    availableHeight -= 60; // Abridged header space
  }

  if (hasNotes) {
    // Last page needs space for totals and notes
    availableHeight -= 200; // Totals + notes space (much more conservative)
  } else {
    // Regular page just needs totals space
    availableHeight -= 150; // Totals space only (much more conservative)
  }

  // Table header takes space
  availableHeight -= 30; // Table header

  // Conservative estimate using average row height
  const avgRowHeight = 24; // Increased from 18 to account for potential wrapping

  return Math.max(1, Math.floor(availableHeight / avgRowHeight));
}

// Dynamic pagination function
function paginateItems(
  items: NonNullable<InvoiceData["items"]>,
  hasNotes = false,
) {
  const validItems = items.filter(Boolean);
  const pages: Array<typeof validItems> = [];

  if (validItems.length === 0) {
    return [[]];
  }

  let currentIndex = 0;
  let pageIndex = 0;

  while (currentIndex < validItems.length) {
    const isFirstPage = pageIndex === 0;
    const remainingItems = validItems.length - currentIndex;

    // Determine if this could be the last page with simple calculation
    const maxPossibleItems = calculateItemsPerPage(isFirstPage, false);
    const wouldBeLastPage =
      currentIndex + maxPossibleItems >= validItems.length;

    // Calculate items per page, accounting for notes space if this is likely the last page
    let itemsPerPage = calculateItemsForPage(
      validItems,
      currentIndex,
      isFirstPage,
      wouldBeLastPage && hasNotes,
    );

    // Fallback to conservative calculation if dynamic fails
    if (itemsPerPage === 0) {
      itemsPerPage = calculateItemsPerPage(
        isFirstPage,
        wouldBeLastPage && hasNotes,
      );
    }

    // Ensure we don't have tiny orphan pages
    if (remainingItems > itemsPerPage && remainingItems - itemsPerPage < 2) {
      itemsPerPage = Math.max(1, itemsPerPage - 1);
    }

    // Never take more items than we have
    itemsPerPage = Math.min(itemsPerPage, remainingItems);

    const pageItems = validItems.slice(
      currentIndex,
      currentIndex + itemsPerPage,
    );

    pages.push(pageItems);
    currentIndex += itemsPerPage;
    pageIndex++;
  }

  return pages;
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
        <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
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
      <Text style={styles.abridgedInvoiceNumber}>#{invoice.invoiceNumber}</Text>
    </View>
  </View>
);

// Table header component
const TableHeader: React.FC = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.tableHeaderCell, styles.tableHeaderDate]}>Date</Text>
    <Text style={[styles.tableHeaderCell, styles.tableHeaderDescription]}>
      Description
    </Text>
    <Text style={[styles.tableHeaderCell, styles.tableHeaderHours]}>Hours</Text>
    <Text style={[styles.tableHeaderCell, styles.tableHeaderRate]}>Rate</Text>
    <Text style={[styles.tableHeaderCell, styles.tableHeaderAmount]}>
      Amount
    </Text>
  </View>
);

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
          fontFamily: "Helvetica",
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
  const subtotal = items.reduce((sum, item) => sum + (item?.amount ?? 0), 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;

  return (
    <View style={styles.totalsContainer}>
      <View style={styles.totalsBox}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Helvetica-Bold",
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
          <Text style={styles.totalAmount}>{formatCurrency(subtotal)}</Text>
        </View>

        {invoice.taxRate > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
            <Text style={styles.totalAmount}>{formatCurrency(taxAmount)}</Text>
          </View>
        )}

        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>TOTAL:</Text>
          <Text style={styles.finalTotalAmount}>
            {formatCurrency(invoice.totalAmount)}
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
  const paginatedItems = paginateItems(items, Boolean(invoice.notes));

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
                <TableHeader />
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
                        <Text style={[styles.tableCell, styles.tableCellDate]}>
                          {formatDate(item.date)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            styles.tableCellDescription,
                          ]}
                        >
                          {item.description}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellHours]}>
                          {item.hours}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellRate]}>
                          {formatCurrency(item.rate)}
                        </Text>
                        <Text
                          style={[styles.tableCell, styles.tableCellAmount]}
                        >
                          {formatCurrency(item.amount)}
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
    const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    // Create filename with timestamp for uniqueness
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Invoice_${invoice.invoiceNumber}_${timestamp}.pdf`;

    // Download the PDF
    saveAs(blob, filename);
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
    const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    return blob;
  } catch (error) {
    // Re-throw with consistent error handling
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate PDF blob");
  }
}
