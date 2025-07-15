"use client";

import { api } from "~/trpc/react";
import { DataTableSkeleton } from "~/components/ui/data-table";
import { BusinessesDataTable } from "./businesses-data-table";

export function BusinessesTable() {
  const { data: businesses, isLoading } = api.businesses.getAll.useQuery();

  if (isLoading) {
    return <DataTableSkeleton columns={6} rows={8} />;
  }

  if (!businesses) {
    return null;
  }

  return <BusinessesDataTable businesses={businesses} />;
}
