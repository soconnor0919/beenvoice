"use client";

import { createAuthClient } from "better-auth/react";
import { ssoClient } from "@better-auth/sso/client";

/**
 * Auth client for better-auth with SSO support.
 * 
 * Uses a Proxy pattern to ensure the client is only created in the browser.
 * This prevents SSR/build-time errors while maintaining full type safety.
 */

// Create a typed client reference for type inference
const _createClient = () => createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [ssoClient()],
});

// Type for the full client including plugins
type AuthClientType = ReturnType<typeof _createClient>;

// Lazy initialization - only create the client when first accessed
let _client: AuthClientType | undefined;

function getClient(): AuthClientType {
    if (typeof window === "undefined") {
        // During SSR, return a safe mock that won't crash
        // The actual client will only be used in the browser
        // @ts-ignore - SSR mock doesn't need full client implementation
        return {
            // @ts-ignore
            useSession: () => ({ data: null, isPending: false, error: null }),
            // @ts-ignore
            signIn: { email: async () => { }, social: async () => { }, sso: async () => { } },
            // @ts-ignore
            signOut: async () => { },
            // @ts-ignore
            signUp: { email: async () => { } },
        };
    }

    if (!_client) {
        _client = createAuthClient({
            baseURL: process.env.NEXT_PUBLIC_APP_URL,
            plugins: [ssoClient()],
        });
    }

    return _client;
}

// Export a Proxy that lazy-loads the client
export const authClient = new Proxy({} as AuthClientType, {
    get(_target, prop) {
        const client = getClient();
        const value = client[prop as keyof AuthClientType];
        return typeof value === "function" ? value.bind(client) : value;
    },
});
