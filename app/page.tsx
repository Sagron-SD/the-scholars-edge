"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return router.replace("/auth/sign-in");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", u.user.id)
        .maybeSingle();

      if (!profile) router.replace("/onboarding");
    })();
  }, [router, supabase]);

  return (
    <AppShell
      title="The Scholars Edge"
      subtitle="Your daily command center for academic momentum and success coaching."
    >
      {/* same sections as before */}
      <section className="card-surface card-padding space-y-3">
        <p className="text-sm text-zinc-400">Today’s Focus</p>
        <h2 className="text-lg font-semibold">3 Priority Moves</h2>

        <ul className="space-y-2 text-sm">
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            ✅ Finish your highest-impact academic task first
          </li>
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            📚 Complete one focused study sprint
          </li>
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            🎯 Move one milestone forward by 5–10%
          </li>
        </ul>
      </section>
    </AppShell>
  );
}
