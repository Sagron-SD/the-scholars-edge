"use client";

import { createBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const supabase = createBrowserClient();
  const router = useRouter();

  return (
    <button
      className="btn-danger"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/auth/sign-in");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
