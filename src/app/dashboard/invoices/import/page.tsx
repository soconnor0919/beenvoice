import { HydrateClient } from "~/trpc/server";
import { CSVImportPage } from "~/components/csv-import-page";

export default async function ImportPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
          Import Invoices
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Upload CSV files to create invoices in batch.
        </p>
      </div>

      <HydrateClient>
        <CSVImportPage />
      </HydrateClient>
    </div>
  );
}
