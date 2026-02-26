"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type StudySession = {
  id: string;
  session_type: string;
  duration_minutes: number | null;
  started_at: string;
  ended_at: string | null;
};

export function StudySessionList({
  userId,
  reloadKey = 0,
}: {
  userId: string;
  reloadKey?: number;
}) {
  const [supabase] = useState(() => createBrowserClient());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadSessions() {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("study_sessions")
      .select("id, session_type, duration_minutes, started_at, ended_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(20);

    setLoading(false);

    if (error) return setMessage(error.message);
    setSessions((data || []) as StudySession[]);
  }

  useEffect(() => {
    loadSessions();
  }, [reloadKey]);

  return (
    <section className="section-stack">
      <div className="progress-list-header">
        <div className="section-stack" style={{ gap: 4 }}>
          <p className="premium-kicker">Recent sessions</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Logged study history
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadSessions}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">Loading study sessions…</p>
        </div>
      ) : sessions.length ? (
        sessions.map((session) => (
          <div key={session.id} className="premium-panel premium-panel-padding study-session-card">
            <div className="study-session-meta">
              <span className="progress-chip">
                {session.session_type.replace("_", " ")}
              </span>
              <span className="muted" style={{ fontSize: 14 }}>
                {new Date(session.started_at).toLocaleString()}
              </span>
            </div>

            <div className="study-session-value">
              {session.duration_minutes ?? "—"} minutes
            </div>
          </div>
        ))
      ) : (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">No study sessions logged yet.</p>
        </div>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
    </section>
  );
}
