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
  const supabase = createBrowserClient();
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
      return setMessage(assignmentError?.message || examError?.message || "Could not load items.");
    }

    setAssignments((assignmentsData || []) as Assignment[]);
    setExams((examsData || []) as Exam[]);
  }

  useEffect(() => {
    loadItems();
  }, [reloadKey]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="px-1 font-semibold">Upcoming Academic Items</h2>
        <button
          className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900"
          onClick={loadItems}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-surface card-padding text-sm text-zinc-400">
          Loading academic items…
        </div>
      ) : (
        <>
          <section className="card-surface card-padding space-y-2">
            <h3 className="font-semibold">Assignments</h3>
            {assignments.length ? (
              assignments.map((a) => (
                <div key={a.id} className="rounded-xl border border-zinc-800 p-3">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-zinc-400">
                    Due: {a.due_date || "—"} | Status: {a.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400">No assignments yet.</p>
            )}
          </section>

          <section className="card-surface card-padding space-y-2">
            <h3 className="font-semibold">Exams</h3>
            {exams.length ? (
              exams.map((e) => (
                <div key={e.id} className="rounded-xl border border-zinc-800 p-3">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-zinc-400">Date: {e.exam_date || "—"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400">No exams yet.</p>
            )}
          </section>
        </>
      )}

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </section>
  );
}
