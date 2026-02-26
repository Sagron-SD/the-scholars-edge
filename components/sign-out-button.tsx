"use client";

import { createBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className="rounded-xl border border-zinc-700 bg-zinc-950/40 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
      onClick={async () => {
        setLoading(true);
        try {
          await supabase.auth.signOut();
          router.push("/auth/sign-in");
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
