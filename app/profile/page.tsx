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

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        setProfile((data || null) as Profile | null);
        setLoading(false);
      } catch {
        if (!active) return;
        setMessage("Could not load profile.");
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <AppShell
      title="Profile"
      subtitle="Your identity, preferences, and account settings."
    >
      {loading ? (
        <section className="card-surface card-padding text-sm text-zinc-400">
          Loading profile…
        </section>
      ) : (
        <ProfileCard profile={profile} />
      )}

      <section className="card-surface card-padding section-stack">
        <div className="section-stack" style={{ gap: 6 }}>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Account
          </p>
          <h2 className="text-lg font-semibold">Account actions</h2>
          <p className="text-sm text-zinc-400">
            Manage your session and security.
          </p>
        </div>

        <div className="btn-row" style={{ justifyContent: "flex-start" }}>
          <SignOutButton />
        </div>

        {message ? (
          <p className="text-sm text-red-300">{message}</p>
        ) : null}
      </section>
    </AppShell>
  );
}
