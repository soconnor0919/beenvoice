import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {
  DashboardStats,
  DashboardCards,
  DashboardActivity,
} from "./_components/dashboard-components";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "User"}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Here&apos;s what&apos;s happening with your invoicing business
        </p>
      </div>

      <HydrateClient>
        <DashboardStats />
        <DashboardCards />
        <DashboardActivity />
      </HydrateClient>
    </div>
  );
}
