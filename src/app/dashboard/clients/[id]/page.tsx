import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Edit, Mail, Phone, MapPin, Building, Calendar, DollarSign } from "lucide-react";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
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

  const totalInvoiced = client.invoices?.reduce((sum, invoice) => sum + invoice.totalAmount, 0) || 0;
  const paidInvoices = client.invoices?.filter(invoice => invoice.status === "paid").length || 0;
  const pendingInvoices = client.invoices?.filter(invoice => invoice.status === "sent").length || 0;

  return (
    <div className="p-4 md:p-6 md:ml-72 md:mr-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {client.name}
            </h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
          <Link href={`/clients/${client.id}/edit`}>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-emerald-700">
                  <Building className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {client.email && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm">{client.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Phone className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm">{client.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                {(client.addressLine1 ?? client.city ?? client.state) && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1 text-sm">
                      {client.addressLine1 && <p>{client.addressLine1}</p>}
                      {client.addressLine2 && <p>{client.addressLine2}</p>}
                      {(client.city ?? client.state ?? client.postalCode) && (
                        <p>
                          {[client.city, client.state, client.postalCode].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {client.country && <p>{client.country}</p>}
                    </div>
                  </div>
                )}

                {/* Client Since */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client Since</p>
                    <p className="text-sm">{formatDate(client.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                  <span>Invoice Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalInvoiced)}
                  </p>
                  <p className="text-sm text-gray-500">Total Invoiced</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{paidInvoices}</p>
                    <p className="text-xs text-gray-500">Paid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-orange-600">{pendingInvoices}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            {client.invoices && client.invoices.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.invoices.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-gray-500">{formatDate(invoice.issueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(invoice.totalAmount)}</p>
                          <Badge 
                            variant={
                              invoice.status === "paid" ? "default" : 
                              invoice.status === "sent" ? "secondary" : "outline"
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