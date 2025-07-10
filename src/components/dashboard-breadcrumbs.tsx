"use client";

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";
import { api } from "~/trpc/react";

function isUUID(str: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Find clientId if present
  let clientId: string | undefined = undefined;
  if (segments[1] === "clients" && segments[2] && isUUID(segments[2])) {
    clientId = segments[2];
  }
  const { data: client } = api.clients.getById.useQuery(
    { id: clientId ?? "" },
    { enabled: !!clientId }
  );

  // Generate breadcrumb items based on pathname
  const breadcrumbs = React.useMemo(() => {
    const items = [];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const path = `/${segments.slice(0, i + 1).join('/')}`;
      if (segment === 'dashboard') continue;
      let label = segment;
      if (segment === 'clients') label = 'Clients';
      if (isUUID(segment ?? "") && client) label = client.name ?? "";
      if (segment === 'invoices') label = 'Invoices';
      if (segment === 'new') label = 'New';
      // Only show 'Edit' if not the last segment
      if (segment === 'edit' && i !== segments.length - 1) label = 'Edit';
      // Don't show 'edit' as the last breadcrumb, just show the client name
      if (segment === 'edit' && i === segments.length - 1 && client) continue;
      if (segment === 'import') label = 'Import';
      items.push({
        label,
        href: path,
        isLast: i === segments.length - 1 || (segment === 'edit' && i === segments.length - 1 && client),
      });
    }
    return items;
  }, [segments, client]);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 