"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      closeButton
      richColors={false}
      expand={true}
      duration={4000}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--card))",
          "--success-text": "hsl(var(--foreground))",
          "--success-border": "hsl(142 76% 36%)",
          "--error-bg": "hsl(var(--card))",
          "--error-text": "hsl(var(--foreground))",
          "--error-border": "hsl(0 84% 60%)",
          "--warning-bg": "hsl(var(--card))",
          "--warning-text": "hsl(var(--foreground))",
          "--warning-border": "hsl(38 92% 50%)",
          "--info-bg": "hsl(var(--card))",
          "--info-text": "hsl(var(--foreground))",
          "--info-border": "hsl(221 83% 53%)",
          backgroundColor: "hsl(var(--card))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-none group-[.toaster]:font-mono !bg-card",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:rounded-none group-[.toast]:border-none group-[.toast]:font-mono group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:rounded-none group-[.toast]:border group-[.toast]:border-border group-[.toast]:font-mono",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:rounded-none group-[.toast]:absolute group-[.toast]:top-1/2 group-[.toast]:right-2 group-[.toast]:-translate-y-1/2 group-[.toast]:w-5 group-[.toast]:h-5 group-[.toast]:flex-shrink-0",
          success:
            "group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:border-l-4 group-[.toaster]:border-l-green-500 group-[.toaster]:shadow-lg",
          error:
            "group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500 group-[.toaster]:shadow-lg",
          warning:
            "group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:border-l-4 group-[.toaster]:border-l-yellow-500 group-[.toaster]:shadow-lg",
          info: "group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:border-l-4 group-[.toaster]:border-l-blue-500 group-[.toaster]:shadow-lg",
          title:
            "group-[.toast]:text-foreground group-[.toast]:font-semibold group-[.toast]:text-sm group-[.toast]:font-mono",
        },
        style: {
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
