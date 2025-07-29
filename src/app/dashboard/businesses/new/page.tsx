import { BusinessForm } from "~/components/forms/business-form";
import { HydrateClient } from "~/trpc/server";

export default function NewBusinessPage() {
  return (
    <HydrateClient>
      <BusinessForm mode="create" />
    </HydrateClient>
  );
}
