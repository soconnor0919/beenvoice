import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { PageHeader } from "~/components/layout/page-header";
import Link from "next/link";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;

  const client = await api.clients.getById({ id });

  if (!client) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalInvoiced =
    client.invoices?.reduce((sum, invoice) => sum + invoice.totalAmount, 0) ||
    0;
  const paidInvoices =
    client.invoices?.filter((invoice) => invoice.status === "paid").length || 0;
  const pendingInvoices =
    client.invoices?.filter((invoice) => invoice.status === "sent").length || 0;

  return (
    <div>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title={client.name}
          description="Client Details"
          variant="gradient"
        >
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Button variant="brand">
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Client Information Card */}
          <div className="lg:col-span-2">
            <Card className="card-primary">
              <CardHeader>
                <CardTitle className="client-section-title">
                  <Building className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {client.email && (
                    <div className="client-info-item">
                      <div className="client-info-icon">
                        <Mail className="client-info-icon-emerald" />
                      </div>
                      <div>
                        <p className="client-info-label">Email</p>
                        <p className="client-info-value">{client.email}</p>
                      </div>
                    </div>
                  )}

                  {client.phone && (
                    <div className="client-info-item">
                      <div className="client-info-icon">
                        <Phone className="client-info-icon-emerald" />
                      </div>
                      <div>
                        <p className="client-info-label">Phone</p>
                        <p className="client-info-value">{client.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                {(client.addressLine1 ?? client.city ?? client.state) && (
                  <div className="space-y-4">
                    <div className="client-info-item">
                      <div className="client-info-icon">
                        <MapPin className="client-info-icon-emerald" />
                      </div>
                      <div>
                        <p className="client-info-label">Address</p>
                      </div>
                    </div>
                    <div className="client-address-content">
                      {client.addressLine1 && <p>{client.addressLine1}</p>}
                      {client.addressLine2 && <p>{client.addressLine2}</p>}
                      {(client.city ?? client.state ?? client.postalCode) && (
                        <p>
                          {[client.city, client.state, client.postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {client.country && <p>{client.country}</p>}
                    </div>
                  </div>
                )}

                {/* Client Since */}
                <div className="client-info-item">
                  <div className="client-info-icon">
                    <Calendar className="client-info-icon-emerald" />
                  </div>
                  <div>
                    <p className="client-info-label">Client Since</p>
                    <p className="client-info-value">
                      {formatDate(client.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card className="card-primary">
              <CardHeader>
                <CardTitle className="client-stats-title">
                  <DollarSign className="h-5 w-5" />
                  <span>Invoice Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="client-total-amount">
                    {formatCurrency(totalInvoiced)}
                  </p>
                  <p className="client-total-label">Total Invoiced</p>
                </div>

                <div className="client-stats-grid">
                  <div className="text-center">
                    <p className="client-stat-value-paid">{paidInvoices}</p>
                    <p className="client-stat-label">Paid</p>
                  </div>
                  <div className="text-center">
                    <p className="client-stat-value-pending">
                      {pendingInvoices}
                    </p>
                    <p className="client-stat-label">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            {client.invoices && client.invoices.length > 0 && (
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">
                    Recent Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.invoices.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="invoice-item">
                        <div>
                          <p className="invoice-item-title">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="invoice-item-date">
                            {formatDate(invoice.issueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="invoice-item-amount">
                            {formatCurrency(invoice.totalAmount)}
                          </p>
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "default"
                                : invoice.status === "sent"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
