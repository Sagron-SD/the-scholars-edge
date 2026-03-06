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
      className="section-stack"
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
      <div className="section-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Assignments</p>
        <h2 className="premium-title" style={{ fontSize: "1.8rem" }}>
          Capture upcoming coursework
        </h2>
        <p className="premium-copy">
          Keep deliverables visible so deadlines stop sneaking up on you.
        </p>
      </div>

      <div className="section-stack" style={{ gap: 14 }}>
        <div className="section-stack" style={{ gap: 8 }}>
          <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
            Assignment Title
          </label>
          <input
            name="title"
            className="field"
            placeholder="Ex: Midterm essay"
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
              Due Date
            </label>
            <input name="due_date" type="date" className="field" />
          </div>

          <div className="section-stack" style={{ gap: 8 }}>
            <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              Status
            </label>
            <select
              name="status"
              className="select-field"
              defaultValue="pending"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : "Add Assignment"}
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
