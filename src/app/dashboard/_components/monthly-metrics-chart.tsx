"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getEffectiveInvoiceStatus } from "~/lib/invoice-status";
import type { StoredInvoiceStatus } from "~/types/invoice";
import { useAnimationPreferences } from "~/components/providers/animation-preferences-provider";

interface Invoice {
  id: string;
  totalAmount: number;
  issueDate: Date | string;
  status: string;
  dueDate: Date | string;
}

interface MonthlyMetricsChartProps {
  invoices: Invoice[];
}

export function MonthlyMetricsChart({ invoices }: MonthlyMetricsChartProps) {
  // Process invoice data to create monthly metrics
  const monthlyData = invoices.reduce(
    (acc, invoice) => {
      const date = new Date(invoice.issueDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const effectiveStatus = getEffectiveInvoiceStatus(
        invoice.status as StoredInvoiceStatus,
        invoice.dueDate,
      );

      acc[monthKey] ??= {
        month: monthKey,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        draftInvoices: 0,
      };

      acc[monthKey].totalInvoices += 1;

      switch (effectiveStatus) {
        case "paid":
          acc[monthKey].paidInvoices += 1;
          break;
        case "sent":
          acc[monthKey].pendingInvoices += 1;
          break;
        case "overdue":
          acc[monthKey].overdueInvoices += 1;
          break;
        case "draft":
          acc[monthKey].draftInvoices += 1;
          break;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        month: string;
        totalInvoices: number;
        paidInvoices: number;
        pendingInvoices: number;
        overdueInvoices: number;
        draftInvoices: number;
      }
    >,
  );

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Show last 6 months
    .map((item) => ({
      ...item,
      monthLabel: new Date(item.month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
    }));

  // Animation / motion preferences
  const { prefersReducedMotion, animationSpeedMultiplier } =
    useAnimationPreferences();
  const barAnimationDuration = Math.round(
    500 / (animationSpeedMultiplier || 1),
  );

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        paidInvoices: number;
        pendingInvoices: number;
        overdueInvoices: number;
        draftInvoices: number;
        totalInvoices: number;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload?.length) {
      const data = payload[0]!.payload;
      return (
        <div className="bg-card border-border rounded-lg border p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-primary font-medium">Paid: {data.paidInvoices}</p>
            <p className="text-primary/80">
              Pending: {data.pendingInvoices}
            </p>
            <p className="text-destructive">
              Overdue: {data.overdueInvoices}
            </p>
            <p className="text-muted-foreground">
              Draft: {data.draftInvoices}
            </p>
            <p className="text-foreground font-medium border-t pt-1">
              Total: {data.totalInvoices}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            No metrics data available
          </p>
          <p className="text-muted-foreground text-xs">
            Monthly metrics will appear here once you create invoices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="monthLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="draftInvoices"
              stackId="a"
              fill="hsl(0, 0%, 60%)"
              radius={[0, 0, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={barAnimationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="paidInvoices"
              stackId="a"
              fill="hsl(142, 71%, 45%)"
              radius={[0, 0, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={barAnimationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="pendingInvoices"
              stackId="a"
              fill="hsl(217, 91%, 60%)"
              fillOpacity={0.6}
              radius={[0, 0, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={barAnimationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="overdueInvoices"
              stackId="a"
              fill="hsl(var(--destructive))"
              radius={[2, 2, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={barAnimationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <div className="flex items-center space-x-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "hsl(0, 0%, 60%)" }}
          />
          <span className="text-xs">Draft</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "hsl(142, 71%, 45%)" }}
          />
          <span className="text-xs">Paid</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "hsl(217, 91%, 60%)", opacity: 0.6 }}
          />
          <span className="text-xs">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="h-3 w-3 rounded-full bg-destructive"
          />
          <span className="text-xs">Overdue</span>
        </div>
      </div>
    </div>
  );
}
