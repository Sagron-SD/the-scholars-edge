"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { MilestoneCreateForm } from "@/components/progress/milestone-create-form";
import { MilestoneList } from "@/components/progress/milestone-list";

export default function ProgressPage() {
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
      title="Progress"
      subtitle="Track meaningful goals and keep your momentum visible."
    >
      {userId ? (
        <>
          <MilestoneCreateForm
            userId={userId}
            onCreated={() => setReloadKey((k) => k + 1)}
          />
          <MilestoneList key={reloadKey} userId={userId} />
        </>
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading your progress…
        </section>
      )}
    </AppShell>
  );
}
