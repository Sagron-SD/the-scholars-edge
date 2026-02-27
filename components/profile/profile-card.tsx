"use client";

type Profile = {
  full_name: string | null;
  username: string | null;
  school_level: string | null;
  persona_type: string | null;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SE";
  const first = parts[0]?.[0] ?? "S";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

export function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="premium-panel premium-panel-padding">
        <p className="premium-copy">No profile data yet.</p>
      </section>
    );
  }

  const displayName = profile.full_name || "Scholar";
  const handle = profile.username ? `@${profile.username}` : "@scholar";
  const avatar = initialsFromName(displayName);

  return (
    <section className="premium-panel premium-panel-padding premium-stack">
      <div className="profile-hero">
        <div className="profile-identity">
          <p className="profile-kicker">
            SUCCESS COACHING • ACADEMIC GROWTH • WELLNESS
          </p>

          <div>
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-handle">{handle}</p>
          </div>

          <p className="profile-blurb">
            This is the identity that anchors your system. We’ll use it to tailor
            your coaching prompts and planning defaults.
          </p>
        </div>

        <div className="profile-avatar" aria-label="Profile avatar">
          {avatar}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-tile">
          <p className="label">Persona</p>
          <p className="value">{profile.persona_type || "Not set"}</p>
          <p className="hint">Your coaching lens for goals, routines, and momentum.</p>
        </div>

        <div className="profile-tile">
          <p className="label">School level</p>
          <p className="value">{profile.school_level || "Not set"}</p>
          <p className="hint">Used to shape study structure and planning cadence.</p>
        </div>

        <div className="profile-tile span-2">
          <p className="label">What’s next</p>
          <p className="value">Next Patch</p>
          <p className="hint">
            Profile editing, streaks, and a wellness baseline (sleep, hydration,
            movement) that ties into your daily coaching.
          </p>
        </div>
      </div>
    </section>
  );
}
