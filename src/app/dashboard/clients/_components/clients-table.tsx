"use client";

import { api } from "~/trpc/react";
import { DataTableSkeleton } from "~/components/data/data-table";
import { ClientsDataTable } from "./clients-data-table";

export function ClientsTable() {
  const { data: clients, isLoading } = api.clients.getAll.useQuery();

  if (isLoading) {
    return <DataTableSkeleton columns={5} rows={8} />;
  }

  if (!clients) {
    return null;
  }

  return <ClientsDataTable clients={clients} />;
}
