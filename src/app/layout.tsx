import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Azeret_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "beenvoice - Invoicing Made Simple",
  description:
    "Simple and efficient invoicing for freelancers and small businesses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${azeretMono.variable}`}>
      <body className="bg-gradient-dashboard bg-radial-overlay relative min-h-screen overflow-x-hidden font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
