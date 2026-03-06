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
      className="section-stack"
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
      <div className="section-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Exams</p>
        <h2 className="premium-title" style={{ fontSize: "1.8rem" }}>
          Keep major assessments visible
        </h2>
        <p className="premium-copy">
          Log your exam dates so preparation stays proactive.
        </p>
      </div>

      <div className="section-stack" style={{ gap: 14 }}>
        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Exam Title
          </label>
          <input
            name="title"
            className="field"
            placeholder="Ex: Biology final"
            required
          />
        </div>

        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Exam Date
          </label>
          <input name="exam_date" type="date" className="field" />
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : "Add Exam"}
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
