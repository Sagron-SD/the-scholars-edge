"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

const PERSONAS = [
  "Disciplined Scholar",
  "Future Founder",
  "Career Builder",
  "Wellness-First Achiever",
] as const;

export default function OnboardingPage() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [personaType, setPersonaType] = useState<(typeof PERSONAS)[number] | "">("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.replace("/auth/sign-in");
    })();
  }, [router, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card-surface card-padding w-full max-w-lg space-y-4">
        <h1 className="text-xl font-semibold">Welcome to The Scholars Edge</h1>
        <p className="text-sm text-zinc-400">
          Let’s set your profile so we can personalize your success system.
        </p>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
            placeholder="School level (e.g., High School, Undergrad, Grad)"
            value={schoolLevel}
            onChange={(e) => setSchoolLevel(e.target.value)}
          />

          <select
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
            value={personaType}
            onChange={(e) => setPersonaType(e.target.value as any)}
          >
            <option value="">Select your persona</option>
            {PERSONAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
          disabled={loading}
          onClick={async () => {
            setMsg(null);
            setLoading(true);

            const { data: u } = await supabase.auth.getUser();
            const user = u.user;

            if (!user) {
              setLoading(false);
              return setMsg("Not signed in.");
            }

            const username = (user.email?.split("@")[0] || "scholar").slice(0, 30);

            const { error } = await supabase.from("profiles").upsert({
              id: user.id,
              full_name: fullName || null,
              school_level: schoolLevel || null,
              persona_type: personaType || null,
              username,
            });

            setLoading(false);

            if (error) return setMsg(error.message);

            router.replace("/");
            router.refresh();
          }}
        >
          {loading ? "Saving…" : "Continue"}
        </button>

        {msg ? <p className="text-sm text-red-300">{msg}</p> : null}
      </div>
    </main>
  );
}
