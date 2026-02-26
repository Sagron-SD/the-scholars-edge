"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Milestone = {
  id: string;
  title: string;
  category: string;
  target_date: string | null;
  progress_percent: number;
  status: string;
  next_action: string | null;
};

export function MilestoneList({ userId }: { userId: string }) {
  const supabase = createBrowserClient();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadMilestones() {
    setLoading(true);
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMilestones((data || []) as Milestone[]);
  }

  useEffect(() => {
    loadMilestones();
  }, []);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="px-1 font-semibold">Milestones</h2>
        <button
          className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          onClick={loadMilestones}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding text-sm text-zinc-400">
          Loading milestones…
        </div>
      ) : milestones.length ? (
        milestones.map((m) => (
          <MilestoneCard
            key={m.id}
            milestone={m}
            onUpdated={loadMilestones}
          />
        ))
      ) : (
        <div className="card-surface card-padding text-sm text-zinc-400">
          No milestones yet. Create your first one above.
        </div>
      )}

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </section>
  );
}

function MilestoneCard({
  milestone,
  onUpdated,
}: {
  milestone: Milestone;
  onUpdated: () => void;
}) {
  const supabase = createBrowserClient();
  const [progress, setProgress] = useState(milestone.progress_percent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveProgress() {
    setSaving(true);
    setMessage(null);

    const status = progress >= 100 ? "completed" : "active";

    const { error } = await supabase
      .from("milestones")
      .update({
        progress_percent: progress,
        status,
      })
      .eq("id", milestone.id);

    setSaving(false);

    if (error) return setMessage(error.message);

    setMessage("Progress updated ✅");
    onUpdated();
  }

  return (
    <div className="card-surface card-padding space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            {milestone.category.replace("_", " ")}
          </p>
          <h3 className="font-semibold">{milestone.title}</h3>
          {milestone.next_action ? (
            <p className="mt-1 text-sm text-zinc-400">Next: {milestone.next_action}</p>
          ) : null}
          {milestone.target_date ? (
            <p className="mt-1 text-xs text-zinc-500">Target: {milestone.target_date}</p>
          ) : null}
        </div>

        <span className="text-sm text-zinc-300">{progress}%</span>
      </div>

      <div className="h-2 rounded-full bg-zinc-800">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2 rounded-xl border border-zinc-800 p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-300">Update progress</label>
          <span className="text-xs text-zinc-500">{milestone.status}</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full"
        />

        <button
          disabled={saving}
          onClick={saveProgress}
          className="rounded-xl bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Progress"}
        </button>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
      </div>
    </div>
  );
}
