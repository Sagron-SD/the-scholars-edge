"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import BottomNav from "@/components/bottom-nav";
import { DailyCheckinForm } from "@/components/checkins/daily-checkin-form";
import { HomeSummary } from "@/components/home/home-summary";
import {
  PageShell,
  PageStack,
  PageHeader,
  Card,
  Muted,
} from "@/components/ui/primitives";

export default function HomePage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data: u } = await supabase.auth.getUser();

        if (!u.user) {
          router.replace("/auth/sign-in");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, persona_type, school_level")
          .eq("id", u.user.id)
          .maybeSingle();

        if (error || !profile || !profile.persona_type || !profile.school_level) {
          router.replace("/onboarding");
          return;
        }

        if (active) setChecked(true);
      } catch {
        if (active) setChecked(true);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  return (
    <PageShell>
      <PageStack>
        <PageHeader
          title="Dashboard"
          subtitle="Your daily command center for academic momentum and success coaching."
          right={
            <Link href="/profile" className="btn-ghost">
              Profile
            </Link>
          }
        />

        {!checked ? (
          <Card>
            <Muted>Loading dashboard…</Muted>
          </Card>
        ) : (
          <>
            <HomeSummary />

            <Card>
              <div className="section-stack">
                <div className="section-stack" style={{ gap: 8 }}>
                  <Muted>Today’s Focus</Muted>
                  <h2>3 Priority Moves</h2>
                </div>

                <div className="section-stack">
                  <div className="focus-item">
                    ✅ Finish your highest-impact academic task first
                  </div>
                  <div className="focus-item">
                    📚 Complete one focused study sprint
                  </div>
                  <div className="focus-item">
                    🎯 Move one milestone forward by 5–10%
                  </div>
                </div>

                <div className="btn-row">
                  <Link href="/progress" className="btn-primary">
                    Progress
                  </Link>

                  <Link href="/study" className="btn-secondary">
                    Study
                  </Link>

                  <Link href="/community" className="btn-secondary">
                    Community
                  </Link>
                </div>
              </div>
            </Card>

            <DailyCheckinForm />
          </>
        )}
      </PageStack>

      <BottomNav />
    </PageShell>
  );
}
