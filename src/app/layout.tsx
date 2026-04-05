import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { AnimationPreferencesProvider } from "~/components/providers/animation-preferences-provider";


import { UmamiScript } from "~/components/analytics/umami-script";

export const metadata: Metadata = {
  title: "beenvoice - Invoicing Made Simple",
  description:
    "Simple and efficient invoicing for freelancers and small businesses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
    >
      <body className="bg-background text-foreground relative min-h-screen overflow-x-hidden font-sans antialiased">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="w-[800px] h-[800px] bg-neutral-400/40 dark:bg-neutral-500/30 rounded-full blur-3xl animate-blob"></div>
        </div>

        <TRPCReactProvider>
          <AnimationPreferencesProvider>
            <div className="relative z-10">
              {children}
            </div>
          </AnimationPreferencesProvider>
          <Toaster />
          <UmamiScript />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
