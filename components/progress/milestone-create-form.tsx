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
      className="section-stack"
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
      <div className="section-stack" style={{ gap: 14 }}>
        <div className="section-stack" style={{ gap: 8 }}>
          <label
            htmlFor="milestone-title"
            className="muted"
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            Milestone Title
          </label>
          <input
            id="milestone-title"
            name="title"
            className="field"
            placeholder="Ex: Raise GPA to 3.5"
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
            <label
              htmlFor="milestone-category"
              className="muted"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              Category
            </label>
            <select
              id="milestone-category"
              name="category"
              className="select-field"
              defaultValue="academic"
            >
              <option value="academic">Academic</option>
              <option value="career">Career</option>
              <option value="wellness">Wellness</option>
              <option value="financial">Financial</option>
              <option value="personal_brand">Personal Brand</option>
            </select>
          </div>

          <div className="section-stack" style={{ gap: 8 }}>
            <label
              htmlFor="milestone-target-date"
              className="muted"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              Target Date
            </label>
            <input
              id="milestone-target-date"
              name="target_date"
              type="date"
              className="field"
            />
          </div>
        </div>

        <div className="section-stack" style={{ gap: 8 }}>
          <label
            htmlFor="milestone-next-action"
            className="muted"
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            Next Action
          </label>
          <input
            id="milestone-next-action"
            name="next_action"
            className="field"
            placeholder="Ex: Meet with advisor and map out weekly study blocks"
          />
        </div>
      </div>

      <div className="btn-row">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : "Add Milestone"}
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
