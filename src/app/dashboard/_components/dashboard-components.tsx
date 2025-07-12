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
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { DashboardStatsSkeleton, DashboardActivitySkeleton } from "~/components/ui/skeleton";

// Client component for dashboard stats
export function DashboardStats() {
  const { data: clients, isLoading: clientsLoading } = api.clients.getAll.useQuery();
  const { data: invoices, isLoading: invoicesLoading } = api.invoices.getAll.useQuery();

  if (clientsLoading || invoicesLoading) {
    return <DashboardStatsSkeleton />;
  }

  const totalClients = clients?.length ?? 0;
  const totalInvoices = invoices?.length ?? 0;
  const totalRevenue = invoices?.reduce((sum, invoice) => sum + invoice.totalAmount, 0) ?? 0;
  const pendingInvoices = invoices?.filter(invoice => invoice.status === "sent" || invoice.status === "draft").length ?? 0;

  // Calculate month-over-month changes (simplified)
  const lastMonthClients = 0; // This would need historical data
  const lastMonthInvoices = 0;
  const lastMonthRevenue = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Clients</CardTitle>
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">{totalClients}</div>
          <p className="text-xs text-gray-500">
            {totalClients > lastMonthClients ? "+" : ""}{totalClients - lastMonthClients} from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Invoices</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{totalInvoices}</div>
          <p className="text-xs text-gray-500">
            {totalInvoices > lastMonthInvoices ? "+" : ""}{totalInvoices - lastMonthInvoices} from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Revenue</CardTitle>
          <div className="p-2 bg-teal-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-teal-600">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-500">
            {totalRevenue > lastMonthRevenue ? "+" : ""}{((totalRevenue - lastMonthRevenue) / (lastMonthRevenue || 1) * 100).toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Pending Invoices</CardTitle>
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{pendingInvoices}</div>
          <p className="text-xs text-gray-500">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            Manage Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Add new clients and manage your existing client relationships.
          </p>
          <div className="flex gap-3">
            <Button 
              asChild
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Link href="/dashboard/clients">
                View All Clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Create Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Generate professional invoices and track payments.
          </p>
          <div className="flex gap-3">
            <Button 
              asChild
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
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
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-emerald-700">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentInvoices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">No recent activity</p>
            <p className="text-sm">Start by adding your first client or creating an invoice</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">
                      {invoice.client?.name ?? "Unknown Client"} • ${invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    invoice.status === "paid" ? "bg-green-100 text-green-800" :
                    invoice.status === "sent" ? "bg-blue-100 text-blue-800" :
                    invoice.status === "overdue" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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