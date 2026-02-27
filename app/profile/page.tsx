"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileCard } from "@/components/profile/profile-card";
import { AppShell } from "@/components/app-shell";

// If you're standardizing all pages on primitives instead of AppShell,
// you can swap AppShell out later. This version keeps it stable.

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
    let active = true;

    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;

        if (!user) {
          if (active) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, username, school_level, persona_type")
          .eq("id", user.id)
          .maybeSingle();

        if (!active) return;

        setLoading(false);

        if (error) {
          setMessage(error.message);
          return;
        }

        setProfile((data || null) as Profile | null);
      } catch {
        if (!active) return;
        setLoading(false);
        setMessage("Could not load profile.");
      }
    })();

    return () => {
      active = false;
    };
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
