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

function ProfileTile({
  label,
  value,
  hint,
  fullWidth = false,
}: {
  label: string;
  value: string;
  hint: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.84)",
        padding: 18,
        boxShadow: "var(--shadow-sm)",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          fontWeight: 800,
        }}
      >
        {label}
      </p>

      <p
        style={{
          marginTop: 10,
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "var(--text)",
        }}
      >
        {value}
      </p>

      <p
        style={{
          marginTop: 8,
          color: "var(--text-soft)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {hint}
      </p>
    </div>
  );
}

export function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="card-surface card-padding">
        <p className="premium-copy">No profile data yet.</p>
      </section>
    );
  }

  const displayName = profile.full_name || "Scholar";
  const handle = profile.username ? `@${profile.username}` : "@scholar";
  const avatar = initialsFromName(displayName);

  return (
    <section className="card-surface card-padding">
      <div className="section-stack">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div className="section-stack" style={{ gap: 12, flex: 1, minWidth: 0 }}>
            <div className="hero-kicker">Identity</div>

            <div className="section-stack" style={{ gap: 6 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                  lineHeight: 0.95,
                  fontWeight: 800,
                  letterSpacing: "-0.07em",
                  color: "var(--text)",
                }}
              >
                {displayName}
              </h1>

              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              >
                {handle}
              </p>
            </div>

            <p className="premium-copy" style={{ maxWidth: 680 }}>
              This is the identity layer that anchors your system. It shapes how the
              app frames your coaching prompts, planning flow, and growth language.
            </p>
          </div>

          <div
            aria-label="Profile avatar"
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              border: "1px solid rgba(22, 195, 91, 0.14)",
              background: "rgba(255, 255, 255, 0.88)",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--shadow-sm)",
              color: "var(--primary-deep)",
              fontFamily: "var(--font-display)",
              fontSize: "1.35rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            {avatar}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <ProfileTile
            label="Persona"
            value={profile.persona_type || "Not set"}
            hint="Your coaching lens for goals, routines, and momentum."
          />

          <ProfileTile
            label="School Level"
            value={profile.school_level || "Not set"}
            hint="Used to shape study structure and planning cadence."
          />

          <ProfileTile
            label="What’s Next"
            value="Next Patch"
            hint="Profile editing, streaks, and a wellness baseline that ties into your daily coaching."
            fullWidth
          />
        </div>
      </div>
    </section>
  );
}
