"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function FeedComposer({
  userId,
  onPosted,
}: {
  userId: string;
  onPosted?: () => void;
}) {
  const supabase = createBrowserClient();
  const [postType, setPostType] = useState("reflection");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="card-surface card-padding space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const content = String(formData.get("content") || "").trim();

        if (!content) {
          setLoading(false);
          return setMessage("Post content is required.");
        }

        const { error } = await supabase.from("posts").insert({
          user_id: userId,
          post_type: postType,
          content,
          visibility: "public",
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setPostType("reflection");
        setMessage("Post published ✅");
        onPosted?.();
      }}
    >
      <h3 className="font-semibold">Share a progress update</h3>

      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value)}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
      >
        <option value="win">Win</option>
        <option value="study_session">Study Session</option>
        <option value="milestone_update">Milestone Update</option>
        <option value="reflection">Reflection</option>
        <option value="accountability">Accountability</option>
      </select>

      <textarea
        name="content"
        rows={3}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
        placeholder="Log a win, study session, milestone update, or reflection..."
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Posting…" : "Post"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
