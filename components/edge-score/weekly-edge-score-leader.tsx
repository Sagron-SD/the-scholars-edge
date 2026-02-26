"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { calculateWeeklyEdgeScore } from "@/lib/edge-score";
import { WeeklyEdgeScore } from "@/components/edge-score/weekly-edge-score";

type Checkin = {
  energy: number;
  stress: number;
};

export function WeeklyEdgeScoreLoader() {
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [score, setScore] = useState<{
    execution: number;
    consistency: number;
    academicFocus: number;
    recovery: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const mondayDate = monday.toISOString().slice(0, 10);
      const mondayIso = monday.toISOString();

      const [
        { data: checkins, error: checkinError },
        { data: milestones, error: milestoneError },
        { data: sessions, error: sessionError },
      ] = await Promise.all([
        supabase
          .from("daily_checkins")
          .select("energy, stress")
          .eq("user_id", user.id)
          .gte("checkin_date", mondayDate),
        supabase
          .from("milestones")
          .select("progress_percent")
          .eq("user_id", user.id),
        supabase
          .from("study_sessions")
          .select("duration_minutes")
          .eq("user_id", user.id)
          .gte("started_at", mondayIso),
      ]);

      if (checkinError || milestoneError || sessionError) {
        setLoading(false);
        return setMessage(
          checkinError?.message || milestoneError?.message || sessionError?.message || "Could not load score."
        );
      }

      const totalStudyMinutes = (sessions || []).reduce(
        (sum, s) => sum + Number(s.duration_minutes || 0),
        0
      );

      const breakdown = calculateWeeklyEdgeScore({
        checkins: (checkins || []) as Checkin[],
        milestoneProgressValues: (milestones || []).map((m) => Number(m.progress_percent || 0)),
        studyMinutes: totalStudyMinutes,
      });

      setScore(breakdown);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return (
      <section className="card-surface card-padding text-sm text-zinc-400">
        Calculating weekly edge score…
      </section>
    );
  }

  if (message) {
    return <p className="text-sm text-red-300">{message}</p>;
  }

  if (!score) {
    return (
      <section className="card-surface card-padding text-sm text-zinc-400">
        No score available yet.
      </section>
    );
  }

  return <WeeklyEdgeScore score={score} />;
}
