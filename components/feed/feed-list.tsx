"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type FeedPost = {
  id: string;
  post_type: string;
  content: string;
  created_at: string;
  user_id: string;
};

function FeedTypeChip({ type }: { type: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 34,
        padding: "0 12px",
        borderRadius: 999,
        border: "1px solid rgba(22, 195, 91, 0.14)",
        background: "rgba(22, 195, 91, 0.08)",
        color: "var(--primary-deep)",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "capitalize",
      }}
    >
      {type.replace("_", " ")}
    </span>
  );
}

export function FeedList({ reloadKey = 0 }: { reloadKey?: number }) {
  const [supabase] = useState(() => createBrowserClient());
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("posts")
      .select("id, post_type, content, created_at, user_id")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(25);

    setLoading(false);

    if (error) return setMessage(error.message);
    setPosts((data || []) as FeedPost[]);
  }

  useEffect(() => {
    loadPosts();
  }, [reloadKey]);

  return (
    <section className="section-stack">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div className="section-stack" style={{ gap: 6 }}>
          <p className="premium-kicker">Community Feed</p>
          <h2 className="premium-title" style={{ fontSize: "2rem" }}>
            Shared progress and reflections
          </h2>
          <p className="premium-copy">
            Public updates from people building momentum in real time.
          </p>
        </div>

        <button className="btn-secondary" onClick={loadPosts}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding">
          <p className="muted">Loading posts…</p>
        </div>
      ) : posts.length ? (
        posts.map((post) => (
          <article key={post.id} className="card-surface card-padding">
            <div className="section-stack" style={{ gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <FeedTypeChip type={post.post_type} />

                <span className="muted" style={{ fontSize: 14 }}>
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>

              <p
                style={{
                  color: "var(--text)",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.content}
              </p>
            </div>
          </article>
        ))
      ) : (
        <div className="card-surface card-padding">
          <p className="muted">
            No posts yet. Be the first to share a progress update.
          </p>
        </div>
      )}

      {message ? (
        <p className="muted" style={{ fontSize: 14 }}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
