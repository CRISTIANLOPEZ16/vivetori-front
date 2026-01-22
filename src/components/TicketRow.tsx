import type { Ticket } from "../types/ticket";
import { Badge } from "./Badge";

function sentimentLabel(s: string | null) {
  if (!s) return "—";
  return s;
}
function categoryLabel(c: string | null) {
  if (!c) return "—";
  return c;
}

export function TicketRow({ t }: { t: Ticket }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Badge>{t.processed ? "Processed" : "Pending"}</Badge>
          <Badge>Category: {categoryLabel(t.category)}</Badge>
          <Badge>Sentiment: {sentimentLabel(t.sentiment)}</Badge>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(t.created_at).toLocaleString()}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{t.description}</p>

      <div className="mt-3 text-xs text-gray-400">ID: {t.id}</div>
    </div>
  );
}
