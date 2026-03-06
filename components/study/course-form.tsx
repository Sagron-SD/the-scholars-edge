"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function CourseForm({
  userId,
  onCreated,
}: {
  userId: string;
  onCreated?: () => void;
}) {
  const [supabase] = useState(() => createBrowserClient());
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      className="section-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const form = new FormData(e.currentTarget);
        const title = String(form.get("title") || "").trim();
        const credits = Number(form.get("credits") || 0);
        const current_grade = String(form.get("current_grade") || "")
          .trim()
          .toUpperCase();

        if (!title) {
          setLoading(false);
          return setMessage("Course name is required.");
        }

        const { error } = await supabase.from("courses").insert({
          user_id: userId,
          title,
          credits: credits || null,
          current_grade: current_grade || null,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Course added ✅");
        onCreated?.();
      }}
    >
      <div className="section-stack" style={{ gap: 14 }}>
        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Course Name
          </label>
          <input
            name="title"
            className="field"
            placeholder="Ex: Biology 101"
            required
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <div className="section-stack" style={{ gap: 8 }}>
            <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              Credits
            </label>
            <input
              name="credits"
              type="number"
              min={0}
              step="0.5"
              className="field"
              placeholder="Ex: 3"
            />
          </div>

          <div className="section-stack" style={{ gap: 8 }}>
            <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              Current Grade
            </label>
            <input
              name="current_grade"
              className="field"
              placeholder="Ex: A-"
            />
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : "Add Course"}
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
