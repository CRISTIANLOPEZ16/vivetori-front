import { useTicketsList } from "../hooks/useTicketsList";
import { TicketRow } from "./TicketRow";

type Props = {
  refreshKey?: number;
  userId?: string;
};

export function TicketList({ refreshKey, userId }: Props) {
  const { tickets, loading, error } = useTicketsList({
    scope: "private",
    refreshKey,
    userId,
  });

  if (loading) return <div className="text-sm text-gray-600">Loading tickets…</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="grid gap-3">
      {tickets.length === 0 ? (
        <div className="text-sm text-gray-600">No tickets yet.</div>
      ) : (
        tickets.map((t) => <TicketRow key={t.id} t={t} />)
      )}
    </div>
  );
}
