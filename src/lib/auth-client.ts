"use client";

import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

/**
 * Auth client configuration
 */
export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});
