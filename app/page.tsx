"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { AppShell } from "@/components/app-shell";
import { DailyCheckinForm } from "@/components/checkins/daily-checkin-form";
import { HomeSummary } from "@/components/home/home-summary";

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
      <HomeSummary />

      <section className="card-surface card-padding" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p className="muted">Today’s Focus</p>
          <h2>3 Priority Moves</h2>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 20, margin: 0 }}>
          <li className="card-surface" style={{ padding: 12 }}>
            ✅ Finish your highest-impact academic task first
          </li>
          <li className="card-surface" style={{ padding: 12 }}>
            📚 Complete one focused study sprint
          </li>
          <li className="card-surface" style={{ padding: 12 }}>
            🎯 Move one milestone forward by 5–10%
          </li>
        </ul>

        <div className="btn-row">
          <Link href="/progress" className="btn-primary">
            Go to Progress
          </Link>

          <Link href="/study" className="btn-secondary">
            Go to Study
          </Link>

          <Link href="/community" className="btn-secondary">
            Go to Community
          </Link>
        </div>
      </section>

      <DailyCheckinForm />
    </AppShell>
  );
}
