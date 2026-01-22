import { useState } from "react";
import { supabase } from "./lib/supabase";
import { AuthCard } from "./components/AuthCard";
import { TicketForm } from "./components/TicketForm";
import { TicketList } from "./components/TicketList";
import { PublicTicketForm } from "./components/PublicTicketForm";
import { PublicTicketList } from "./components/PublicTicketList";
import { useAuthUser } from "./hooks/useAuthUser";

export default function App() {
  const user = useAuthUser();
  const [refreshKey, setRefreshKey] = useState(0);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Vivetori-logo-Azul.png" alt="Vivetori" className="h-8 w-auto" />
            <div>
              <div className="text-lg font-bold">Tickets support</div>
              <div className="text-sm text-gray-600">Log in to trace your issues.</div>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-600">{user.email}</div>
              <button className="text-xs underline" onClick={() => void logout()}>
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 grid gap-4">
        {!user ? (
          <>
            <AuthCard onAuthed={() => setRefreshKey((k) => k + 1)} />

            {/* Public board SOLO para no autenticados */}
            <section className="grid gap-3">
              <div className="text-sm font-semibold text-gray-900">Public board</div>
              <PublicTicketForm onCreated={() => setRefreshKey((k) => k + 1)} />
              <PublicTicketList refreshKey={refreshKey} />
            </section>
          </>
        ) : (
          <>
            <TicketForm onCreated={() => setRefreshKey((k) => k + 1)} />
            <TicketList refreshKey={refreshKey} userId={user.id ?? undefined} />
          </>
        )}
      </main>
    </div>
  );
}
