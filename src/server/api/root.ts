import { clientsRouter } from "~/server/api/routers/clients";
import { businessesRouter } from "~/server/api/routers/businesses";
import { invoicesRouter } from "~/server/api/routers/invoices";
import { settingsRouter } from "~/server/api/routers/settings";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  clients: clientsRouter,
  businesses: businessesRouter,
  invoices: invoicesRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.clients.getAll();
 *       ^? Client[]
 */
export const createCaller = createCallerFactory(appRouter);
