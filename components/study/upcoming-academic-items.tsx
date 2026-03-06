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

    const [
      { data: assignmentsData, error: assignmentError },
      { data: examsData, error: examError },
    ] = await Promise.all([
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
          <p className="premium-kicker">Academic Planner</p>
          <h2 className="premium-title" style={{ fontSize: "2rem" }}>
            Upcoming academic items
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadItems}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding">
          <p className="muted">Loading academic items…</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <section className="card-surface card-padding">
            <div className="section-stack">
              <div className="section-stack" style={{ gap: 6 }}>
                <p className="premium-kicker">Assignments</p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    color: "var(--text)",
                  }}
                >
                  Coursework due soon
                </h3>
              </div>

              {assignments.length ? (
                assignments.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      borderRadius: 18,
                      background: "rgba(255, 255, 255, 0.82)",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          color: "var(--text)",
                          lineHeight: 1.4,
                        }}
                      >
                        {a.title}
                      </p>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 32,
                          padding: "0 12px",
                          borderRadius: 999,
                          border: "1px solid rgba(15, 23, 42, 0.08)",
                          background: "rgba(15, 23, 42, 0.04)",
                          color: "var(--muted)",
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "capitalize",
                        }}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="premium-copy">Due: {a.due_date || "—"}</p>
                  </div>
                ))
              ) : (
                <p className="muted">No assignments yet.</p>
              )}
            </div>
          </section>

          <section className="card-surface card-padding">
            <div className="section-stack">
              <div className="section-stack" style={{ gap: 6 }}>
                <p className="premium-kicker">Exams</p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    color: "var(--text)",
                  }}
                >
                  Major assessments ahead
                </h3>
              </div>

              {exams.length ? (
                exams.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      borderRadius: 18,
                      background: "rgba(255, 255, 255, 0.82)",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        color: "var(--text)",
                        lineHeight: 1.4,
                      }}
                    >
                      {e.title}
                    </p>

                    <p className="premium-copy">Date: {e.exam_date || "—"}</p>
                  </div>
                ))
              ) : (
                <p className="muted">No exams yet.</p>
              )}
            </div>
          </section>
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
