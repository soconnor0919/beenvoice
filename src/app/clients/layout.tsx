import { Navbar } from "~/components/layout/navbar";
import { Sidebar } from "~/components/layout/sidebar";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen bg-background">
          {children}
        </main>
      </div>
    </>
  );
}
