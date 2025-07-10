import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "beenvoice - Invoicing Made Simple",
  description: "Simple and efficient invoicing for freelancers and small businesses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}> 
      <body className="relative min-h-screen font-sans antialiased overflow-x-hidden bg-gradient-to-br from-emerald-100 via-white via-60% to-teal-100 before:content-[''] before:fixed before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_80%_0%,rgba(16,185,129,0.10)_0%,transparent_60%)]">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
