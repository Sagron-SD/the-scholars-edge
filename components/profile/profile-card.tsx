"use client";

type Profile = {
  full_name: string | null;
  username: string | null;
  school_level: string | null;
  persona_type: string | null;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const a = parts[0]?.[0] ?? "S";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="card-surface card-padding text-sm text-zinc-400">
        No profile data yet.
      </section>
    );
  }

  const displayName = profile.full_name || "Scholar";
  const handle = profile.username ? `@${profile.username}` : "@scholar";
  const badge = initials(displayName);

  return (
    <section className="profile-panel profile-panel-padding">
      <div className="profile-hero">
        <div className="profile-identity">
          <div className="profile-kicker">
            Success Coaching • Academic Growth • Wellness
          </div>

          <div>
            <div className="profile-name">{displayName}</div>
            <div className="profile-handle">{handle}</div>
          </div>

          <div className="profile-blurb">
            This is the identity that anchors your system. We’ll use it to tailor
            your coaching prompts and planning defaults.
          </div>
        </div>

        <div className="profile-avatar" aria-label="Profile avatar">
          {badge}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-tile">
          <div className="label">Persona</div>
          <div className="value">{profile.persona_type || "Not set"}</div>
          <div className="hint">Your coaching lens for goals, routines, and momentum.</div>
        </div>

        <div className="profile-tile">
          <div className="label">School Level</div>
          <div className="value">{profile.school_level || "Not set"}</div>
          <div className="hint">Used to shape study structure and planning cadence.</div>
        </div>

        <div className="profile-tile profile-span-2">
          <div className="label">What’s Next</div>
          <div className="value">Next Patch</div>
          <div className="hint">
            Profile editing, streaks, and a wellness baseline (sleep, hydration,
            movement) that ties into your daily coaching.
          </div>
        </div>
      </div>
    </section>
  );
}
