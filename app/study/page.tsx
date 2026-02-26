"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { PomodoroTimer } from "@/components/study/pomodoro-timer";
import { StudySessionList } from "@/components/study/study-session-list";

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
    <AppShell title="Study" subtitle="Focused work, logged sessions, and academic momentum.">
      {userId ? (
        <>
          <PomodoroTimer userId={userId} onLogged={() => setReloadKey((k) => k + 1)} />
          <StudySessionList userId={userId} reloadKey={reloadKey} />
        </>
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading study tools…
        </section>
      )}
    </AppShell>
  );
}
