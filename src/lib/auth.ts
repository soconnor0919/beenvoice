import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verificationTokens,
            ssoProvider: schema.ssoProviders,
        },
    }),
    trustedOrigins: [
        "https://beenvoice.soconnor.dev",
        "https://auth.soconnor.dev", // Authentik IdP for OIDC discovery
    ],
    accountLinking: {
        enabled: true,
        trustedProviders: ["authentik"],
    },
    emailAndPassword: {
        enabled: true,
        password: {
            hash: async (password) => {
                const bcrypt = await import("bcryptjs");
                return bcrypt.hash(password, 12);
            },
            verify: async ({ hash, password }) => {
                const bcrypt = await import("bcryptjs");
                return bcrypt.compare(password, hash);
            },
        },
    },
    plugins: [
        nextCookies(),
        genericOAuth({
            config: [
                {
                    providerId: "authentik",
                    clientId: process.env.AUTHENTIK_CLIENT_ID!,
                    clientSecret: process.env.AUTHENTIK_CLIENT_SECRET!,
                    discoveryUrl: `${process.env.AUTHENTIK_ISSUER}/.well-known/openid-configuration`,
                    // Explicit endpoints to ensure correct routing in production
                    authorizationUrl: "https://auth.soconnor.dev/application/o/authorize/",
                    tokenUrl: "https://auth.soconnor.dev/application/o/token/",
                    userInfoUrl: "https://auth.soconnor.dev/application/o/userinfo/",
                    scopes: ["openid", "email", "profile"],
                    pkce: true,
                },
            ],
        }),
    ],
});
