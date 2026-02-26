"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/bottom-nav";
import { createBrowserClient } from "@/lib/supabase/browser";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedList } from "@/components/feed/feed-list";
import {
  PageShell,
  PageStack,
  PageHeader,
  Card,
  Muted,
} from "@/components/ui/primitives";

export default function CommunityPage() {
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
          title="Community"
          subtitle="Share wins, reflections, and accountability with momentum-minded scholars."
        />

        <Card className="dashboard-hero">
          <div className="dashboard-hero-stack">
            <div className="section-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Momentum Network</p>
              <h2 className="dashboard-hero-title">
                Build in public, stay accountable, and let progress be seen.
              </h2>
              <p className="dashboard-hero-copy">
                Share your wins, reflections, study momentum, and personal discipline with a community built around growth.
              </p>
            </div>
          </div>
        </Card>

        {userId ? (
          <FeedComposer userId={userId} onPosted={() => setReloadKey((k) => k + 1)} />
        ) : (
          <Card>
            <Muted>Loading community tools…</Muted>
          </Card>
        )}

        <FeedList reloadKey={reloadKey} />
      </PageStack>

      <BottomNav />
    </PageShell>
  );
}
