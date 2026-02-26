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
  const supabase = createBrowserClient();
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
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="px-1 font-semibold">Recent Study Sessions</h2>
        <button
          className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          onClick={loadSessions}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding text-sm text-zinc-400">
          Loading study sessions…
        </div>
      ) : sessions.length ? (
        sessions.map((session) => (
          <div key={session.id} className="card-surface card-padding space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wide text-zinc-400">
                {session.session_type.replace("_", " ")}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(session.started_at).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-zinc-100">
              {session.duration_minutes ?? "—"} minutes
            </p>
          </div>
        ))
      ) : (
        <div className="card-surface card-padding text-sm text-zinc-400">
          No study sessions logged yet.
        </div>
      )}

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </section>
  );
}
