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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;

        if (!user) {
          if (active) setLoaded(true);
          return;
        }

        const [
          milestonesResult,
          studySessionsResult,
          assignmentsResult,
          examsResult,
        ] = await Promise.all([
          supabase
            .from("milestones")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("study_sessions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("assignments")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("exams")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

        if (!active) return;

        setStats({
          milestones: milestonesResult.count || 0,
          studySessions: studySessionsResult.count || 0,
          assignments: assignmentsResult.count || 0,
          exams: examsResult.count || 0,
        });
      } catch {
        if (!active) return;
      } finally {
        if (active) setLoaded(true);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <section className="dashboard-summary-grid">
      <SummaryCard
        label="Milestones"
        value={loaded ? stats.milestones : "—"}
        accent="blue"
      />
      <SummaryCard
        label="Study Sessions"
        value={loaded ? stats.studySessions : "—"}
        accent="violet"
      />
      <SummaryCard
        label="Assignments"
        value={loaded ? stats.assignments : "—"}
        accent="emerald"
      />
      <SummaryCard
        label="Exams"
        value={loaded ? stats.exams : "—"}
        accent="amber"
      />
    </section>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "blue" | "violet" | "emerald" | "amber";
}) {
  return (
    <div className={`dashboard-summary-card dashboard-summary-card-${accent}`}>
      <p className="dashboard-summary-label">{label}</p>
      <p className="dashboard-summary-value">{value}</p>
    </div>
  );
}
