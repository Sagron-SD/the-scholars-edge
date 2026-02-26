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
      className="premium-panel premium-panel-padding premium-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const form = new FormData(e.currentTarget);
        const title = String(form.get("title") || "").trim();
        const credits = Number(form.get("credits") || 0);
        const current_grade = String(form.get("current_grade") || "").trim().toUpperCase();

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
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Courses</p>
        <h2 className="premium-title">Add a class to your academic system</h2>
        <p className="premium-copy">
          Track your courses, credits, and current standing in one place.
        </p>
      </div>

      <input
        name="title"
        className="field auth-input"
        placeholder="Ex: Biology 101"
        required
      />

      <div className="form-grid-2">
        <input
          name="credits"
          type="number"
          min={0}
          step="0.5"
          className="field auth-input"
          placeholder="Credits"
        />

        <input
          name="current_grade"
          className="field auth-input"
          placeholder="Grade (A, B+, etc.)"
        />
      </div>

      <div className="btn-row">
        <button
          type="submit"
          disabled={loading}
          className="auth-cta-button"
        >
          {loading ? "Saving…" : "Add Course"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </form>
  );
}
