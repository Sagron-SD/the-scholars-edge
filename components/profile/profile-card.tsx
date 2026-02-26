"use client";

type Profile = {
  full_name: string | null;
  username: string | null;
  school_level: string | null;
  persona_type: string | null;
};

export function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="card-surface card-padding text-sm text-zinc-400">
        No profile data yet.
      </section>
    );
  }

  return (
    <section className="card-surface card-padding space-y-4">
      <div>
        <p className="text-sm text-zinc-400">Full Name</p>
        <h2 className="text-lg font-semibold">
          {profile.full_name || "Not set yet"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 p-3">
          <p className="text-sm text-zinc-400">Username</p>
          <p className="font-medium">{profile.username || "Not set"}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 p-3">
          <p className="text-sm text-zinc-400">School Level</p>
          <p className="font-medium">{profile.school_level || "Not set"}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 p-3 md:col-span-2">
          <p className="text-sm text-zinc-400">Persona</p>
          <p className="font-medium">{profile.persona_type || "Not set"}</p>
        </div>
      </div>
    </section>
  );
}
