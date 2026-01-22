import { supabase } from "../lib/supabase";
import type { Ticket } from "../types/ticket";

type Result<T> = { data: T; error: null } | { data: null; error: string };

const DEFAULT_LIMIT = 50;

export async function fetchPublicTickets(limit = DEFAULT_LIMIT): Promise<Result<Ticket[]>> {
  const { data, error } = await supabase
    .from("tickets")
    .select("id, created_at, description, is_public, category, sentiment, processed")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []) as Ticket[], error: null };
}

export async function fetchUserTickets(
  userId: string,
  limit = DEFAULT_LIMIT
): Promise<Result<Ticket[]>> {
  const { data, error } = await supabase
    .from("tickets")
    .select("id, created_at, description, category, sentiment, processed")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []) as Ticket[], error: null };
}

export async function createPublicTicket(description: string, userId?: string) {
  return supabase
    .from("tickets")
    .insert([{ description, is_public: true, created_by: userId }]);
}

export async function createPrivateTicket(description: string, userId: string) {
  return supabase
    .from("tickets")
    .insert([{ description, is_public: false, created_by: userId }]);
}
