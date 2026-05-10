import { useMemo } from "react";
import Fuse from "fuse.js";
import { api } from "~/trpc/react";

export interface LineItemSuggestion {
  description: string;
  hours: number;
  rate: number;
}

export function useLineItemSuggestions() {
  const { data: history = [] } = api.invoices.getLineItemHistory.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const fuse = useMemo(
    () =>
      new Fuse(history, {
        keys: ["description"],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [history],
  );

  function search(query: string): LineItemSuggestion[] {
    if (!query || query.length < 2) return history.slice(0, 6);
    return fuse.search(query, { limit: 6 }).map((r) => r.item);
  }

  return { search, hasHistory: history.length > 0 };
}
