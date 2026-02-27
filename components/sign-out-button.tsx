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
      className="btn-danger"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/auth/sign-in");
        router.refresh();
      }}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
