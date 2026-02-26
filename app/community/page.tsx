"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedList } from "@/components/feed/feed-list";

export default function CommunityPage() {
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
      title="Community"
      subtitle="Progress-first social momentum. Learn, share, support."
    >
      {userId ? (
        <FeedComposer userId={userId} onPosted={() => setReloadKey((k) => k + 1)} />
      ) : (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading community tools…
        </section>
      )}

      <FeedList reloadKey={reloadKey} />
    </AppShell>
  );
}
