import { Navbar } from "~/components/Navbar";
import { Sidebar } from "~/components/Sidebar";

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