"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { MilestoneCreateForm } from "@/components/progress/milestone-create-form";
import { MilestoneList } from "@/components/progress/milestone-list";

export default function ProgressPage() {
  const supabase = createBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (active && data.user) setUserId(data.user.id);
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    (async () => {
      const { count } = await supabase
        .from("milestones")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active");

      if (active) {
        setActiveCount(count ?? 0);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, reloadKey, supabase]);

  const heroRight = useMemo(() => {
    return (
      <div className="hero-chip">
        <div className="hero-chip-label">Active</div>
        <div className="hero-chip-value">
          {activeCount === null ? "—" : activeCount}
        </div>
      </div>
    );
  }, [activeCount]);

  return (
    <AppShell
      kicker="Milestone Tracker"
      title="Progress"
      subtitle="Track meaningful goals, measure momentum, and keep your targets visible."
      variant="violet"
      right={heroRight}
      actions={
        <>
          <a href="#create-milestone" className="btn-primary">
            Add Milestone
          </a>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            Refresh
          </button>
        </>
      }
    >
      {userId ? (
        <div className="section-stack">
          <section className="card-surface card-padding premium-stack" id="create-milestone">
            <div className="section-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Create Milestone</p>
              <h2 className="premium-title">Turn ambition into visible motion</h2>
              <p className="premium-copy">
                Define the outcome, set the category, and anchor it with a next step.
              </p>
            </div>

            <MilestoneCreateForm
              userId={userId}
              onCreated={() => setReloadKey((k) => k + 1)}
            />
          </section>

          <section className="section-stack">
            <div className="section-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Milestones</p>
              <h2 className="premium-title">Your active growth targets</h2>
            </div>

            <MilestoneList key={reloadKey} userId={userId} />
          </section>
        </div>
      ) : (
        <section className="card-surface card-padding">
          <p className="muted">Loading your progress…</p>
        </section>
      )}
    </AppShell>
  );
}
