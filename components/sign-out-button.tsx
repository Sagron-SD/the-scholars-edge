"use client";

import { createBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const supabase = createBrowserClient();
  const router = useRouter();

  return (
    <button
      className="rounded-xl border border-zinc-800 px-4 py-2 text-sm hover:bg-zinc-900"
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
