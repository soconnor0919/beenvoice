"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  FileText,
  Clock,
  Plus,
  Edit,
  Eye,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";

export function CurrentOpenInvoiceCard() {
  const { data: currentInvoice, isLoading } =
    api.invoices.getCurrentOpen.useQuery();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <Card className="card-primary">
        <CardHeader className="pb-3">
          <CardTitle className="card-title-secondary">
            <FileText className="text-icon-emerald h-5 w-5" />
            Current Open Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentInvoice) {
    return (
      <Card className="card-primary">
        <CardHeader className="pb-3">
          <CardTitle className="card-title-secondary">
            <FileText className="text-icon-emerald h-5 w-5" />
            Current Open Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="py-6 text-center">
            <FileText className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
            <p className="text-muted-foreground mb-4 text-sm">
              No open invoice found. Create a new invoice to start tracking your
              time.
            </p>
            <Button asChild variant="brand">
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Invoice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalHours =
    currentInvoice.items?.reduce((sum, item) => sum + item.hours, 0) ?? 0;
  const totalAmount = currentInvoice.totalAmount;

  return (
    <Card className="card-primary">
      <CardHeader className="pb-3">
        <CardTitle className="card-title-secondary">
          <FileText className="text-icon-emerald h-5 w-5" />
          Current Open Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="badge-secondary text-xs">
                {currentInvoice.invoiceNumber}
              </Badge>
              <Badge className="badge-outline text-xs">Draft</Badge>
            </div>
            <div className="text-right">
              <p className="text-icon-emerald text-sm font-medium">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="text-muted-foreground h-3 w-3" />
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{currentInvoice.client?.name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-3 w-3" />
              <span className="text-muted-foreground">Due:</span>
              <span className="font-medium">
                {formatDate(currentInvoice.dueDate)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-3 w-3" />
              <span className="text-muted-foreground">Hours:</span>
              <span className="font-medium">{totalHours.toFixed(1)}h</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/invoices/${currentInvoice.id}`}>
              <Eye className="mr-2 h-3 w-3" />
              View
            </Link>
          </Button>
          <Button asChild variant="brand" size="sm" className="flex-1">
            <Link href={`/dashboard/invoices/${currentInvoice.id}/edit`}>
              <Edit className="mr-2 h-3 w-3" />
              Continue
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
