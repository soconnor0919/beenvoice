import { type RouterOutputs } from "~/trpc/react";

// Dashboard stats type from the dashboard router
export type DashboardStats = RouterOutputs["dashboard"]["getStats"];

// Individual invoice type from the invoices router
export type Invoice = RouterOutputs["invoices"]["getAll"][number];

// Recent invoice type (includes client relation)
export type RecentInvoice = DashboardStats["recentInvoices"][number];

// Revenue chart data point
export type RevenueChartDataPoint = DashboardStats["revenueChartData"][number];
