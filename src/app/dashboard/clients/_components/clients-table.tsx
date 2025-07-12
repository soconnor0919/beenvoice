"use client";

import { api } from "~/trpc/react";
import { UniversalTable } from "~/components/ui/universal-table";
import { TableSkeleton } from "~/components/ui/skeleton";

export function ClientsTable() {
  const { isLoading } = api.clients.getAll.useQuery();

  if (isLoading) {
    return <TableSkeleton rows={8} />;
  }

  return <UniversalTable resource="clients" />;
} 