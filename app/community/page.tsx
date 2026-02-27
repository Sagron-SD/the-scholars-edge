"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedList } from "@/components/feed/feed-list";

export default function CommunityPage() {
  const supabase = createBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [postCount, setPostCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    })();
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("visibility", "public");

      setPostCount(count ?? 0);
    })();
  }, [reloadKey, supabase]);

  const heroRight = useMemo(() => {
    return (
      <div className="hero-chip">
        <div className="hero-chip-label">Posts</div>
        <div className="hero-chip-value">{postCount === null ? "—" : postCount}</div>
      </div>
    );
  }, [postCount]);

  return (
    <AppShell
      kicker="Momentum Network"
      title="Community"
      subtitle="Share wins, reflections, and accountability with momentum-minded scholars."
      variant="blue"
      right={heroRight}
      actions={
        <>
          <a href="#compose" className="btn-primary">
            New Post
          </a>
          <button type="button" className="btn-secondary" onClick={() => setReloadKey((k) => k + 1)}>
            Refresh
          </button>
        </>
      }
    >
      {userId ? (
        <>
          <div id="compose" />
          <FeedComposer userId={userId} onPosted={() => setReloadKey((k) => k + 1)} />
        </>
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading community tools…
        </section>
      )}

      <FeedList reloadKey={reloadKey} />
    </AppShell>
  );
}
