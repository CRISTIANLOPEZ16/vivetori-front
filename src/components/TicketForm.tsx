import { useState } from "react";
import { supabase } from "../lib/supabase";
import { createPrivateTicket } from "../services/tickets";

export function TicketForm({ onCreated }: { onCreated?: () => void }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  

  async function submit() {
    const description = text.trim();
    if (!description) return;

    setSaving(true);
    setMsg(null);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setMsg("Please sign in to create a ticket.");
      setSaving(false);
      return;
    }

    const { error } = await createPrivateTicket(description, userId);

    if (error) setMsg(error.message);
    else {
      setText("");
      setMsg("Ticket created ✅");
      onCreated?.();
    }

    setSaving(false);
  }

  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="text-sm font-semibold">Create a ticket</div>
      <textarea
        className="mt-2 w-full rounded-lg border p-2 text-sm"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the issue…"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          className="rounded-lg bg-black text-white px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => void submit()}
          disabled={saving}
        >
          {saving ? "Saving..." : "Submit"}
        </button>
        {msg && <div className="text-xs text-gray-600">{msg}</div>}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        This inserts into Supabase; n8n + FastAPI will process it and update fields in realtime.
      </div>
    </div>
  );
}
