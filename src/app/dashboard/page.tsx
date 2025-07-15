import { Suspense } from "react";
import { HydrateClient, api } from "~/trpc/server";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { DataTableSkeleton } from "~/components/data/data-table";
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
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      icon: FileText,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      icon: Calendar,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
  ];

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <CardContent className="p-4 py-0">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-medium">
                    {stat.title}
                  </p>
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
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
    <Card className="mb-6 border-0 shadow-sm">
      <CardContent className="p-4 py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
          >
            <Link href="/dashboard/invoices/new">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-0 shadow-sm"
          >
            <Link href="/dashboard/clients/new">
              <Users className="mr-2 h-4 w-4" />
              Add Client
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-0 shadow-sm"
          >
            <Link href="/dashboard/businesses/new">
              <TrendingUp className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
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
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              No invoices yet. Create your first invoice to get started!
            </p>
            <Button
              asChild
              className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
            >
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-5 w-5" />
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
        <div className="space-y-4">
          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/20">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">
                    Invoice #{invoice.invoiceNumber}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {invoice.client?.name} • ${invoice.totalAmount.toFixed(2)}
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

        <QuickActions />

        <HydrateClient>
          <Suspense fallback={<DataTableSkeleton columns={1} rows={3} />}>
            <RecentActivity />
          </Suspense>
        </HydrateClient>
      </div>
    </>
  );
}
