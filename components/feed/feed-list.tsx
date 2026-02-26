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
      <div className="progress-list-header">
        <div className="section-stack" style={{ gap: 4 }}>
          <p className="premium-kicker">Community feed</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Shared progress and reflections
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadPosts}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">Loading posts…</p>
        </div>
      ) : posts.length ? (
        posts.map((post) => (
          <div key={post.id} className="premium-panel premium-panel-padding community-post-card">
            <div className="community-post-meta">
              <span className="progress-chip">
                {post.post_type.replace("_", " ")}
              </span>

              <span className="muted" style={{ fontSize: 14 }}>
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>

            <p className="community-post-content">{post.content}</p>
          </div>
        ))
      ) : (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">No posts yet. Be the first to share a progress update.</p>
        </div>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
    </section>
  );
}
