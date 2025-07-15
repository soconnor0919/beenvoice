import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export function InvoiceDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 xl:col-span-2">
          {/* Invoice Header Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <Skeleton className="h-6 w-48 sm:h-8" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="mt-1 h-4 w-64" />
                </div>
                <div className="text-left sm:text-right">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-1 h-6 w-24 sm:h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Business Information Skeleton */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Skeleton className="h-5 w-32 sm:h-6" />
                  <div className="space-y-2 sm:space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2 sm:gap-3">
                        <Skeleton className="h-6 w-6 rounded-lg sm:h-8 sm:w-8" />
                        <Skeleton className="h-3 w-28 sm:h-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice Items Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                <Skeleton className="h-5 w-28 sm:h-6" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b">
                      {["Date", "Description", "Hours", "Rate", "Amount"].map(
                        (header) => (
                          <th key={header} className="p-2 text-left sm:p-4">
                            <Skeleton className="h-3 w-16 sm:h-4" />
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-2 sm:p-4">
                          <Skeleton className="h-3 w-20 sm:h-4" />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Skeleton className="h-3 w-48 sm:h-4" />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Skeleton className="h-3 w-12 sm:h-4" />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Skeleton className="h-3 w-16 sm:h-4" />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Skeleton className="h-3 w-20 sm:h-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section Skeleton */}
              <div className="bg-muted/20 border-t p-3 sm:p-4">
                <div className="flex justify-end">
                  <div className="w-full max-w-64 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 sm:h-4" />
                      <Skeleton className="h-3 w-20 sm:h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20 sm:h-4" />
                      <Skeleton className="h-3 w-20 sm:h-4" />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12 sm:h-6" />
                      <Skeleton className="h-4 w-24 sm:h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-16 sm:h-6" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full sm:h-4" />
                <Skeleton className="h-3 w-3/4 sm:h-4" />
                <Skeleton className="h-3 w-1/2 sm:h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          {/* Actions Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-16 sm:h-6" />
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full sm:h-10" />
              ))}
            </CardContent>
          </Card>

          {/* Details Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                <Skeleton className="h-5 w-16 sm:h-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16 sm:h-4" />
                    <Skeleton className="h-3 w-20 sm:h-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Skeleton */}
          <Card className="border-red-200 shadow-sm dark:border-red-800">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24 sm:h-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full sm:h-10" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
