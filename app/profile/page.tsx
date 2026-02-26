"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createBrowserClient } from "@/lib/supabase/browser";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileCard } from "@/components/profile/profile-card";

type Profile = {
  full_name: string | null;
  username: string | null;
  school_level: string | null;
  persona_type: string | null;
};

export default function ProfilePage() {
  const supabase = createBrowserClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, school_level, persona_type")
        .eq("id", user.id)
        .maybeSingle();

      setLoading(false);

      if (error) return setMessage(error.message);
      setProfile((data || null) as Profile | null);
    })();
  }, [supabase]);

  return (
    <AppShell title="Profile" subtitle="Your identity, settings, and streak.">
      {loading ? (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading profile…
        </section>
      ) : (
        <ProfileCard profile={profile} />
      )}

      <section className="card-surface card-padding space-y-3">
        <h2 className="font-semibold">Account Actions</h2>
        <p className="text-sm text-zinc-400">
          More profile editing controls are coming next.
        </p>
        <SignOutButton />
      </section>

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </AppShell>
  );
}
