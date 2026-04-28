import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { AnimationPreferencesProvider } from "~/components/providers/animation-preferences-provider";
import { AppearanceProvider } from "~/components/providers/appearance-provider";
import {
  brand,
  defaultBodyFontPreference,
  defaultFontPreference,
  defaultHeadingFontPreference,
  defaultInterfaceTheme,
  defaultRadiusPreference,
  defaultSidebarStyle,
} from "~/lib/branding";

import { UmamiScript } from "~/components/analytics/umami-script";

export const metadata: Metadata = {
  title: `${brand.name} - Invoicing Made Simple`,
  description: brand.tagline,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-interface-theme={defaultInterfaceTheme}
      data-font={defaultFontPreference}
      data-body-font={defaultBodyFontPreference}
      data-heading-font={defaultHeadingFontPreference}
      data-radius={defaultRadiusPreference}
      data-sidebar-style={defaultSidebarStyle}
      data-color-mode="system"
      data-color-theme="slate"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          id="appearance-init"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var defaults = {
                  interfaceTheme: "${defaultInterfaceTheme}",
                  fontPreference: "${defaultFontPreference}",
                  bodyFontPreference: "${defaultBodyFontPreference}",
                  headingFontPreference: "${defaultHeadingFontPreference}",
                  radiusPreference: "${defaultRadiusPreference}",
                  sidebarStyle: "${defaultSidebarStyle}",
                  colorMode: "system",
                  colorTheme: "slate"
                };
                var stored = JSON.parse(localStorage.getItem("bv.appearance") || "{}");
                var appearance = Object.assign(defaults, stored);
                var root = document.documentElement;
                root.dataset.interfaceTheme = appearance.interfaceTheme;
                root.dataset.font = appearance.fontPreference;
                root.dataset.bodyFont = appearance.bodyFontPreference || appearance.fontPreference;
                root.dataset.headingFont = appearance.headingFontPreference || appearance.fontPreference;
                root.dataset.radius = appearance.radiusPreference;
                root.dataset.sidebarStyle = appearance.sidebarStyle;
                root.dataset.colorMode = appearance.colorMode;
                root.dataset.colorTheme = appearance.colorTheme;
                if (appearance.colorMode === "dark") root.classList.add("dark");
                if (appearance.customColor) root.style.setProperty("--custom-primary", appearance.customColor);
              } catch {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground relative min-h-screen overflow-x-hidden font-sans antialiased">
        <div className="brand-background pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="animate-blob h-[800px] w-[800px] rounded-full bg-neutral-400/40 blur-3xl dark:bg-neutral-500/30"></div>
        </div>

        <TRPCReactProvider>
          <AppearanceProvider>
            <AnimationPreferencesProvider>
              <div className="relative z-10">{children}</div>
            </AnimationPreferencesProvider>
          </AppearanceProvider>
          <Toaster />
          <UmamiScript />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
