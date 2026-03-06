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
    let active = true;

    (async () => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("visibility", "public");

      if (active) setPostCount(count ?? 0);
    })();

    return () => {
      active = false;
    };
  }, [reloadKey, supabase]);

  const heroRight = useMemo(() => {
    return (
      <div
        style={{
          minWidth: 132,
          borderRadius: 22,
          border: "1px solid rgba(22, 195, 91, 0.12)",
          background: "rgba(255, 255, 255, 0.82)",
          padding: 18,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            fontWeight: 800,
          }}
        >
          Posts
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: "var(--font-display)",
            fontSize: "2.2rem",
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            color: "var(--text)",
          }}
        >
          {postCount === null ? "—" : postCount}
        </div>

        <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          public updates
        </div>
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
      <div className="section-stack">
        {userId ? (
          <section className="card-surface card-padding" id="compose">
            <div className="section-stack">
              <div className="section-stack" style={{ gap: 8 }}>
                <p className="premium-kicker">Compose</p>
                <h2 className="premium-title" style={{ fontSize: "2rem" }}>
                  Share something worth remembering
                </h2>
                <p className="premium-copy">
                  Post a win, a reflection, or a moment of accountability that
                  moves the community forward.
                </p>
              </div>

              <FeedComposer
                userId={userId}
                onPosted={() => setReloadKey((k) => k + 1)}
              />
            </div>
          </section>
        ) : (
          <section className="card-surface card-padding">
            <p className="muted">Loading community tools…</p>
          </section>
        )}

        <section className="section-stack">
          <div className="section-stack" style={{ gap: 8 }}>
            <p className="premium-kicker">Feed</p>
            <h2 className="premium-title" style={{ fontSize: "2rem" }}>
              Public momentum
            </h2>
            <p className="premium-copy">
              A live stream of reflections, wins, and forward motion from the network.
            </p>
          </div>

          <FeedList reloadKey={reloadKey} />
        </section>
      </div>
    </AppShell>
  );
}
