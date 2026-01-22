import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type SessionUser = { email?: string | null; id?: string | null };

export function useAuthUser() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(
        data.user ? { email: data.user.email, id: data.user.id } : null
      );
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user ? { email: session.user.email, id: session.user.id } : null
      );
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return user;
}
