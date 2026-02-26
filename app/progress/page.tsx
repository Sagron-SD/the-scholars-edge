"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/bottom-nav";
import { createBrowserClient } from "@/lib/supabase/browser";
import { MilestoneCreateForm } from "@/components/progress/milestone-create-form";
import { MilestoneList } from "@/components/progress/milestone-list";
import {
  PageShell,
  PageStack,
  PageHeader,
  Card,
  Muted,
} from "@/components/ui/primitives";

export default function ProgressPage() {
  const [supabase] = useState(() => createBrowserClient());
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) setUserId(data.user.id);
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <PageShell>
      <PageStack>
        <PageHeader
          title="Progress"
          subtitle="Track meaningful goals, measure your momentum, and keep your growth visible."
        />

        <Card className="dashboard-hero">
          <div className="dashboard-hero-stack">
            <div className="section-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Goal Tracking</p>
              <h2 className="dashboard-hero-title">
                Progress compounds when your effort becomes visible.
              </h2>
              <p className="dashboard-hero-copy">
                Create milestones, set direction, and keep your growth anchored to clear next actions.
              </p>
            </div>
          </div>
        </Card>

        {userId ? (
          <>
            <MilestoneCreateForm
              userId={userId}
              onCreated={() => setReloadKey((k) => k + 1)}
            />
            <MilestoneList key={reloadKey} userId={userId} />
          </>
        ) : (
          <Card>
            <Muted>Loading your progress…</Muted>
          </Card>
        )}
      </PageStack>

      <BottomNav />
    </PageShell>
  );
}
