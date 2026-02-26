"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function ExamForm({
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
        const exam_date = String(form.get("exam_date") || "").trim() || null;

        if (!title) {
          setLoading(false);
          return setMessage("Exam title is required.");
        }

        const { error } = await supabase.from("exams").insert({
          user_id: userId,
          title,
          exam_date,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Exam added ✅");
        onCreated?.();
      }}
    >
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Exams</p>
        <h2 className="premium-title">Stay ahead of major evaluations</h2>
        <p className="premium-copy">
          Log key exam dates early so preparation becomes structured, not reactive.
        </p>
      </div>

      <input
        name="title"
        className="field auth-input"
        placeholder="Ex: Biology final"
        required
      />

      <input
        name="exam_date"
        type="date"
        className="field auth-input"
      />

      <div className="btn-row">
        <button
          type="submit"
          disabled={loading}
          className="auth-cta-button"
        >
          {loading ? "Saving…" : "Add Exam"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </form>
  );
}
