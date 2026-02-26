"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function MilestoneCreateForm({
  userId,
  onCreated,
}: {
  userId: string;
  onCreated?: () => void;
}) {
  const [supabase] = useState(() => createBrowserClient());
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      ref={formRef}
      className="premium-panel premium-panel-padding premium-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = String(formData.get("title") || "").trim();
        const category = String(formData.get("category") || "academic");
        const target_date = String(formData.get("target_date") || "").trim() || null;
        const next_action = String(formData.get("next_action") || "").trim() || null;

        if (!title) {
          setLoading(false);
          return setMessage("Milestone title is required.");
        }

        const { error } = await supabase.from("milestones").insert({
          user_id: userId,
          title,
          category,
          target_date,
          next_action,
          progress_percent: 0,
          status: "active",
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Milestone created ✅");
        onCreated?.();
      }}
    >
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Create milestone</p>
        <h2 className="premium-title">Turn ambition into visible motion</h2>
        <p className="premium-copy">
          Define the outcome, set the category, and anchor it with a next step.
        </p>
      </div>

      <input
        name="title"
        className="field auth-input"
        placeholder="Ex: Raise GPA to 3.5"
        required
      />

      <div className="form-grid-2">
        <select
          name="category"
          className="select-field auth-input"
          defaultValue="academic"
        >
          <option value="academic">Academic</option>
          <option value="career">Career</option>
          <option value="wellness">Wellness</option>
          <option value="financial">Financial</option>
          <option value="personal_brand">Personal Brand</option>
        </select>

        <input
          name="target_date"
          type="date"
          className="field auth-input"
        />
      </div>

      <input
        name="next_action"
        className="field auth-input"
        placeholder="Next action (optional)"
      />

      <div className="btn-row">
        <button
          type="submit"
          disabled={loading}
          className="auth-cta-button"
        >
          {loading ? "Saving…" : "Add Milestone"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </form>
  );
}
