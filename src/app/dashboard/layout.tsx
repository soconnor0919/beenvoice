import { Navbar } from "~/components/layout/navbar";
import { Sidebar } from "~/components/layout/sidebar";
import { DashboardBreadcrumbs } from "~/components/navigation/dashboard-breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      {/* Mobile layout - no left margin */}
      <main className="min-h-screen pt-20 md:hidden">
        <div className="px-4 pt-4 pb-6 sm:px-6">
          <DashboardBreadcrumbs />
          {children}
        </div>
      </main>
      {/* Desktop layout - with sidebar margin */}
      <main className="hidden min-h-screen pt-20 md:ml-[276px] md:block">
        <div className="px-6 pt-6 pb-6">
          <DashboardBreadcrumbs />
          {children}
        </div>
      </main>
    </>
  );
}
