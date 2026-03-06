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
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (active && data.user) {
        setUserId(data.user.id);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <AppShell
      kicker="Study Lab"
      title="Study"
      subtitle="Focused work, logged sessions, and academic momentum."
      variant="emerald"
    >
      {userId ? (
        <div className="section-stack">
          <PomodoroTimer
            userId={userId}
            onLogged={() => setReloadKey((k) => k + 1)}
          />

          <StudySessionList userId={userId} reloadKey={reloadKey} />

          <section className="card-surface card-padding">
            <div className="section-stack">
              <div className="section-stack" style={{ gap: 8 }}>
                <p className="premium-kicker">Courses</p>
                <h2 className="premium-title" style={{ fontSize: "2rem" }}>
                  Build your academic system
                </h2>
                <p className="premium-copy">
                  Track courses, credits, grades, and your current academic load.
                </p>
              </div>

              <CourseForm
                userId={userId}
                onCreated={() => setReloadKey((k) => k + 1)}
              />
            </div>
          </section>

          <CourseList userId={userId} reloadKey={reloadKey} />

          <section className="card-surface card-padding">
            <div className="section-stack">
              <div className="section-stack" style={{ gap: 8 }}>
                <p className="premium-kicker">Planner</p>
                <h2 className="premium-title" style={{ fontSize: "2rem" }}>
                  Stay ahead of deadlines
                </h2>
                <p className="premium-copy">
                  Capture assignments and exams before they become pressure.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 18,
                }}
              >
                <AssignmentForm
                  userId={userId}
                  onCreated={() => setReloadKey((k) => k + 1)}
                />
                <ExamForm
                  userId={userId}
                  onCreated={() => setReloadKey((k) => k + 1)}
                />
              </div>
            </div>
          </section>

          <UpcomingAcademicItems userId={userId} reloadKey={reloadKey} />
        </div>
      ) : (
        <section className="card-surface card-padding">
          <p className="muted">Loading study tools…</p>
        </section>
      )}
    </AppShell>
  );
}
