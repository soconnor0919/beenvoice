import { env } from "~/env";

type UmamiPayload = {
    payload: {
        hostname: string;
        language: string;
        referrer: string;
        screen: string;
        title: string;
        url: string;
        website: string;
        name: string;
        data?: Record<string, any>;
    };
    type: "event";
};

export async function trackServerEvent(
    eventName: string,
    eventData?: Record<string, any>,
) {
    if (!env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || !env.NEXT_PUBLIC_UMAMI_SCRIPT_URL) {
        console.warn("Umami not configured, skipping server-side event tracking");
        return;
    }

    // Extract API endpoint from script URL (e.g., https://analytics.umami.is/script.js -> https://analytics.umami.is/api/send)
    const scriptUrl = new URL(env.NEXT_PUBLIC_UMAMI_SCRIPT_URL);
    const apiUrl = `${scriptUrl.origin}/api/send`;

    const payload: UmamiPayload = {
        payload: {
            hostname: env.NEXT_PUBLIC_APP_URL
                ? new URL(env.NEXT_PUBLIC_APP_URL).hostname
                : "localhost",
            language: "en-US",
            referrer: "",
            screen: "",
            title: "Server Event",
            url: "/",
            website: env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
            name: eventName,
            data: eventData,
        },
        type: "event",
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Failed to send Umami event:", await response.text());
        }
    } catch (error) {
        console.error("Error sending Umami event:", error);
    }
}
