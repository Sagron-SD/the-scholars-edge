"use client";

type Profile = {
  full_name: string | null;
  username: string | null;
  school_level: string | null;
  persona_type: string | null;
};

function initialsFromName(name: string | null) {
  const safe = (name || "").trim();
  if (!safe) return "SE";
  const parts = safe.split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
  return initials || "SE";
}

function safeHandle(username: string | null) {
  const raw = (username || "").trim();
  if (!raw) return "scholar";
  return raw.replace(/\s+/g, "").slice(0, 24).toLowerCase();
}

function prettyPersona(p: string | null) {
  return (p || "").trim() || "Not set";
}

function prettySchoolLevel(s: string | null) {
  return (s || "").trim() || "Not set";
}

export function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="card-surface card-padding text-sm text-zinc-400">
        No profile data yet.
      </section>
    );
  }

  const displayName = (profile.full_name || "").trim() || "Scholar";
  const handle = `@${safeHandle(profile.username)}`;
  const persona = prettyPersona(profile.persona_type);
  const school = prettySchoolLevel(profile.school_level);

  return (
    <section className="card-surface card-padding section-stack">
      {/* Brand strip */}
      <div className="section-stack" style={{ gap: 10 }}>
        <p className="text-xs uppercase tracking-[0.22em] text-blue-200/90">
          Success Coaching • Academic Growth • Wellness
        </p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {displayName}
            </h2>
            <p className="text-sm text-zinc-400">{handle}</p>
          </div>

          {/* Avatar */}
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/10 text-sm font-semibold text-blue-200"
            style={{
              boxShadow:
                "0 0 0 1px rgba(59,130,246,0.18) inset, 0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {initialsFromName(profile.full_name)}
          </div>
        </div>

        <p className="text-sm text-zinc-300">
          This is the identity that anchors your system. We’ll use it to tailor
          your coaching prompts and planning defaults.
        </p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Persona
          </p>
          <p className="mt-1 text-base font-semibold text-zinc-100">{persona}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Your coaching lens for goals, routines, and momentum.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            School level
          </p>
          <p className="mt-1 text-base font-semibold text-zinc-100">{school}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Used to shape study structure and planning cadence.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 md:col-span-2">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            What’s next
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            Next patch: profile editing, streaks, and a wellness baseline (sleep,
            hydration, movement) that ties into your daily coaching.
          </p>
        </div>
      </div>
    </section>
  );
}
