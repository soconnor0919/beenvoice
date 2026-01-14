import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sso } from "@better-auth/sso";
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
        },
    }),
    trustedOrigins: ["https://beenvoice.soconnor.dev"],
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
        sso({
            // Only configure default SSO if Authentik credentials are provided
            defaultSSO:
                process.env.AUTHENTIK_ISSUER &&
                    process.env.AUTHENTIK_CLIENT_ID &&
                    process.env.AUTHENTIK_CLIENT_SECRET
                    ? [
                        {
                            providerId: "authentik",
                            domain: "beenvoice.soconnor.dev",
                            oidcConfig: {
                                issuer: process.env.AUTHENTIK_ISSUER,
                                clientId: process.env.AUTHENTIK_CLIENT_ID,
                                clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
                                discoveryEndpoint: `${process.env.AUTHENTIK_ISSUER}/.well-known/openid-configuration`,
                                jwksUri: `${process.env.AUTHENTIK_ISSUER}/jwks/`,
                                pkce: true,
                            },
                        },
                    ]
                    : [],
        }),
    ],
});
