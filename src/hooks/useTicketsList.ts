import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Ticket } from "../types/ticket";
import { fetchPublicTickets, fetchUserTickets } from "../services/tickets";

type TicketScope = "public" | "private";

type Options = {
  scope: TicketScope;
  userId?: string | null;
  refreshKey?: number;
};

export function useTicketsList({ scope, userId, refreshKey }: Options) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (scope === "private") {
      if (!userId) {
        setTickets([]);
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const result = await fetchUserTickets(userId);
      if (result.error) {
        setTickets([]);
        setError(result.error);
      } else {
        setTickets(result.data ?? []);
      }
      setLoading(false);
      return;
    }

    const result = await fetchPublicTickets();
    if (result.error) {
      setTickets([]);
      setError(result.error);
    } else {
      setTickets(result.data ?? []);
    }
    setLoading(false);
  }, [scope, userId]);

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets, refreshKey]);

  useEffect(() => {
    if (scope === "private" && !userId) return;

    const channel = supabase
      .channel(
        scope === "public" ? "tickets-public-realtime" : `tickets-user-${userId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          ...(scope === "private" && userId
            ? { filter: `created_by=eq.${userId}` }
            : {}),
        },
        (payload) => {
          const newRow = payload.new as Ticket | null;
          const oldRow = payload.old as Ticket | null;

          setTickets((prev) => {
            if (payload.eventType === "INSERT" && newRow) {
              if (scope === "public" && !newRow.is_public) return prev;
              return [newRow, ...prev].slice(0, 50);
            }

            if (payload.eventType === "UPDATE" && newRow) {
              if (scope === "public" && !newRow.is_public) {
                return prev.filter((t) => t.id !== newRow.id);
              }
              return prev.map((t) => (t.id === newRow.id ? { ...t, ...newRow } : t));
            }

            if (payload.eventType === "DELETE" && oldRow) {
              return prev.filter((t) => t.id !== oldRow.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [scope, userId]);

  return { tickets, loading, error };
}
