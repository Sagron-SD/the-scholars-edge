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
  const [supabase] = useState(() => createBrowserClient());
  const [postType, setPostType] = useState("reflection");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="premium-panel premium-panel-padding premium-stack"
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
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Share an update</p>
        <h2 className="premium-title">Post your momentum</h2>
        <p className="premium-copy">
          Log a win, reflect on your process, or create accountability around what you are building next.
        </p>
      </div>

      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value)}
        className="select-field auth-input"
      >
        <option value="win">Win</option>
        <option value="study_session">Study Session</option>
        <option value="milestone_update">Milestone Update</option>
        <option value="reflection">Reflection</option>
        <option value="accountability">Accountability</option>
      </select>

      <textarea
        name="content"
        rows={4}
        className="textarea-field"
        placeholder="Share a win, study session, milestone update, or reflection..."
        required
      />

      <div className="btn-row">
        <button
          type="submit"
          disabled={loading}
          className="auth-cta-button"
        >
          {loading ? "Posting…" : "Publish Update"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </form>
  );
}
