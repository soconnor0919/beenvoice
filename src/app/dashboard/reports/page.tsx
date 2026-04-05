"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import { PageHeader } from "~/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { StatusBadge } from "~/components/data/status-badge";
import { formatCurrency } from "~/lib/currency";
import { getEffectiveInvoiceStatus } from "~/lib/invoice-status";
import type { StoredInvoiceStatus } from "~/types/invoice";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react";

export default function ReportsPage() {
  const { data: invoices = [], isLoading } = api.invoices.getAll.useQuery();
  const { data: stats } = api.dashboard.getStats.useQuery();

  const now = new Date();

  const reportData = useMemo(() => {
    if (!invoices.length) return null;

    // Revenue by month (last 12 months)
    const monthMap: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = 0;
    }

    let totalRevenue = 0;
    let totalPending = 0;
    let totalHours = 0;
    let overdueCount = 0;

    for (const inv of invoices) {
      const status = getEffectiveInvoiceStatus(inv.status as StoredInvoiceStatus, inv.dueDate);
      if (status === "paid") {
        totalRevenue += inv.totalAmount;
        const key = `${new Date(inv.issueDate).getFullYear()}-${String(new Date(inv.issueDate).getMonth() + 1).padStart(2, "0")}`;
        if (monthMap[key] !== undefined) monthMap[key] += inv.totalAmount;
      } else if (status === "sent" || status === "overdue") {
        totalPending += inv.totalAmount;
      }
      if (status === "overdue") overdueCount++;
      totalHours += (inv.items ?? []).reduce((s, item) => s + item.hours, 0);
    }

    const revenueByMonth = Object.entries(monthMap).map(([month, revenue]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      revenue,
    }));

    // Top clients by revenue (paid only)
    const clientMap: Record<string, { name: string; revenue: number; count: number }> = {};
    for (const inv of invoices) {
      const status = getEffectiveInvoiceStatus(inv.status as StoredInvoiceStatus, inv.dueDate);
      if (status === "paid" && inv.client) {
        const id = inv.client.id;
        if (!clientMap[id]) clientMap[id] = { name: inv.client.name, revenue: 0, count: 0 };
        clientMap[id]!.revenue += inv.totalAmount;
        clientMap[id]!.count += 1;
      }
    }
    const topClients = Object.values(clientMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    // Status breakdown
    const statusCount: Record<string, number> = { draft: 0, sent: 0, paid: 0, overdue: 0 };
    for (const inv of invoices) {
      const s = getEffectiveInvoiceStatus(inv.status as StoredInvoiceStatus, inv.dueDate);
      statusCount[s] = (statusCount[s] ?? 0) + 1;
    }

    return { revenueByMonth, topClients, totalRevenue, totalPending, totalHours, overdueCount, statusCount };
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="page-enter space-y-6">
        <PageHeader title="Reports" description="Revenue and invoice analytics" variant="gradient" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  const avgInvoice = invoices.length > 0 ? (reportData?.totalRevenue ?? 0) / invoices.filter((i) => getEffectiveInvoiceStatus(i.status as StoredInvoiceStatus, i.dueDate) === "paid").length || 0 : 0;

  return (
    <div className="page-enter space-y-6 pb-6">
      <PageHeader title="Reports" description="Revenue and invoice analytics" variant="gradient" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded p-1.5">
                <DollarSign className="text-primary h-4 w-4" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">Total Revenue</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(reportData?.totalRevenue ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/10 rounded p-1.5">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">Pending</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(reportData?.totalPending ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/10 rounded p-1.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">Avg Invoice</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(isNaN(avgInvoice) ? 0 : avgInvoice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500/10 rounded p-1.5">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">Total Hours</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{(reportData?.totalHours ?? 0).toFixed(1)}h</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Revenue (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData?.revenueByMonth ?? []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 36%)" fill="url(#revenueGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Top Clients by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!reportData?.topClients.length ? (
              <p className="text-muted-foreground py-6 text-center text-sm">No paid invoices yet.</p>
            ) : (
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.topClients} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(reportData?.statusCount ?? {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status as never} />
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-2 w-24 overflow-hidden rounded-full sm:w-32">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${invoices.length ? (count / invoices.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-8 text-right text-sm">{count}</span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <p className="text-muted-foreground py-6 text-center text-sm">No invoices yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly stats table */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {stats.recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{inv.client?.name ?? "—"}</p>
                    <p className="text-muted-foreground text-xs">{new Date(inv.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={getEffectiveInvoiceStatus(inv.status as StoredInvoiceStatus, inv.dueDate) as never} />
                    <p className="font-semibold">{formatCurrency(inv.totalAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
