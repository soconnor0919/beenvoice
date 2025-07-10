import { Navbar } from "~/components/Navbar";
import { Sidebar } from "~/components/Sidebar";
import { DashboardBreadcrumbs } from "~/components/dashboard-breadcrumbs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="min-h-screen pt-24 ml-70">
        <div className="px-8 pt-6 pb-6">
          <DashboardBreadcrumbs />
          {children}
        </div>
      </main>
    </>
  );
} 