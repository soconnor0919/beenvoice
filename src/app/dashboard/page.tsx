import { Suspense } from "react";
import { HydrateClient, api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { auth } from "~/server/auth";
import Link from "next/link";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Calendar,
  Clock,
  Eye,
  Edit,
  Activity,
  BarChart3,
} from "lucide-react";

// Modern gradient background component
function DashboardHero({ firstName }: { firstName: string }) {
  return (
    <Card className="relative mb-8 overflow-hidden border-0 p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute inset-0" />
      <div className="relative z-10">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {firstName}!</h1>
        <p className="text-lg">Ready to manage your invoicing business</p>
      </div>
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5" />
    </Card>
  );
}

// Enhanced stats cards with better visual hierarchy
async function DashboardStats() {
  const [clients, invoices] = await Promise.all([
    api.clients.getAll(),
    api.invoices.getAll(),
  ]);

  const totalClients = clients.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "sent")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "",
      bgColor: "bg-green-50",
      changeColor: "",
    },
    {
      title: "Pending Amount",
      value: `$${pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "+8.2%",
      icon: Clock,
      color: "",
      bgColor: "bg-amber-50",
      changeColor: "",
    },
    {
      title: "Active Clients",
      value: totalClients.toString(),
      change: "+3",
      icon: Users,
      color: "",
      bgColor: "bg-blue-50",
      changeColor: "",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      change: "+15",
      icon: FileText,
      color: "",
      bgColor: "bg-purple-50",
      changeColor: "",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="border-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="mb-2 flex items-center justify-between sm:mb-3 lg:mb-4">
                <div className={`rounded-lg p-1.5 sm:p-2 ${stat.bgColor}`}>
                  <Icon className="h-3 w-3 text-gray-700 sm:h-4 sm:w-4 lg:h-5 lg:w-5 dark:text-gray-800" />
                </div>
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="mb-1 text-base font-bold text-gray-900 sm:text-xl lg:text-2xl dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 lg:text-sm dark:text-gray-300">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Quick Actions with better visual design
function QuickActions() {
  const actions = [
    {
      title: "Create Invoice",
      description: "Start a new invoice",
      href: "/dashboard/invoices/new",
      icon: FileText,
      primary: true,
    },
    {
      title: "Add Client",
      description: "Add a new client",
      href: "/dashboard/clients/new",
      icon: Users,
      primary: false,
    },
    {
      title: "View Reports",
      description: "Business analytics",
      href: "/dashboard/reports",
      icon: BarChart3,
      primary: false,
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              asChild
              variant={action.primary ? "default" : "outline"}
              className={`h-12 w-full justify-start px-3 ${
                action.primary
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              }`}
            >
              <Link href={action.href}>
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${action.primary ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
                  />
                  <span
                    className={`font-medium ${action.primary ? "text-white" : "text-gray-900 dark:text-gray-100"}`}
                  >
                    {action.title}
                  </span>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Current work in progress
async function CurrentWork() {
  const invoices = await api.invoices.getAll();
  const draftInvoices = invoices.filter(
    (invoice) => invoice.status === "draft",
  );
  const currentInvoice = draftInvoices[0];

  if (!currentInvoice) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Current Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              No draft invoices found
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
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

  const totalHours =
    currentInvoice.items?.reduce((sum, item) => sum + item.hours, 0) ?? 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Current Work
        </CardTitle>
        <Badge variant="secondary">In Progress</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                #{currentInvoice.invoiceNumber}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {currentInvoice.client?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                ${currentInvoice.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {totalHours.toFixed(1)} hours
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/dashboard/invoices/${currentInvoice.id}`}>
                <Eye className="mr-2 h-3 w-3" />
                View
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              <Link href={`/dashboard/invoices/${currentInvoice.id}`}>
                <Edit className="mr-2 h-3 w-3" />
                Continue
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent activity with enhanced design
async function RecentActivity() {
  const invoices = await api.invoices.getAll();
  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 border-green-200";
      case "sent":
        return "bg-blue-50 border-blue-200";
      case "overdue":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Recent Activity
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/invoices">
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentInvoices.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              No invoices yet
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Invoice
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="block"
              >
                <Card className="card-secondary transition-colors hover:bg-gray-200/70 dark:hover:bg-gray-700/60">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                          <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            #{invoice.invoiceNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {invoice.client?.name} •{" "}
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="rounded-lg p-1 transition-colors hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
                          <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`border ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </Badge>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          ${invoice.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeletons
function StatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="mb-2 flex items-center justify-between sm:mb-3 lg:mb-4">
              <Skeleton className="h-6 w-6 rounded-lg sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
              <Skeleton className="h-3 w-8 sm:h-4 sm:w-12" />
            </div>
            <Skeleton className="mb-1 h-5 w-16 sm:mb-2 sm:h-6 sm:w-20 lg:h-8" />
            <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "User";

  return (
    <div className="space-y-8">
      <DashboardHero firstName={firstName} />

      <HydrateClient>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </HydrateClient>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <HydrateClient>
          <Suspense fallback={<CardSkeleton />}>
            <CurrentWork />
          </Suspense>
        </HydrateClient>

        <QuickActions />
      </div>

      <HydrateClient>
        <Suspense fallback={<CardSkeleton />}>
          <RecentActivity />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
