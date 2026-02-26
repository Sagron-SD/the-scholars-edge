"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function HomeSummary() {
  const [supabase] = useState(() => createBrowserClient());

  const [stats, setStats] = useState({
    milestones: 0,
    studySessions: 0,
    assignments: 0,
    exams: 0,
  });

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return;

      const [
        { count: milestoneCount },
        { count: studySessionCount },
        { count: assignmentCount },
        { count: examCount },
      ] = await Promise.all([
        supabase.from("milestones").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("study_sessions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("assignments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("exams").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setStats({
        milestones: milestoneCount || 0,
        studySessions: studySessionCount || 0,
        assignments: assignmentCount || 0,
        exams: examCount || 0,
      });
    })();
  }, [supabase]);

  return (
    <section className="metric-grid">
      <SummaryCard label="Milestones" value={stats.milestones} />
      <SummaryCard label="Study Sessions" value={stats.studySessions} />
      <SummaryCard label="Assignments" value={stats.assignments} />
      <SummaryCard label="Exams" value={stats.exams} />
    </section>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="card-surface card-padding">
      <p className="metric-card-label">{label}</p>
      <p className="metric-card-value">{value}</p>
    </div>
  );
}
