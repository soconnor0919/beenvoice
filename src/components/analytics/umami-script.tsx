"use client";

import Script from "next/script";
import { env } from "~/env";

export function UmamiScript() {
    if (process.env.NODE_ENV === "development") {
        return null;
    }

    if (!env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || !env.NEXT_PUBLIC_UMAMI_SCRIPT_URL) {
        return null;
    }

    return (
        <Script
            defer
            src={env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
        />
    );
}
