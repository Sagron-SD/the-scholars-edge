"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Scores = {
  mental_clarity: number;
  physical_vitality: number;
  inner_alignment: number;
  social_grounding: number;
};

function ScoreRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="checkin-row">
      <div className="checkin-row-copy">
        <div className="checkin-row-label">{label}</div>
        <p className="checkin-row-hint">{hint}</p>
      </div>

      <select
        className="select-field checkin-select"
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AlignmentCheckin() {
  const supabase = useMemo(() => createBrowserClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [scores, setScores] = useState<Scores>({
    mental_clarity: 3,
    physical_vitality: 3,
    inner_alignment: 3,
    social_grounding: 3,
  });

  const [theme, setTheme] = useState("");
  const [reflection, setReflection] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const [affirmationPublic, setAffirmationPublic] = useState(true);
  const [affirmationAnonymous, setAffirmationAnonymous] = useState(true);

  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  // Load user + today check-in if exists
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

        if (!active) return;
        setUserId(user.id);

        const { data: existing, error } = await supabase
          .from("alignment_checkins")
          .select(
            "mental_clarity, physical_vitality, inner_alignment, social_grounding, theme, reflection"
          )
          .eq("user_id", user.id)
          .eq("checkin_date", today)
          .maybeSingle();

        if (!active) return;

        if (!error && existing) {
          setScores({
            mental_clarity: existing.mental_clarity ?? 3,
            physical_vitality: existing.physical_vitality ?? 3,
            inner_alignment: existing.inner_alignment ?? 3,
            social_grounding: existing.social_grounding ?? 3,
          });
          setTheme(existing.theme ?? "");
          setReflection(existing.reflection ?? "");
          setSaved(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase, today]);

  const average =
    (scores.mental_clarity +
      scores.physical_vitality +
      scores.inner_alignment +
      scores.social_grounding) /
    4;

  async function saveQuickCheck() {
    if (!userId) return;

    setSaving(true);
    setMsg(null);

    const payload = {
      user_id: userId,
      checkin_date: today,
      ...scores,
      theme: theme.trim() || null,
      // reflection is optional and can be saved later; keep it if present
      reflection: reflection.trim() || null,
    };

    const { error } = await supabase
      .from("alignment_checkins")
      .upsert(payload, { onConflict: "user_id,checkin_date" });

    setSaving(false);

    if (error) return setMsg(error.message);

    setSaved(true);
    setMsg("Saved ✅");
  }

  async function saveAffirmation() {
    if (!userId) return;

    const text = affirmation.trim();
    if (!text) return setMsg("Write an affirmation first.");

    setSaving(true);
    setMsg(null);

    const { error } = await supabase.from("affirmations").insert({
      user_id: userId,
      content: text,
      visibility: affirmationPublic ? "public" : "private",
      is_anonymous: affirmationPublic ? affirmationAnonymous : false,
    });

    setSaving(false);

    if (error) return setMsg(error.message);

    setAffirmation("");
    setMsg(affirmationPublic ? "Affirmation posted ✅" : "Affirmation saved ✅");
  }

  if (loading) {
    return (
      <section className="card-surface card-padding">
        <p className="muted">Loading your alignment…</p>
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="card-surface card-padding">
        <p className="muted">Please sign in to use Alignment.</p>
      </section>
    );
  }

  return (
    <div className="section-stack">
      {/* Quick Summary */}
      <section className="card-surface card-padding">
        <div className="section-stack" style={{ gap: 10 }}>
          <p className="muted">Today’s Alignment</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
              {average.toFixed(1)} / 5
            </h2>
            <p className="muted text-sm">
              A quick calibration — consistency beats intensity.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Check (≤ 60 sec) */}
      <section className="card-surface card-padding section-stack">
        <div className="section-stack" style={{ gap: 8 }}>
          <h3>Quick Check</h3>
          <p className="muted">
            Rate your state in under a minute. Then move forward with clarity.
          </p>
        </div>

        <div className="checkin-grid">
          <ScoreRow
            label="Mental Clarity"
            hint="Focus, calm, and cognitive steadiness."
            value={scores.mental_clarity}
            onChange={(v) => setScores((s) => ({ ...s, mental_clarity: v }))}
          />
          <ScoreRow
            label="Physical Vitality"
            hint="Energy, recovery, and readiness."
            value={scores.physical_vitality}
            onChange={(v) => setScores((s) => ({ ...s, physical_vitality: v }))}
          />
          <ScoreRow
            label="Inner Alignment"
            hint="Values, intention, and groundedness."
            value={scores.inner_alignment}
            onChange={(v) => setScores((s) => ({ ...s, inner_alignment: v }))}
          />
          <ScoreRow
            label="Social Grounding"
            hint="Connection, support, and belonging."
            value={scores.social_grounding}
            onChange={(v) => setScores((s) => ({ ...s, social_grounding: v }))}
          />
        </div>

        <input
          className="field"
          placeholder="Theme of the day (optional) — e.g., Discipline, Peace, Momentum"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        <div className="btn-row">
          <button
            type="button"
            className="btn-primary"
            disabled={saving}
            onClick={saveQuickCheck}
          >
            {saving ? "Saving…" : saved ? "Update Today" : "Save Today"}
          </button>
        </div>

        {msg ? <p className="muted">{msg}</p> : null}
      </section>

      {/* Optional Deepen */}
      <section className="card-surface card-padding section-stack">
        <div className="section-stack" style={{ gap: 8 }}>
          <h3>Optional: Deepen</h3>
          <p className="muted">
            If you want to own your narrative, add a short reflection or affirmation.
          </p>
        </div>

        <textarea
          className="textarea-field checkin-notes"
          rows={5}
          placeholder="Reflection (private) — What’s real today? What matters? What’s the next right move?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />

        <div className="btn-row">
          <button
            type="button"
            className="btn-secondary"
            disabled={saving}
            onClick={saveQuickCheck}
          >
            {saving ? "Saving…" : "Save Reflection"}
          </button>
        </div>

        <div className="section-stack" style={{ gap: 10 }}>
          <textarea
            className="textarea-field"
            rows={3}
            placeholder="Affirmation (human) — share a line someone else might need today…"
            value={affirmation}
            onChange={(e) => setAffirmation(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-3">
            <label className="muted text-sm" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={affirmationPublic}
                onChange={(e) => setAffirmationPublic(e.target.checked)}
              />
              Share publicly
            </label>

            {affirmationPublic ? (
              <label className="muted text-sm" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={affirmationAnonymous}
                  onChange={(e) => setAffirmationAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
            ) : null}
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="btn-primary"
              disabled={saving}
              onClick={saveAffirmation}
            >
              {saving ? "Saving…" : affirmationPublic ? "Post Affirmation" : "Save Affirmation"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
