"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getEffectiveInvoiceStatus } from "~/lib/invoice-status";
import type { StoredInvoiceStatus } from "~/types/invoice";

interface Invoice {
  id: string;
  totalAmount: number;
  issueDate: Date | string;
  status: string;
  dueDate: Date | string;
}

interface RevenueChartProps {
  invoices: Invoice[];
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  // Process invoice data to create monthly revenue data
  const monthlyData = invoices
    .filter(
      (invoice) =>
        getEffectiveInvoiceStatus(
          invoice.status as StoredInvoiceStatus,
          invoice.dueDate,
        ) === "paid",
    )
    .reduce(
      (acc, invoice) => {
        const date = new Date(invoice.issueDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        acc[monthKey] ??= {
          month: monthKey,
          revenue: 0,
          count: 0,
        };

        acc[monthKey].revenue += invoice.totalAmount;
        acc[monthKey].count += 1;

        return acc;
      },
      {} as Record<string, { month: string; revenue: number; count: number }>,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { revenue: number; count: number } }>;
    label?: string;
  }) => {
    if (active && payload?.length) {
      const data = payload[0]!.payload;
      return (
        <div className="bg-card border-border rounded-lg border p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p style={{ color: "hsl(0, 0%, 60%)" }}>
            Revenue: {formatCurrency(data.revenue)}
          </p>
          <p className="text-muted-foreground text-sm">
            {data.count} invoice{data.count !== 1 ? "s" : ""}
          </p>
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
            No revenue data available
          </p>
          <p className="text-muted-foreground text-xs">
            Revenue will appear here once you have paid invoices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 0%, 60%)" stopOpacity={0.4} />
              <stop
                offset="95%"
                stopColor="hsl(0, 0%, 60%)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
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
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(0, 0%, 60%)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
