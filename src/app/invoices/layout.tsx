import { Navbar } from "~/components/layout/navbar";
import { Sidebar } from "~/components/layout/sidebar";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="bg-background min-h-screen flex-1">{children}</main>
      </div>
    </>
  );
}
