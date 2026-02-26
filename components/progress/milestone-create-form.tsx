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
  const supabase = createBrowserClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      ref={formRef}
      className="card-surface card-padding space-y-3"
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
      <h3 className="font-semibold">Create Milestone</h3>

      <input
        name="title"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        placeholder="Ex: Raise GPA to 3.5"
        required
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          name="category"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
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
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        />
      </div>

      <input
        name="next_action"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        placeholder="Next action (optional)"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Add Milestone"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
