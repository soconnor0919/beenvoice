"use client";

import { createAuthClient } from "better-auth/react";
import { ssoClient } from "@better-auth/sso/client";

/**
 * Auth client for better-auth with SSO support.
 * 
 * Better-auth handles SSR internally, so we can just create the client directly.
 */

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [ssoClient()],
});
