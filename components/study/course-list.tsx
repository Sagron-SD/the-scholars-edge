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
  const supabase = createBrowserClient();
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
    <section className="space-y-3">
      <div className="card-surface card-padding space-y-2">
        <h3 className="font-semibold">GPA Snapshot</h3>
        <p className="text-sm text-zinc-400">
          Current estimated GPA: {gpa !== null ? gpa.toFixed(2) : "N/A"}
        </p>
        <p className="text-xs text-zinc-500">Based on saved course grades and credits.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="px-1 font-semibold">Courses</h2>
        <button
          className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          onClick={loadCourses}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding text-sm text-zinc-400">
          Loading courses…
        </div>
      ) : courses.length ? (
        courses.map((course) => (
          <div key={course.id} className="card-surface card-padding space-y-1">
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-zinc-400">
              Credits: {course.credits ?? "—"} | Grade: {course.current_grade ?? "—"}
            </p>
          </div>
        ))
      ) : (
        <div className="card-surface card-padding text-sm text-zinc-400">
          No courses yet. Add your first class above.
        </div>
      )}

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </section>
  );
}
