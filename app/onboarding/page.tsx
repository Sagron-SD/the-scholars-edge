"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

const PERSONAS = [
  {
    value: "Disciplined Scholar",
    title: "Disciplined Scholar",
    copy: "Focused on structure, consistency, and academic excellence.",
  },
  {
    value: "Future Founder",
    title: "Future Founder",
    copy: "Driven by ambition, leadership, and building something meaningful.",
  },
  {
    value: "Career Builder",
    title: "Career Builder",
    copy: "Optimizing performance, growth, and long-term professional momentum.",
  },
  {
    value: "Wellness-First Achiever",
    title: "Wellness-First Achiever",
    copy: "Balancing achievement with mental, physical, and emotional wellness.",
  },
] as const;

type PersonaValue = (typeof PERSONAS)[number]["value"];

export default function OnboardingPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());

  const [fullName, setFullName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [personaType, setPersonaType] = useState<PersonaValue | "">("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      if (!data.user) {
        router.replace("/auth/sign-in");
      }
    })();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleContinue() {
    setMsg(null);
    setLoading(true);

    const { data: u } = await supabase.auth.getUser();
    const user = u.user;

    if (!user) {
      setLoading(false);
      setMsg("Not signed in.");
      return;
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

    if (error) {
      setMsg(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="auth-page auth-page-centered">
      <div className="auth-centered-wrap" style={{ maxWidth: 920 }}>
        <section className="auth-hero-minimal">
          <p className="auth-brand-kicker">Success Coaching • Academic Growth • Wellness</p>
          <h1 className="auth-brand-title">Build your edge with intention.</h1>
          <p className="auth-brand-subtitle">
            Set your foundation so The Scholars Edge can personalize your academic momentum,
            coaching rhythm, and growth system.
          </p>
        </section>

        <section
          className="premium-panel premium-panel-padding"
          style={{ width: "100%", maxWidth: 760 }}
        >
          <div className="premium-stack">
            <div className="premium-stack" style={{ gap: 8 }}>
              <p className="premium-kicker">Onboarding</p>
              <h2 className="premium-title">Create your success profile</h2>
              <p className="premium-copy">
                A few details help shape a more aligned experience around your goals, pace, and identity.
              </p>
            </div>

            <div className="premium-stack">
              <input
                className="field auth-input"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                className="field auth-input"
                placeholder="School level (e.g. High School, Undergrad, Grad)"
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value)}
              />
            </div>

            <div className="premium-stack" style={{ gap: 10 }}>
              <div>
                <p className="premium-kicker" style={{ marginBottom: 8 }}>
                  Select your persona
                </p>
                <p className="premium-copy">
                  Choose the path that best reflects how you want to grow inside the platform.
                </p>
              </div>

              <div className="premium-option-grid">
                {PERSONAS.map((persona) => {
                  const active = personaType === persona.value;

                  return (
                    <button
                      key={persona.value}
                      type="button"
                      className={`premium-option ${active ? "premium-option-active" : ""}`}
                      onClick={() => setPersonaType(persona.value)}
                    >
                      <div className="premium-option-title">{persona.title}</div>
                      <div className="premium-option-copy">{persona.copy}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="auth-cta-button"
              disabled={loading}
              onClick={handleContinue}
            >
              {loading ? "Saving…" : "Enter Your Dashboard"}
            </button>

            {msg ? <p className="auth-message">{msg}</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
