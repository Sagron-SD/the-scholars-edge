"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/bottom-nav";
import { createBrowserClient } from "@/lib/supabase/browser";
import { PomodoroTimer } from "@/components/study/pomodoro-timer";
import { StudySessionList } from "@/components/study/study-session-list";
import { CourseForm } from "@/components/study/course-form";
import { CourseList } from "@/components/study/course-list";
import { AssignmentForm } from "@/components/study/assignment-form";
import { ExamForm } from "@/components/study/exam-form";
import { UpcomingAcademicItems } from "@/components/study/upcoming-academic-items";
import {
  PageShell,
  PageStack,
  PageHeader,
  Card,
  Muted,
} from "@/components/ui/primitives";

export default function StudyPage() {
  const [supabase] = useState(() => createBrowserClient());
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) setUserId(data.user.id);
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <PageShell>
      <PageStack>
        <PageHeader
          title="Study"
          subtitle="Focused work, logged sessions, and academic momentum."
        />

        <Card className="dashboard-hero">
          <div className="dashboard-hero-stack">
            <div className="section-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Study System</p>
              <h2 className="dashboard-hero-title">
                Build disciplined focus and make your work visible.
              </h2>
              <p className="dashboard-hero-copy">
                Track time, log sessions, manage academic responsibilities, and keep your study process intentional.
              </p>
            </div>
          </div>
        </Card>

        {userId ? (
          <>
            <PomodoroTimer
              userId={userId}
              onLogged={() => setReloadKey((k) => k + 1)}
            />
            <StudySessionList userId={userId} reloadKey={reloadKey} />

            <CourseForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
            <CourseList userId={userId} reloadKey={reloadKey} />

            <AssignmentForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
            <ExamForm userId={userId} onCreated={() => setReloadKey((k) => k + 1)} />
            <UpcomingAcademicItems userId={userId} reloadKey={reloadKey} />
          </>
        ) : (
          <Card>
            <Muted>Loading study tools…</Muted>
          </Card>
        )}
      </PageStack>

      <BottomNav />
    </PageShell>
  );
}
