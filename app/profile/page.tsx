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
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <AppShell
      title="Profile"
      subtitle="Your identity, settings, and personal foundation."
      kicker="Success Coaching • Academic Growth • Wellness"
      hideHero
    >
      {loading ? (
        <section className="card-surface card-padding">
          <p className="muted">Loading profile…</p>
        </section>
      ) : (
        <ProfileCard profile={profile} />
      )}

      <section className="card-surface card-padding">
        <div className="section-stack">
          <div className="section-stack" style={{ gap: 6 }}>
            <p className="premium-kicker">Account</p>
            <h2 className="premium-title" style={{ fontSize: "2rem" }}>
              Account actions
            </h2>
            <p className="premium-copy">
              Profile editing, streaks, and deeper personalization can come next.
            </p>
          </div>

          <div className="btn-row">
            <SignOutButton />
          </div>
        </div>
      </section>

      {message ? (
        <p className="muted" style={{ fontSize: 14 }}>
          {message}
        </p>
      ) : null}
    </AppShell>
  );
}
