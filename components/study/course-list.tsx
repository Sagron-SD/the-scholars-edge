"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Course = {
  id: string;
  title: string;
  credits: number | null;
  current_grade: string | null;
};

const gradePoints: Record<string, number> = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  "D+": 1.3,
  D: 1,
  F: 0,
};

export function CourseList({
  userId,
  reloadKey = 0,
}: {
  userId: string;
  reloadKey?: number;
}) {
  const [supabase] = useState(() => createBrowserClient());
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadCourses() {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, credits, current_grade")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) return setMessage(error.message);
    setCourses((data || []) as Course[]);
  }

  useEffect(() => {
    loadCourses();
  }, [reloadKey]);

  const gradedCourses = courses.filter(
    (c) => c.current_grade && c.credits && gradePoints[c.current_grade] !== undefined
  );

  const totalCredits = gradedCourses.reduce(
    (sum, c) => sum + Number(c.credits || 0),
    0
  );

  const gpa =
    totalCredits > 0
      ? gradedCourses.reduce((sum, c) => {
          const points = gradePoints[c.current_grade || ""] ?? 0;
          return sum + points * Number(c.credits || 0);
        }, 0) / totalCredits
      : null;

  return (
    <section className="section-stack">
      <div className="card-surface card-padding">
        <div className="section-stack" style={{ gap: 6 }}>
          <p className="premium-kicker">GPA Snapshot</p>
          <h2 className="premium-title" style={{ fontSize: "2rem" }}>
            Current estimated GPA: {gpa !== null ? gpa.toFixed(2) : "N/A"}
          </h2>
          <p className="premium-copy">
            Based on saved course grades and credit hours.
          </p>
        </div>
      </div>

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
          <p className="premium-kicker">Course List</p>
          <h2 className="premium-title" style={{ fontSize: "2rem" }}>
            Your academic load
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadCourses}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding">
          <p className="muted">Loading courses…</p>
        </div>
      ) : courses.length ? (
        courses.map((course) => (
          <article key={course.id} className="card-surface card-padding">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div className="section-stack" style={{ gap: 8 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    color: "var(--text)",
                  }}
                >
                  {course.title}
                </h3>

                <p className="premium-copy">Credits: {course.credits ?? "—"}</p>
              </div>

              <div
                style={{
                  minWidth: 68,
                  minHeight: 46,
                  borderRadius: 16,
                  padding: "0 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(22, 195, 91, 0.08)",
                  border: "1px solid rgba(22, 195, 91, 0.14)",
                  color: "var(--primary-deep)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {course.current_grade ?? "—"}
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="card-surface card-padding">
          <p className="muted">No courses yet. Add your first class above.</p>
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
