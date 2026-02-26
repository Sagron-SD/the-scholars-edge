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
  const supabase = createBrowserClient();
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
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="px-1 font-semibold">Community Feed</h2>
        <button
          className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          onClick={loadPosts}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding text-sm text-zinc-400">
          Loading posts…
        </div>
      ) : posts.length ? (
        posts.map((post) => (
          <div key={post.id} className="card-surface card-padding space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wide text-zinc-400">
                {post.post_type.replace("_", " ")}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-zinc-100 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))
      ) : (
        <div className="card-surface card-padding text-sm text-zinc-400">
          No posts yet. Be the first to share a progress update.
        </div>
      )}

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </section>
  );
}
