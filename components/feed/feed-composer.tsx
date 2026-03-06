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
      className="section-stack"
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
      <div className="section-stack" style={{ gap: 14 }}>
        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Post Type
          </label>

          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="select-field"
          >
            <option value="win">Win</option>
            <option value="study_session">Study Session</option>
            <option value="milestone_update">Milestone Update</option>
            <option value="reflection">Reflection</option>
            <option value="accountability">Accountability</option>
          </select>
        </div>

        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Your Update
          </label>

          <textarea
            name="content"
            rows={5}
            className="textarea-field"
            placeholder="Share a win, a lesson, a study session, or what you’re holding yourself accountable to next..."
            required
          />
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Posting…" : "Publish Update"}
        </button>
      </div>

      {message ? (
        <p className="muted" style={{ fontSize: 14 }}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
