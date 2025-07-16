import { Suspense } from "react";
import { HydrateClient, api } from "~/trpc/server";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { DataTableSkeleton } from "~/components/data/data-table";
import { CurrentOpenInvoiceCard } from "~/components/data/current-open-invoice-card";
import { auth } from "~/server/auth";
import Link from "next/link";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Plus,
  Eye,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

// Stats Cards Component
async function DashboardStats() {
  const [clients, invoices] = await Promise.all([
    api.clients.getAll(),
    api.invoices.getAll(),
  ]);

  const totalClients = clients.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.totalAmount,
    0,
  );
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "sent" || invoice.status === "draft",
  ).length;

  const stats = [
    {
      title: "Total Clients",
      value: totalClients.toString(),
      icon: Users,
      color: "text-icon-blue",
      bgColor: "bg-brand-muted-blue",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      icon: FileText,
      color: "text-icon-emerald",
      bgColor: "bg-brand-muted",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-icon-teal",
      bgColor: "bg-brand-muted-teal",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      icon: Calendar,
      color: "text-icon-amber",
      bgColor: "bg-brand-muted-amber",
    },
  ];

  return (
    <Card className="card-primary mb-4">
      <CardContent className="p-4 py-0">
        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="stats-item">
                <div className={`icon-bg-small ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="stats-label">{stat.title}</p>
                  <p className={`stats-value ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions Component
function QuickActions() {
  return (
    <Card className="card-secondary">
      <CardHeader className="pb-3">
        <CardTitle className="quick-action-title">
          <Plus className="quick-action-icon" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="btn-brand-primary w-full shadow-sm">
          <Link href="/dashboard/invoices/new">
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full shadow-sm">
          <Link href="/dashboard/clients/new">
            <Users className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full shadow-sm">
          <Link href="/dashboard/businesses/new">
            <TrendingUp className="mr-2 h-4 w-4" />
            Add Business
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
async function RecentActivity() {
  const invoices = await api.invoices.getAll();
  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    )
    .slice(0, 5);

  if (recentInvoices.length === 0) {
    return (
      <Card className="card-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="recent-activity-empty">
            <FileText className="recent-activity-icon" />
            <p className="recent-activity-text">
              No invoices yet. Create your first invoice to get started!
            </p>
            <Button asChild className="btn-brand-primary mt-4">
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-muted h-5 w-5" />
          Recent Activity
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/invoices">
            View All
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentInvoices.map((invoice) => (
            <Card key={invoice.id} className="card-secondary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="activity-icon">
                      <FileText className="text-icon-emerald h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Invoice #{invoice.invoiceNumber}
                      </p>
                      <p className="text-muted text-sm">
                        {invoice.client?.name} • $
                        {invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={invoice.status as StatusType} />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "User";

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}!`}
        description="Here's an overview of your invoicing business"
        variant="gradient"
      />

      <div className="space-y-6">
        <HydrateClient>
          <Suspense fallback={<DataTableSkeleton columns={4} rows={1} />}>
            <DashboardStats />
          </Suspense>
        </HydrateClient>

        <div className="grid gap-6 md:grid-cols-2">
          <CurrentOpenInvoiceCard />
          <QuickActions />
        </div>

        <HydrateClient>
          <Suspense fallback={<DataTableSkeleton columns={1} rows={5} />}>
            <RecentActivity />
          </Suspense>
        </HydrateClient>
      </div>
    </>
  );
}
