import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (
          error instanceof TRPCClientError &&
          error.data &&
          typeof error.data === "object" &&
          "code" in error.data &&
          (error.data as { code: string }).code === "UNAUTHORIZED"
        ) {
          toast.error("Please sign in to continue");
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (
          error instanceof TRPCClientError &&
          error.data &&
          typeof error.data === "object" &&
          "code" in error.data &&
          (error.data as { code: string }).code === "UNAUTHORIZED"
        ) {
          toast.error("Please sign in to continue");
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
