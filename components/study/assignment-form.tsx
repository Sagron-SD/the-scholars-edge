"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function AssignmentForm({
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
        const due_date = String(form.get("due_date") || "").trim() || null;
        const status = String(form.get("status") || "pending");

        if (!title) {
          setLoading(false);
          return setMessage("Assignment title is required.");
        }

        const { error } = await supabase.from("assignments").insert({
          user_id: userId,
          title,
          due_date,
          status,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Assignment added ✅");
        onCreated?.();
      }}
    >
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Assignments</p>
        <h2 className="premium-title">Capture upcoming coursework</h2>
        <p className="premium-copy">
          Keep important deliverables visible so deadlines stop sneaking up on you.
        </p>
      </div>

      <input
        name="title"
        className="field auth-input"
        placeholder="Ex: Midterm essay"
        required
      />

      <div className="form-grid-2">
        <input
          name="due_date"
          type="date"
          className="field auth-input"
        />

        <select
          name="status"
          className="select-field auth-input"
          defaultValue="pending"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="btn-row">
        <button
          type="submit"
          disabled={loading}
          className="auth-cta-button"
        >
          {loading ? "Saving…" : "Add Assignment"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </form>
  );
}
