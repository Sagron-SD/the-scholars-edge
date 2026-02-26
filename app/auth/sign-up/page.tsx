"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { AuthAltLink, AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim() || null,
        },
      },
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: fullName.trim() || null,
        },
        { onConflict: "id" }
      );
    }

    setLoading(false);
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <AuthShell subtitle="A success coaching platform for academic momentum, personal discipline, and long-term growth.">
      <form onSubmit={handleSignUp} className="auth-form">
        <div className="auth-mini-header">
          <p className="auth-panel-kicker">Create your account</p>
          <h2 className="auth-panel-title">Start building your edge</h2>
          <p className="auth-panel-copy">
            Create your account and begin a stronger daily system for academic and personal growth.
          </p>
        </div>

        <div className="section-stack">
          <input
            type="text"
            className="field auth-input"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />

          <input
            type="email"
            className="field auth-input"
            placeholder="Email address"
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
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="auth-cta-button"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Your Account"}
        </button>

        {message ? <p className="auth-message">{message}</p> : null}
      </form>

      <AuthAltLink
        text="Already have access?"
        href="/auth/sign-in"
        linkLabel="Enter here"
      />
    </AuthShell>
  );
}
