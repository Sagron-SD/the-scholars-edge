"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Assignment = {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
};

type Exam = {
  id: string;
  title: string;
  exam_date: string | null;
};

export function UpcomingAcademicItems({
  userId,
  reloadKey = 0,
}: {
  userId: string;
  reloadKey?: number;
}) {
  const [supabase] = useState(() => createBrowserClient());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    setMessage(null);

    const [{ data: assignmentsData, error: assignmentError }, { data: examsData, error: examError }] =
      await Promise.all([
        supabase
          .from("assignments")
          .select("id, title, due_date, status")
          .eq("user_id", userId)
          .order("due_date", { ascending: true }),
        supabase
          .from("exams")
          .select("id, title, exam_date")
          .eq("user_id", userId)
          .order("exam_date", { ascending: true }),
      ]);

    setLoading(false);

    if (assignmentError || examError) {
      return setMessage(
        assignmentError?.message || examError?.message || "Could not load items."
      );
    }

    setAssignments((assignmentsData || []) as Assignment[]);
    setExams((examsData || []) as Exam[]);
  }

  useEffect(() => {
    loadItems();
  }, [reloadKey]);

  return (
    <section className="section-stack">
      <div className="progress-list-header">
        <div className="section-stack" style={{ gap: 4 }}>
          <p className="premium-kicker">Academic planner</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Upcoming academic items
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadItems}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">Loading academic items…</p>
        </div>
      ) : (
        <div className="academic-items-grid">
          <section className="premium-panel premium-panel-padding premium-stack">
            <div className="section-stack" style={{ gap: 6 }}>
              <p className="premium-kicker">Assignments</p>
              <h3 className="progress-card-title" style={{ fontSize: "1.2rem" }}>
                Coursework due soon
              </h3>
            </div>

            {assignments.length ? (
              assignments.map((a) => (
                <div key={a.id} className="academic-item-card">
                  <div className="academic-item-top">
                    <p className="academic-item-title">{a.title}</p>
                    <span className="progress-status">{a.status.replace("_", " ")}</span>
                  </div>
                  <p className="premium-copy">Due: {a.due_date || "—"}</p>
                </div>
              ))
            ) : (
              <p className="muted">No assignments yet.</p>
            )}
          </section>

          <section className="premium-panel premium-panel-padding premium-stack">
            <div className="section-stack" style={{ gap: 6 }}>
              <p className="premium-kicker">Exams</p>
              <h3 className="progress-card-title" style={{ fontSize: "1.2rem" }}>
                Major assessments ahead
              </h3>
            </div>

            {exams.length ? (
              exams.map((e) => (
                <div key={e.id} className="academic-item-card">
                  <p className="academic-item-title">{e.title}</p>
                  <p className="premium-copy">Date: {e.exam_date || "—"}</p>
                </div>
              ))
            ) : (
              <p className="muted">No exams yet.</p>
            )}
          </section>
        </div>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
    </section>
  );
}
