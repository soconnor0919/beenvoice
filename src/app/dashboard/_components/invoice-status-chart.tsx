"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAnimationPreferences } from "~/components/providers/animation-preferences-provider";
import { getEffectiveInvoiceStatus } from "~/lib/invoice-status";
import type { StoredInvoiceStatus } from "~/types/invoice";

interface Invoice {
  id: string;
  totalAmount: number;
  status: string;
  dueDate: Date | string;
}

interface InvoiceStatusChartProps {
  invoices: Invoice[];
}

export function InvoiceStatusChart({ invoices }: InvoiceStatusChartProps) {
  // Process invoice data to create status breakdown
  const statusData = invoices.reduce(
    (acc, invoice) => {
      const effectiveStatus = getEffectiveInvoiceStatus(
        invoice.status as StoredInvoiceStatus,
        invoice.dueDate,
      );

      acc[effectiveStatus] ??= {
        status: effectiveStatus,
        count: 0,
        value: 0,
      };

      acc[effectiveStatus].count += 1;
      acc[effectiveStatus].value += invoice.totalAmount;

      return acc;
    },
    {} as Record<string, { status: string; count: number; value: number }>,
  );

  const chartData = Object.values(statusData).map((item) => ({
    ...item,
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
  }));

  // Use theme-aware colors
  const COLORS = {
    draft: "hsl(0, 0%, 60%)", // neutral grey - matches monthly metrics chart
    sent: "hsl(217, 91%, 60%)", // vibrant blue
    pending: "hsl(217, 91%, 60%)", // blue
    paid: "hsl(142, 71%, 45%)", // vibrant green
    overdue: "hsl(var(--destructive))", // red
  };
  // Animation / motion preferences
  const { prefersReducedMotion, animationSpeedMultiplier } =
    useAnimationPreferences();
  const pieAnimationDuration = Math.round(
    600 / (animationSpeedMultiplier || 1),
  );

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
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { name: string; count: number; value: number };
    }>;
  }) => {
    if (active && payload?.length) {
      const data = payload[0]!.payload;
      return (
        <div className="bg-card border-border rounded-lg border p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.count} invoice{data.count !== 1 ? "s" : ""}
          </p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
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
            No invoice data available
          </p>
          <p className="text-muted-foreground text-xs">
            Status breakdown will appear here once you create invoices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              stroke="none"
              dataKey="count"
              isAnimationActive={!prefersReducedMotion}
              animationDuration={pieAnimationDuration}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.status as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[item.status as keyof typeof COLORS],
                }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{item.count}</p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
