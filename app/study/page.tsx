"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { PomodoroTimer } from "@/components/study/pomodoro-timer";
import { StudySessionList } from "@/components/study/study-session-list";
import { CourseForm } from "@/components/study/course-form";
import { CourseList } from "@/components/study/course-list";
import { AssignmentForm } from "@/components/study/assignment-form";
import { ExamForm } from "@/components/study/exam-form";
import { UpcomingAcademicItems } from "@/components/study/upcoming-academic-items";

export default function StudyPage() {
  const supabase = createBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    })();
  }, [supabase]);

  return (
    <AppShell
      kicker="Study Lab"
      title="Study"
      subtitle="Focused work, logged sessions, and academic momentum."
      variant="emerald"
    >
      {userId ? (
        <>
          <PomodoroTimer userId={userId} onLogged={() => setReloadKey((k) => k + 1)} />
          <StudySessionList userId={userId} reloadKey={reloadKey} />

          <CourseForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
          <CourseList userId={userId} reloadKey={reloadKey} />

          <AssignmentForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
          <ExamForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
          <UpcomingAcademicItems userId={userId} reloadKey={reloadKey} />
        </>
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading study tools…
        </section>
      )}
    </AppShell>
  );
}
