"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Clients
          </CardTitle>
          <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalClients}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalClients > lastMonthClients ? "+" : ""}
            {totalClients - lastMonthClients} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Invoices
          </CardTitle>
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalInvoices}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalInvoices > lastMonthInvoices ? "+" : ""}
            {totalInvoices - lastMonthInvoices} from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Revenue
          </CardTitle>
          <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
            <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalRevenue > lastMonthRevenue ? "+" : ""}
            {(
              ((totalRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) *
              100
            ).toFixed(1)}
            % from last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pending Invoices
          </CardTitle>
          <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
            <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {pendingInvoices}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Due this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Client component for dashboard cards
export function DashboardCards() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Users className="h-5 w-5" />
            </div>
            Manage Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Add new clients and manage your existing client relationships.
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
            >
              <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-gray-300 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Link href="/dashboard/clients">
                View All Clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <FileText className="h-5 w-5" />
            </div>
            Create Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Generate professional invoices and track payments.
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
            >
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-gray-300 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
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
    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader>
        <CardTitle className="text-emerald-700 dark:text-emerald-400">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 p-4 dark:bg-gray-700">
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="mb-2 text-lg font-medium dark:text-gray-300">
              No recent activity
            </p>
            <p className="text-sm dark:text-gray-400">
              Start by adding your first client or creating an invoice
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Invoice #{invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.client?.name ?? "Unknown Client"} • $
                      {invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : invoice.status === "sent"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : invoice.status === "overdue"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </span>
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
