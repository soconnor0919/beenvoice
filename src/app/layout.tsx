import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { AnimationPreferencesProvider } from "~/components/providers/animation-preferences-provider";

export const metadata: Metadata = {
  title: "beenvoice - Invoicing Made Simple",
  description:
    "Simple and efficient invoicing for freelancers and small businesses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className={geistMono.variable}>
      <head>
        {/* Inline early animation preference script to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var STORAGE_KEY='bv.animation.prefs';var raw=localStorage.getItem(STORAGE_KEY);var prefersReduced=false;var speed=1;if(raw){try{var parsed=JSON.parse(raw);if(typeof parsed.prefersReducedMotion==='boolean'){prefersReduced=parsed.prefersReducedMotion;}else{prefersReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}if(typeof parsed.animationSpeedMultiplier==='number'){speed=parsed.animationSpeedMultiplier;if(isNaN(speed)||speed<0.25||speed>4)speed=1;}}catch(e){}}else{prefersReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}var root=document.documentElement;if(prefersReduced)root.classList.add('user-reduce-motion');function apply(fast,normal,slow){root.style.setProperty('--animation-speed-fast',fast+'s');root.style.setProperty('--animation-speed-normal',normal+'s');root.style.setProperty('--animation-speed-slow',slow+'s');}if(prefersReduced){apply(0.01,0.01,0.01);}else{var fast=(0.15/speed).toFixed(4);var normal=(0.30/speed).toFixed(4);var slow=(0.50/speed).toFixed(4);apply(fast,normal,slow);}}catch(_e){}})();`,
          }}
        />
      </head>
      <Analytics />
      <body className="bg-background text-foreground relative min-h-screen overflow-x-hidden font-sans antialiased">
        <TRPCReactProvider>
          <AnimationPreferencesProvider>
            {children}
          </AnimationPreferencesProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
