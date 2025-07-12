import { Navbar } from "~/components/Navbar";
import { Sidebar } from "~/components/Sidebar";
import { DashboardBreadcrumbs } from "~/components/dashboard-breadcrumbs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      {/* Mobile layout - no left margin */}
      <main className="min-h-screen pt-24 md:hidden">
        <div className="px-4 sm:px-6 pt-4 pb-6">
          <DashboardBreadcrumbs />
          {children}
        </div>
      </main>
      {/* Desktop layout - with sidebar margin */}
      <main className="min-h-screen pt-24 hidden md:block ml-70">
        <div className="px-8 pt-6 pb-6">
          <DashboardBreadcrumbs />
          {children}
        </div>
      </main>
    </>
  );
} 