"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card-surface card-padding w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-400">Welcome back to The Scholars Edge.</p>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
          disabled={loading}
          onClick={async () => {
            setMsg(null);
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) return setMsg(error.message);
            router.push("/");
            router.refresh();
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <button
          className="w-full rounded-xl border border-zinc-800 px-4 py-2 text-sm hover:bg-zinc-900"
          onClick={() => router.push("/auth/sign-up")}
        >
          Create account
        </button>

        {msg ? <p className="text-sm text-red-300">{msg}</p> : null}
      </div>
    </main>
  );
}
