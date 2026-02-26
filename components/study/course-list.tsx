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

  const totalCredits = gradedCourses.reduce((sum, c) => sum + Number(c.credits || 0), 0);

  const gpa =
    totalCredits > 0
      ? gradedCourses.reduce((sum, c) => {
          const points = gradePoints[c.current_grade || ""] ?? 0;
          return sum + points * Number(c.credits || 0);
        }, 0) / totalCredits
      : null;

  return (
    <section className="section-stack">
      <div className="premium-panel premium-panel-padding premium-stack">
        <div className="premium-stack" style={{ gap: 6 }}>
          <p className="premium-kicker">GPA Snapshot</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Current estimated GPA: {gpa !== null ? gpa.toFixed(2) : "N/A"}
          </h2>
          <p className="premium-copy">
            Based on saved course grades and credit hours.
          </p>
        </div>
      </div>

      <div className="progress-list-header">
        <div className="section-stack" style={{ gap: 4 }}>
          <p className="premium-kicker">Course list</p>
          <h2 className="premium-title" style={{ fontSize: "1.7rem" }}>
            Your academic load
          </h2>
        </div>

        <button className="btn-secondary" onClick={loadCourses}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">Loading courses…</p>
        </div>
      ) : courses.length ? (
        courses.map((course) => (
          <div key={course.id} className="premium-panel premium-panel-padding course-card">
            <div className="course-card-top">
              <h3 className="progress-card-title">{course.title}</h3>
              <div className="course-grade-chip">
                {course.current_grade ?? "—"}
              </div>
            </div>

            <p className="premium-copy">
              Credits: {course.credits ?? "—"}
            </p>
          </div>
        ))
      ) : (
        <div className="premium-panel premium-panel-padding">
          <p className="muted">No courses yet. Add your first class above.</p>
        </div>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
    </section>
  );
}
