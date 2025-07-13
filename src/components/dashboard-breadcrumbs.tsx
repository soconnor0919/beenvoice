"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { Skeleton } from "~/components/ui/skeleton";

function isUUID(str: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    str,
  );
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Find clientId if present
  let clientId: string | undefined = undefined;
  if (segments[1] === "clients" && segments[2] && isUUID(segments[2])) {
    clientId = segments[2];
  }
  const { data: client, isLoading: clientLoading } =
    api.clients.getById.useQuery(
      { id: clientId ?? "" },
      { enabled: !!clientId },
    );

  // Find invoiceId if present
  let invoiceId: string | undefined = undefined;
  if (segments[1] === "invoices" && segments[2] && isUUID(segments[2])) {
    invoiceId = segments[2];
  }
  const { data: invoice, isLoading: invoiceLoading } =
    api.invoices.getById.useQuery(
      { id: invoiceId ?? "" },
      { enabled: !!invoiceId },
    );

  // Generate breadcrumb items based on pathname
  const breadcrumbs = React.useMemo(() => {
    const items = [];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const path = `/${segments.slice(0, i + 1).join("/")}`;
      if (segment === "dashboard") continue;

      let label: string | React.ReactElement = segment ?? "";
      if (segment === "clients") label = "Clients";
      if (isUUID(segment ?? "") && clientLoading)
        label = <Skeleton className="inline-block h-5 w-24 align-middle" />;
      else if (isUUID(segment ?? "") && client) label = client.name ?? "";
      if (isUUID(segment ?? "") && invoiceLoading)
        label = <Skeleton className="inline-block h-5 w-24 align-middle" />;
      else if (isUUID(segment ?? "") && invoice) {
        const issueDate = new Date(invoice.issueDate);
        label = format(issueDate, "MMM dd, yyyy");
      }
      if (segment === "invoices") label = "Invoices";
      if (segment === "new") label = "New";
      // Only show 'Edit' if not the last segment
      if (segment === "edit" && i !== segments.length - 1) label = "Edit";
      // Don't show 'edit' as the last breadcrumb, just show the client name
      if (segment === "edit" && i === segments.length - 1 && client) continue;
      if (segment === "import") label = "Import";
      items.push({
        label,
        href: path,
        isLast:
          i === segments.length - 1 ||
          (segment === "edit" && i === segments.length - 1 && client),
      });
    }
    return items;
  }, [segments, client, invoice, clientLoading, invoiceLoading]);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className="mb-4 sm:mb-6">
      <BreadcrumbList className="flex-wrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/dashboard"
              className="text-sm sm:text-base dark:text-gray-300"
            >
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="text-sm sm:text-base dark:text-white">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={crumb.href}
                    className="text-sm sm:text-base dark:text-gray-300"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
