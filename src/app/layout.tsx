import "~/styles/globals.css";

import { type Metadata } from "next";
import localFont from "next/font/local";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { AnimationPreferencesProvider } from "~/components/providers/animation-preferences-provider";
import { AppearanceProvider } from "~/components/providers/appearance-provider";
import {
  brand,
  defaultBodyFontPreference,
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

const geistSans = localFont({
  src: "../../public/fonts/geist/sans/Geist-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  display: "swap",
});

const playfair = localFont({
  src: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-playfair",
  display: "swap",
});

const frutiger = localFont({
  src: [
    {
      path: "../../public/fonts/frutiger/Frutiger.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/frutiger/Frutiger_bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-frutiger",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/geist/mono/GeistMono-VariableFont_wght.ttf",
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
      data-body-font={defaultBodyFontPreference}
      data-heading-font={defaultHeadingFontPreference}
      data-radius={defaultRadiusPreference}
      data-sidebar-style={defaultSidebarStyle}
      data-color-mode="system"
      data-color-theme="slate"
      className={`${geistSans.variable} ${playfair.variable} ${frutiger.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          id="appearance-init"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var defaults = {
                  interfaceTheme: "${defaultInterfaceTheme}",
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
                root.dataset.bodyFont = appearance.bodyFontPreference;
                root.dataset.headingFont = appearance.headingFontPreference;
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
