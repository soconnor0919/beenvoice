import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted/30 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Dashboard skeleton components
export function DashboardStatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-border/40 bg-background/60 rounded-2xl border p-6 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="bg-muted/20 h-4 w-24" />
            <Skeleton className="bg-muted/20 h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="bg-muted/20 mb-2 h-8 w-16" />
          <Skeleton className="bg-muted/20 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function DashboardCardsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="border-border/40 bg-background/60 rounded-2xl border p-6 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="bg-muted/20 h-8 w-8 rounded-lg" />
            <Skeleton className="bg-muted/20 h-6 w-32" />
          </div>
          <Skeleton className="bg-muted/20 mb-4 h-4 w-full" />
          <div className="flex gap-3">
            <Skeleton className="bg-muted/20 h-10 w-24" />
            <Skeleton className="bg-muted/20 h-10 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardActivitySkeleton() {
  return (
    <div className="border-border/40 bg-background/60 rounded-2xl border p-6 shadow-lg backdrop-blur-xl backdrop-saturate-150">
      <Skeleton className="bg-muted/20 mb-6 h-6 w-32" />
      <div className="py-12 text-center">
        <Skeleton className="bg-muted/20 mx-auto mb-4 h-20 w-20 rounded-full" />
        <Skeleton className="bg-muted/20 mx-auto mb-2 h-6 w-48" />
        <Skeleton className="bg-muted/20 mx-auto h-4 w-64" />
      </div>
    </div>
  );
}

// Table skeleton components
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full">
      {/* Controls - matches universal table controls */}
      <div className="border-border/40 bg-background/60 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150">
        {/* Left side - View controls and filters */}
        <div className="flex items-center gap-2">
          <Skeleton className="bg-muted/20 h-10 w-10" />{" "}
          {/* Table view button */}
          <Skeleton className="bg-muted/20 h-10 w-10" />{" "}
          {/* Grid view button */}
          <Skeleton className="bg-muted/20 h-10 w-10" /> {/* Filter button */}
        </div>

        {/* Right side - Search and batch actions */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <Skeleton className="bg-muted/20 h-10 w-48 sm:w-64" />{" "}
          {/* Search input */}
          <Skeleton className="bg-muted/20 h-10 w-10" /> {/* Search button */}
        </div>
      </div>

      {/* Table - matches universal table structure */}
      <div className="bg-background/60 border-border/40 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl backdrop-saturate-150">
        <div className="w-full">
          {/* Table header */}
          <div className="border-border/40 border-b">
            <div className="flex items-center px-4 py-4">
              <div className="w-12 px-4">
                <Skeleton className="bg-muted/20 h-4 w-4" /> {/* Checkbox */}
              </div>
              <div className="flex-1 px-4">
                <Skeleton className="bg-muted/20 h-4 w-16" /> {/* Header 1 */}
              </div>
              <div className="w-32 px-4">
                <Skeleton className="bg-muted/20 h-4 w-20" /> {/* Header 2 */}
              </div>
              <div className="w-32 px-4">
                <Skeleton className="bg-muted/20 h-4 w-16" /> {/* Header 3 */}
              </div>
              <div className="w-32 px-4">
                <Skeleton className="bg-muted/20 h-4 w-20" /> {/* Header 4 */}
              </div>
              <div className="w-8 px-4">
                <Skeleton className="bg-muted/20 h-4 w-4" /> {/* Actions */}
              </div>
            </div>
          </div>

          {/* Table body */}
          <div>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="border-border/40 border-b last:border-b-0"
              >
                <div className="hover:bg-accent/30 flex items-center px-4 py-4 transition-colors">
                  <div className="w-12 px-4">
                    <Skeleton className="bg-muted/20 h-4 w-4" />{" "}
                    {/* Checkbox */}
                  </div>
                  <div className="flex-1 px-4">
                    <Skeleton className="bg-muted/20 h-4 w-full max-w-48" />{" "}
                    {/* Main content */}
                  </div>
                  <div className="w-32 px-4">
                    <Skeleton className="bg-muted/20 h-4 w-24" />{" "}
                    {/* Column 2 */}
                  </div>
                  <div className="w-32 px-4">
                    <Skeleton className="bg-muted/20 h-4 w-20" />{" "}
                    {/* Column 3 */}
                  </div>
                  <div className="w-32 px-4">
                    <Skeleton className="bg-muted/20 h-4 w-16" />{" "}
                    {/* Column 4 */}
                  </div>
                  <div className="w-8 px-4">
                    <Skeleton className="bg-muted/20 h-8 w-8 rounded" />{" "}
                    {/* Actions button */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination - matches universal table pagination */}
      <div className="border-border/40 bg-background/60 mt-4 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150">
        {/* Left side - Page info and items per page */}
        <div className="flex items-center gap-2">
          <Skeleton className="bg-muted/20 h-4 w-40" /> {/* Page info text */}
          <Skeleton className="bg-muted/20 h-8 w-20" />{" "}
          {/* Items per page select */}
        </div>

        {/* Right side - Pagination controls */}
        <div className="flex items-center gap-1">
          <Skeleton className="bg-muted/20 h-8 w-20" /> {/* Previous button */}
          <div className="flex items-center gap-1">
            <Skeleton className="bg-muted/20 h-8 w-8" /> {/* Page 1 */}
            <Skeleton className="bg-muted/20 h-8 w-8" /> {/* Page 2 */}
            <Skeleton className="bg-muted/20 h-8 w-8" /> {/* Page 3 */}
          </div>
          <Skeleton className="bg-muted/20 h-8 w-16" /> {/* Next button */}
        </div>
      </div>
    </div>
  );
}

// Form skeleton components
export function FormSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-24">
      <div className="space-y-4">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="bg-muted/20 h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-6 w-40" />
                <Skeleton className="bg-muted/20 h-4 w-56" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-24" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-20" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="bg-muted/20 h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-6 w-44" />
                <Skeleton className="bg-muted/20 h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-16" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-16" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="bg-muted/20 h-4 w-20" />
              <Skeleton className="bg-muted/20 h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="bg-muted/20 h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-6 w-20" />
                <Skeleton className="bg-muted/20 h-4 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-28" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="bg-muted/20 h-4 w-28" />
                <Skeleton className="bg-muted/20 h-10 w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="bg-muted/20 h-4 w-12" />
                  <Skeleton className="bg-muted/20 h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="bg-muted/20 h-4 w-16" />
                  <Skeleton className="bg-muted/20 h-10 w-full" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="bg-muted/20 h-4 w-20" />
                  <Skeleton className="bg-muted/20 h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="bg-muted/20 h-4 w-20" />
                  <Skeleton className="bg-muted/20 h-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Actions - styled like data table footer */}
      <div className="border-border/40 bg-background/60 fixed right-3 bottom-3 left-3 z-20 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150 md:right-3 md:left-[279px]">
        <Skeleton className="bg-muted/20 h-4 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="bg-muted/20 h-10 w-24" />
          <Skeleton className="bg-muted/20 h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

// Invoice view skeleton
export function InvoiceViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="bg-muted/20 h-8 w-48" />
          <Skeleton className="bg-muted/20 h-4 w-64" />
        </div>
        <Skeleton className="bg-muted/20 h-10 w-32" />
      </div>

      {/* Client info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="bg-muted/20 h-5 w-24" />
          <Skeleton className="bg-muted/20 h-4 w-full" />
          <Skeleton className="bg-muted/20 h-4 w-3/4" />
          <Skeleton className="bg-muted/20 h-4 w-1/2" />
        </div>
        <div className="space-y-3">
          <Skeleton className="bg-muted/20 h-5 w-24" />
          <Skeleton className="bg-muted/20 h-4 w-full" />
          <Skeleton className="bg-muted/20 h-4 w-3/4" />
        </div>
      </div>

      {/* Items table */}
      <div className="border-border bg-card rounded-lg border">
        <div className="border-border border-b p-4">
          <Skeleton className="bg-muted/20 h-5 w-32" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="bg-muted/20 h-4 w-20" />
                <Skeleton className="bg-muted/20 h-4 flex-1" />
                <Skeleton className="bg-muted/20 h-4 w-16" />
                <Skeleton className="bg-muted/20 h-4 w-20" />
                <Skeleton className="bg-muted/20 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="space-y-2">
          <Skeleton className="bg-muted/20 h-6 w-32" />
          <Skeleton className="bg-muted/20 h-8 w-40" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
