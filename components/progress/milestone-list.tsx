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
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div className="section-stack" style={{ gap: 6 }}>
          <p className="premium-kicker">Milestones</p>
          <h2 className="premium-title" style={{ fontSize: "2rem" }}>
            Your active growth targets
          </h2>
          <p className="premium-copy">
            Track what matters, update motion quickly, and keep your goals visible.
          </p>
        </div>

        <button className="btn-secondary" onClick={loadMilestones}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding">
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
        <div className="card-surface card-padding">
          <p className="muted">No milestones yet. Create your first one above.</p>
        </div>
      )}

      {message ? (
        <p className="muted" style={{ fontSize: 14 }}>
          {message}
        </p>
      ) : null}
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

  const isComplete = milestone.status === "completed" || progress >= 100;

  return (
    <article className="card-surface card-padding">
      <div className="section-stack" style={{ gap: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div className="section-stack" style={{ gap: 10, flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 34,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(22, 195, 91, 0.16)",
                  background: "rgba(22, 195, 91, 0.08)",
                  color: "var(--primary-deep)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {milestone.category.replace("_", " ")}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 34,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: isComplete
                    ? "1px solid rgba(22, 163, 74, 0.18)"
                    : "1px solid rgba(15, 23, 42, 0.10)",
                  background: isComplete
                    ? "rgba(22, 195, 91, 0.08)"
                    : "rgba(15, 23, 42, 0.04)",
                  color: isComplete ? "var(--primary-deep)" : "var(--muted)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "capitalize",
                }}
              >
                {isComplete ? "completed" : milestone.status}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "var(--text)",
              }}
            >
              {milestone.title}
            </h3>

            {milestone.next_action ? (
              <p className="premium-copy">
                <span style={{ color: "var(--text)", fontWeight: 700 }}>Next:</span>{" "}
                {milestone.next_action}
              </p>
            ) : null}

            {milestone.target_date ? (
              <p className="muted" style={{ fontSize: 14 }}>
                Target date: {milestone.target_date}
              </p>
            ) : null}
          </div>

          <div
            style={{
              minWidth: 84,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "-0.06em",
                color: "var(--text)",
              }}
            >
              {progress}%
            </span>
            <span className="muted" style={{ fontSize: 12 }}>
              completion
            </span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 12,
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, var(--primary), var(--primary-hover))",
            }}
          />
        </div>

        <div className="section-stack" style={{ gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <label
              className="muted"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              Update progress
            </label>

            <span className="muted" style={{ fontSize: 13 }}>
              Drag to adjust
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--primary)",
              cursor: "pointer",
            }}
          />

          <div className="btn-row">
            <button
              disabled={saving}
              onClick={saveProgress}
              className="btn-secondary"
            >
              {saving ? "Saving…" : "Save Progress"}
            </button>
          </div>

          {message ? (
            <p className="muted" style={{ fontSize: 14 }}>
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
