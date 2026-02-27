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

        setLoading(false);

        if (error) return setMessage(error.message);
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
    <AppShell
      kicker="Success Coaching • Academic Growth • Wellness"
      title="Profile"
      subtitle="Your identity, settings, and streak."
      variant="blue"
    >
      {loading ? (
        <section className="premium-panel premium-panel-padding">
          <p className="premium-copy">Loading profile…</p>
        </section>
      ) : (
        <ProfileCard profile={profile} />
      )}

      <section className="premium-panel premium-panel-padding premium-stack">
        <div className="premium-stack" style={{ gap: 10 }}>
          <p className="premium-kicker">Account</p>
          <h2 className="premium-title" style={{ fontSize: "1.8rem" }}>
            Account Actions
          </h2>
          <p className="premium-copy">More profile editing controls are coming next.</p>
        </div>

        <div className="btn-row">
          <SignOutButton />
        </div>
      </section>

      {message ? <p className="text-sm text-red-300">{message}</p> : null}
    </AppShell>
  );
}
