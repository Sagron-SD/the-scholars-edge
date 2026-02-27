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
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    })();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { count } = await supabase
        .from("milestones")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active");

      setActiveCount(count ?? 0);
    })();
  }, [userId, reloadKey, supabase]);

  const heroRight = useMemo(() => {
    return (
      <div className="hero-chip">
        <div className="hero-chip-label">Active</div>
        <div className="hero-chip-value">{activeCount === null ? "—" : activeCount}</div>
      </div>
    );
  }, [activeCount]);

  return (
    <AppShell
      kicker="Milestone Tracker"
      title="Progress"
      subtitle="Track meaningful goals and keep your momentum visible."
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
        <>
          <div id="create-milestone" />
          <MilestoneCreateForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
          <MilestoneList key={reloadKey} userId={userId} />
        </>
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading your progress…
        </section>
      )}
    </AppShell>
  );
}
