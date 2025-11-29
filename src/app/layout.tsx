import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { AnimationPreferencesProvider } from "~/components/providers/animation-preferences-provider";

import { ThemeProvider } from "~/components/providers/theme-provider";
import { ColorThemeProvider } from "~/components/providers/color-theme-provider";

export const metadata: Metadata = {
  title: "beenvoice - Invoicing Made Simple",
  description:
    "Simple and efficient invoicing for freelancers and small businesses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Inline early theme and animation preference script to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var root = document.documentElement;
                
                // Mode theme persistence (light/dark/system)
                var modeTheme = localStorage.getItem('theme');
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                
                root.classList.remove('light', 'dark');
                
                if (modeTheme === 'dark' || modeTheme === 'light') {
                  root.classList.add(modeTheme);
                } else {
                  // Default to system if no preference or 'system'
                  root.classList.add(systemTheme);
                }
                
                // Color theme persistence (custom accent colors)
                var customColor = localStorage.getItem('customThemeColor');
                var isCustom = localStorage.getItem('isCustomTheme') === 'true';
                
                if (isCustom && customColor) {
                  try {
                    var themeData = JSON.parse(customColor);
                    if (themeData && themeData.colors && themeData.colors.light) {
                      // Apply saved colors directly
                      for (var key in themeData.colors.light) {
                        if (themeData.colors.light.hasOwnProperty(key)) {
                          root.style.setProperty(key, themeData.colors.light[key]);
                        }
                      }
                    }
                  } catch (e) {
                    // Fallback logic omitted for brevity, relying on provider for full recovery
                  }
                } else {
                  // Apply preset color theme
                  var colorTheme = localStorage.getItem('color-theme');
                  if (colorTheme) {
                    root.classList.add(colorTheme);
                  } else {
                    root.classList.add('slate'); // Default
                  }
                }
                
                // Animation preferences script (existing)
                var STORAGE_KEY='bv.animation.prefs';
                var raw=localStorage.getItem(STORAGE_KEY);
                var prefersReduced=false;
                var speed=1;
                if(raw){
                  try{
                    var parsed=JSON.parse(raw);
                    if(typeof parsed.prefersReducedMotion==='boolean'){
                      prefersReduced=parsed.prefersReducedMotion;
                    }else{
                      prefersReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    }
                    if(typeof parsed.animationSpeedMultiplier==='number'){
                      speed=parsed.animationSpeedMultiplier;
                      if(isNaN(speed)||speed<0.25||speed>4)speed=1;
                    }
                  }catch(e){}
                }else{
                  prefersReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                }
                
                if(prefersReduced)root.classList.add('user-reduce-motion');
                function apply(fast,normal,slow){
                  root.style.setProperty('--animation-speed-fast',fast+'s');
                  root.style.setProperty('--animation-speed-normal',normal+'s');
                  root.style.setProperty('--animation-speed-slow',slow+'s');
                }
                if(prefersReduced){
                  apply(0.01,0.01,0.01);
                }else{
                  var fast=(0.15/speed).toFixed(4);
                  var normal=(0.30/speed).toFixed(4);
                  var slow=(0.50/speed).toFixed(4);
                  apply(fast,normal,slow);
                }
              } catch(_e) {}
            })();`,
          }}
        />
      </head>
      <Analytics />
      <body className="bg-background text-foreground relative min-h-screen overflow-x-hidden font-sans antialiased">
        <ThemeProvider>
          <ColorThemeProvider>
            <TRPCReactProvider>
              <AnimationPreferencesProvider>
                {children}
              </AnimationPreferencesProvider>
              <Toaster />
            </TRPCReactProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
