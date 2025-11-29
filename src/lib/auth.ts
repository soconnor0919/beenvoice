import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
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
    plugins: [nextCookies()],
});
