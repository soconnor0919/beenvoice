"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { StatusBadge, type StatusType } from "~/components/ui/status-badge";
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  DashboardStatsSkeleton,
  DashboardActivitySkeleton,
} from "~/components/ui/skeleton";

// Client component for dashboard stats
export function DashboardStats() {
  const { data: clients, isLoading: clientsLoading } =
    api.clients.getAll.useQuery();
  const { data: invoices, isLoading: invoicesLoading } =
    api.invoices.getAll.useQuery();

  if (clientsLoading || invoicesLoading) {
    return <DashboardStatsSkeleton />;
  }

  const totalClients = clients?.length ?? 0;
  const totalInvoices = invoices?.length ?? 0;
  const totalRevenue =
    invoices?.reduce((sum, invoice) => sum + invoice.totalAmount, 0) ?? 0;
  const pendingInvoices =
    invoices?.filter(
      (invoice) => invoice.status === "sent" || invoice.status === "draft",
    ).length ?? 0;

  // Calculate month-over-month changes (simplified)
  const lastMonthClients = 0; // This would need historical data
  const lastMonthInvoices = 0;
  const lastMonthRevenue = 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total Clients
          </CardTitle>
          <div className="rounded-lg bg-emerald-100 p-2">
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {totalClients}
          </div>
          <p className="text-muted-foreground text-xs">
            {totalClients > lastMonthClients ? "+" : ""}
            {totalClients - lastMonthClients} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total Invoices
          </CardTitle>
          <div className="rounded-lg bg-blue-100 p-2">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {totalInvoices}
          </div>
          <p className="text-muted-foreground text-xs">
            {totalInvoices > lastMonthInvoices ? "+" : ""}
            {totalInvoices - lastMonthInvoices} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Revenue
          </CardTitle>
          <div className="rounded-lg bg-teal-100 p-2">
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-teal-600">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-muted-foreground text-xs">
            {totalRevenue > lastMonthRevenue ? "+" : ""}
            {(
              ((totalRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) *
              100
            ).toFixed(1)}
            % from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <div className="rounded-lg bg-orange-100 p-2">
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">
            {pendingInvoices}
          </div>
          <p className="text-muted-foreground text-xs">Due this month</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Client component for dashboard cards
export function DashboardCards() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Users className="h-5 w-5" />
            </div>
            Manage Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Add new clients and manage your existing client relationships.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="brand">
              <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
            <Button variant="outline" asChild className="font-medium">
              <Link href="/dashboard/clients">
                View All Clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <div className="rounded-lg bg-emerald-100 p-2">
              <FileText className="h-5 w-5" />
            </div>
            Create Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate professional invoices and track payments.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="brand">
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
            <Button variant="outline" asChild className="font-medium">
              <Link href="/dashboard/invoices">
                View All Invoices
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Client component for recent activity
export function DashboardActivity() {
  const { data: invoices, isLoading } = api.invoices.getAll.useQuery();

  if (isLoading) {
    return <DashboardActivitySkeleton />;
  }

  const recentInvoices = invoices?.slice(0, 5) ?? [];

  return (
    <Card className="shadow-xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-emerald-700">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentInvoices.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full p-4">
              <FileText className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-foreground mb-2 text-lg font-medium">
              No recent activity
            </p>
            <p className="text-muted-foreground text-sm">
              Start by adding your first client or creating an invoice
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-muted/50 flex items-center justify-between rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Invoice #{invoice.invoiceNumber}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {invoice.client?.name ?? "Unknown Client"} • $
                      {invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={invoice.status as StatusType} />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
