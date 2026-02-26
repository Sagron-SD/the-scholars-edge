"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { AuthAltLink, AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <AuthShell subtitle="A cleaner system for momentum, discipline, and academic growth.">
      <form onSubmit={handleSignIn} className="auth-form">
        <div className="auth-mini-header">
          <p className="auth-panel-kicker">Welcome back</p>
          <h2 className="auth-panel-title">Continue your momentum</h2>
        </div>

        <div className="section-stack">
          <input
            type="email"
            className="field auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            className="field auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary auth-submit auth-submit-lg" disabled={loading}>
          {loading ? "Signing in…" : "Enter The Scholars Edge"}
        </button>

        {message ? <p className="auth-message">{message}</p> : null}
      </form>

      <AuthAltLink
        text="New here?"
        href="/auth/sign-up"
        linkLabel="Create your account"
      />
    </AuthShell>
  );
}
