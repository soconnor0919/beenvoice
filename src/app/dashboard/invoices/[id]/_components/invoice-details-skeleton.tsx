import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export function InvoiceDetailsSkeleton() {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="bg-muted/30 h-8 w-48 sm:h-9 sm:w-64" />
          <Skeleton className="bg-muted/30 mt-1 h-4 w-40 sm:w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="bg-muted/30 h-8 w-20 sm:h-9 sm:w-24" />
          <Skeleton className="bg-muted/30 h-8 w-16 sm:h-9 sm:w-20" />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Header Skeleton */}
          <Card className="bg-card border-border border">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Skeleton className="bg-muted/30 h-6 w-40 sm:h-8 sm:w-48" />
                      <Skeleton className="bg-muted/30 h-5 w-16 sm:h-6" />
                    </div>
                    <div className="space-y-1 sm:space-y-0">
                      <Skeleton className="bg-muted/30 h-3 w-32 sm:h-4 sm:w-40" />
                      <Skeleton className="bg-muted/30 h-3 w-28 sm:hidden sm:h-4 sm:w-36" />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Skeleton className="bg-muted/30 h-3 w-20 sm:h-4" />
                    <Skeleton className="bg-muted/30 mt-1 h-6 w-24 sm:h-8 sm:w-28" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Business Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="bg-card border-border border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="bg-muted/30 h-4 w-4 sm:h-5 sm:w-5" />
                    <Skeleton className="bg-muted/30 h-5 w-16 sm:h-6" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="bg-muted/30 h-5 w-32 sm:h-6" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Skeleton className="bg-muted/30 h-8 w-8 " />
                        <Skeleton className="bg-muted/30 h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice Items Skeleton */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="bg-muted/30 h-4 w-4 sm:h-5 sm:w-5" />
                <Skeleton className="bg-muted/30 h-5 w-28 sm:h-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3  border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Skeleton className="bg-muted/30 mb-2 h-4 w-full sm:h-5 sm:w-3/4" />
                      <div className="space-y-1 sm:space-y-0">
                        <Skeleton className="bg-muted/30 h-3 w-20 sm:h-4 sm:w-24" />
                        <Skeleton className="bg-muted/30 h-3 w-16 sm:hidden sm:h-4 sm:w-20" />
                        <Skeleton className="bg-muted/30 h-3 w-24 sm:hidden sm:h-4 sm:w-28" />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <Skeleton className="bg-muted/30 h-4 w-16 sm:h-5 sm:w-20" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="bg-muted/30  p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="bg-muted/30 h-4 w-16" />
                    <Skeleton className="bg-muted/30 h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="bg-muted/30 h-4 w-20" />
                    <Skeleton className="bg-muted/30 h-4 w-16" />
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Skeleton className="bg-muted/30 h-5 w-12" />
                    <Skeleton className="bg-muted/30 h-5 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <Skeleton className="bg-muted/30 h-6 w-16" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="bg-muted/30 h-4 w-full" />
                <Skeleton className="bg-muted/30 h-4 w-3/4" />
                <Skeleton className="bg-muted/30 h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card className="bg-card border-border border sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="bg-muted/30 h-5 w-5" />
                <Skeleton className="bg-muted/30 h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="bg-muted/30 h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
