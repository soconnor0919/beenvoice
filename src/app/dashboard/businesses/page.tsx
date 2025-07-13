import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { BusinessesTable } from "./_components/businesses-table";

export default async function BusinessesPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400">
            Businesses
          </h1>
          <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
            Manage your businesses and their information.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
        >
          <Link href="/dashboard/businesses/new">
            <Plus className="mr-2 h-5 w-5" /> Add Business
          </Link>
        </Button>
      </div>
      <HydrateClient>
        <BusinessesTable />
      </HydrateClient>
    </div>
  );
}
