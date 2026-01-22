import { useState } from "react";
import { signIn, signUp } from "../lib/auth";

export function AuthCard({ onAuthed }: { onAuthed?: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setMsg(null);

    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email.trim(), password);

    if (error) setMsg(error.message);
    else {
      setMsg(mode === "signin" ? "Signed in ✅" : "Account created ✅");
      onAuthed?.();
    }

    setLoading(false);
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </div>
        <button
          className="text-xs underline text-gray-600"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
        >
          {mode === "signin" ? "Need an account?" : "Already have an account?"}
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <input
          className="rounded-lg border p-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="rounded-lg border p-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
          disabled={loading}
          onClick={() => void submit()}
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>

        {msg && <div className="text-xs text-gray-600">{msg}</div>}
      </div>
    </div>
  );
}
