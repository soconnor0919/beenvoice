import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import {
  DashboardStats,
  DashboardCards,
  DashboardActivity,
} from "./_components/dashboard-components";
import { DashboardPageHeader } from "~/components/page-header";
import { PageContent, PageSection } from "~/components/ui/page-layout";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <PageContent>
      <DashboardPageHeader
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] ?? "User"}!`}
        description="Here's what's happening with your invoicing business"
      />

      <HydrateClient>
        <PageSection>
          <DashboardStats />
        </PageSection>

        <PageSection>
          <DashboardCards />
        </PageSection>

        <PageSection>
          <DashboardActivity />
        </PageSection>
      </HydrateClient>
    </PageContent>
  );
}
