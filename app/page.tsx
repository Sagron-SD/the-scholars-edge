"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { AppShell } from "@/components/app-shell";
import { DailyCheckinForm } from "@/components/checkins/daily-checkin-form";

export default function HomePage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return router.replace("/auth/sign-in");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, persona_type, school_level")
        .eq("id", u.user.id)
        .maybeSingle();

      if (error || !profile || !profile.persona_type || !profile.school_level) {
        router.replace("/onboarding");
      }
    })();
  }, [router, supabase]);

  return (
    <AppShell
      title="The Scholars Edge"
      subtitle="Your daily command center for academic momentum and success coaching."
    >
      <section className="card-surface card-padding space-y-3">
        <p className="text-sm text-zinc-400">Today’s Focus</p>
        <h2 className="text-lg font-semibold">3 Priority Moves</h2>

        <ul className="space-y-2 text-sm">
          <li className="rounded-xl border border-zinc-800 px-3 py-2">
            ✅ Finish your highest-impact academic task first
          </li>
          <li className="rounded-xl border border-zinc-800 px-3 py-2">
            📚 Complete one focused study sprint
          </li>
          <li className="rounded-xl border border-zinc-800 px-3 py-2">
            🎯 Move one milestone forward by 5–10%
          </li>
        </ul>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/progress"
            className="inline-block rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400"
          >
            Go to Progress
          </Link>

          <Link
            href="/study"
            className="inline-block rounded-xl border border-zinc-800 px-4 py-2 font-medium hover:bg-zinc-900"
          >
            Go to Study
          </Link>

          <Link
            href="/community"
            className="inline-block rounded-xl border border-zinc-800 px-4 py-2 font-medium hover:bg-zinc-900"
          >
            Go to Community
          </Link>
        </div>
      </section>

      <DailyCheckinForm />
    </AppShell>
  );
}
