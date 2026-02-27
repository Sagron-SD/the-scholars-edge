"use client";

import * as React from "react";

type Level = 1 | 2 | 3 | 4 | 5;

type AlignmentState = {
  energy: Level;
  focus: Level;
  stress: Level;
  confidence: Level;
  body: Level; // physical
  mind: Level; // mental/emotional
  spirit: Level; // spiritual (subtle)
  reflection: string;
  affirmation: string;
};

const DEFAULT_STATE: AlignmentState = {
  energy: 3,
  focus: 3,
  stress: 3,
  confidence: 3,
  body: 3,
  mind: 3,
  spirit: 3,
  reflection: "",
  affirmation: "",
};

function clampLevel(n: number): Level {
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return n as Level;
}

function SelectRow({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: Level;
  onChange: (v: Level) => void;
}) {
  return (
    <div className="card-surface card-padding">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white text-lg font-semibold">{label}</div>
          <div className="text-zinc-400 text-sm mt-1">{helper}</div>
        </div>

        <div className="shrink-0">
          <select
            className="input w-[92px]"
            value={value}
            onChange={(e) => onChange(clampLevel(Number(e.target.value)))}
            aria-label={label}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function AlignmentCheckin() {
  const [state, setState] = React.useState<AlignmentState>(DEFAULT_STATE);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState<null | "ok" | "err">(null);

  // Optional: keep this local-only for now (per your direction).
  async function onSave() {
    setSaving(true);
    setSaved(null);

    try {
      // Lightweight local persistence so the UX feels “real” immediately.
      // You can replace this later with a DB call (Supabase/Prisma/etc).
      const payload = {
        ...state,
        createdAt: new Date().toISOString(),
        kind: "alignment_checkin",
      };

      const key = "tse_alignment_checkins";
      const existingRaw =
        typeof window !== "undefined" ? localStorage.getItem(key) : null;
      const existing = existingRaw ? (JSON.parse(existingRaw) as any[]) : [];
      localStorage.setItem(key, JSON.stringify([payload, ...existing].slice(0, 30)));

      setSaved("ok");
      // keep inputs (don’t wipe) — feels more premium and reflective
    } catch {
      setSaved("err");
    } finally {
      setSaving(false);
    }
  }

  const subtleSpiritPrompt =
    "Tiny anchor (optional): one sentence that reconnects you to meaning (gratitude, intention, belief, or calm).";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-8">
      {/* Header */}
      <div className="mb-6">
        <div className="text-zinc-400 text-sm tracking-widest uppercase">
          Daily Coaching Pulse
        </div>
        <h1 className="text-white text-4xl font-extrabold mt-2">
          State & Alignment
        </h1>
        <p className="text-zinc-400 mt-2">
          A fast check-in to keep momentum clean: mind, body, spirit — without
          turning it clinical.
        </p>
      </div>

      {/* Core state (fast) */}
      <div className="grid gap-4">
        <SelectRow
          label="Energy"
          helper="How resourced you feel today."
          value={state.energy}
          onChange={(v) => setState((s) => ({ ...s, energy: v }))}
        />
        <SelectRow
          label="Focus"
          helper="How locked in and mentally clear you are."
          value={state.focus}
          onChange={(v) => setState((s) => ({ ...s, focus: v }))}
        />
        <SelectRow
          label="Stress"
          helper="How much pressure you’re carrying right now."
          value={state.stress}
          onChange={(v) => setState((s) => ({ ...s, stress: v }))}
        />
        <SelectRow
          label="Confidence"
          helper="How strongly you believe in your ability to execute."
          value={state.confidence}
          onChange={(v) => setState((s) => ({ ...s, confidence: v }))}
        />
      </div>

      {/* Wellness (holistic but performant) */}
      <div className="mt-8 mb-4">
        <div className="text-zinc-400 text-sm tracking-widest uppercase">
          Wellness alignment
        </div>
        <h2 className="text-white text-2xl font-bold mt-2">
          Mind • Body • Spirit
        </h2>
        <p className="text-zinc-400 mt-2">
          Keep this simple. The goal is awareness → one clean adjustment.
        </p>
      </div>

      <div className="grid gap-4">
        <SelectRow
          label="Body"
          helper="Physical readiness (sleep, movement, hydration)."
          value={state.body}
          onChange={(v) => setState((s) => ({ ...s, body: v }))}
        />
        <SelectRow
          label="Mind"
          helper="Emotional steadiness (clarity, self-talk, regulation)."
          value={state.mind}
          onChange={(v) => setState((s) => ({ ...s, mind: v }))}
        />
        <SelectRow
          label="Spirit"
          helper="Meaning + inner calm (subtle, not religious)."
          value={state.spirit}
          onChange={(v) => setState((s) => ({ ...s, spirit: v }))}
        />
      </div>

      {/* Reflection + affirmations (human-written) */}
      <div className="mt-8 grid gap-4">
        <div className="card-surface card-padding">
          <div className="text-white text-lg font-semibold">Optional reflection</div>
          <div className="text-zinc-400 text-sm mt-1">
            What’s shaping your day right now — and what’s the one adjustment that would help?
          </div>
          <textarea
            className="textarea mt-4 w-full min-h-[110px]"
            value={state.reflection}
            onChange={(e) => setState((s) => ({ ...s, reflection: e.target.value }))}
            placeholder="Ex: I’m scattered because I’m overcommitted. One adjustment: pick 1 priority move and protect 30 minutes."
          />
        </div>

        <div className="card-surface card-padding">
          <div className="text-white text-lg font-semibold">Affirmation (human-written)</div>
          <div className="text-zinc-400 text-sm mt-1">
            Write it like you’re talking to your future self — calm, direct, true.
          </div>
          <textarea
            className="textarea mt-4 w-full min-h-[92px]"
            value={state.affirmation}
            onChange={(e) => setState((s) => ({ ...s, affirmation: e.target.value }))}
            placeholder="Ex: I act with clarity and discipline. I don’t need perfect conditions — I need one honest step."
          />
          <div className="text-zinc-500 text-xs mt-3">{subtleSpiritPrompt}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Today’s Check-In"}
        </button>

        <button
          className="btn-secondary w-full"
          onClick={() => {
            setState(DEFAULT_STATE);
            setSaved(null);
          }}
          disabled={saving}
        >
          Reset
        </button>

        {saved === "ok" && (
          <div className="text-emerald-400 text-sm mt-1">
            Saved. Momentum stays clean when you check in daily.
          </div>
        )}
        {saved === "err" && (
          <div className="text-red-400 text-sm mt-1">
            Couldn’t save. Try again (or we’ll wire DB persistence next).
          </div>
        )}
      </div>
    </div>
  );
}
