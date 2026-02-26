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
  const [supabase] = useState(() => createBrowserClient());
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadMilestones() {
    setLoading(true);
    setMessage(null);

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
    <section className="section-stack">
      <div className="progress-list-header">
        <div className="section-stack" style={{ gap: 4 }}>
          <p className="premium-kicker">Milestones</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Your active growth targets
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadMilestones}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">Loading milestones…</p>
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
        <div className="premium-panel premium-panel-padding">
          <p className="muted">No milestones yet. Create your first one above.</p>
        </div>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
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
  const [supabase] = useState(() => createBrowserClient());
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
    <div className="premium-panel premium-panel-padding premium-stack">
      <div className="progress-card-top">
        <div className="section-stack" style={{ gap: 8 }}>
          <div className="progress-card-meta">
            <span className="progress-chip">
              {milestone.category.replace("_", " ")}
            </span>
            <span className={`progress-status ${milestone.status === "completed" ? "progress-status-complete" : ""}`}>
              {milestone.status}
            </span>
          </div>

          <h3 className="progress-card-title">{milestone.title}</h3>

          {milestone.next_action ? (
            <p className="premium-copy">
              <strong style={{ color: "#f8fafc" }}>Next:</strong> {milestone.next_action}
            </p>
          ) : null}

          {milestone.target_date ? (
            <p className="muted" style={{ fontSize: 14 }}>
              Target date: {milestone.target_date}
            </p>
          ) : null}
        </div>

        <div className="progress-card-percent">{progress}%</div>
      </div>

      <div className="progress-bar-shell">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-card-controls">
        <div className="section-stack" style={{ gap: 8 }}>
          <label className="checkin-row-label">Update progress</label>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="progress-range"
          />
        </div>

        <div className="btn-row">
          <button
            disabled={saving}
            onClick={saveProgress}
            className="btn-secondary"
          >
            {saving ? "Saving…" : "Save Progress"}
          </button>
        </div>

        {message ? <p className="auth-message">{message}</p> : null}
      </div>
    </div>
  );
}
