import Link from "next/link";
import { BusinessForm } from "~/components/forms/business-form";
import { PageHeader } from "~/components/layout/page-header";
import { HydrateClient } from "~/trpc/server";

export default function NewBusinessPage() {
  return (
    <div>
      <PageHeader
        title="Add Business"
        description="Enter business details below to add a new business."
        variant="gradient"
      />

      <HydrateClient>
        <BusinessForm mode="create" />
      </HydrateClient>
    </div>
  );
}
