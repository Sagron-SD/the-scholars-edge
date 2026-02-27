"use client";

import { useEffect, useMemo, useState } from "react";

type CheckInValue = 1 | 2 | 3 | 4 | 5;

type AlignmentEntry = {
  createdAt: string; // ISO
  mental: CheckInValue;
  physical: CheckInValue;
  inner: CheckInValue; // spiritual (non-religious language)
  social: CheckInValue; // interpersonal health
  notes?: string;
};

const STORAGE_KEY = "tse_alignment_entries_v1";

function clampToFive(n: number): CheckInValue {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  if (n === 4) return 4;
  return 5;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function computeMomentum(entry: AlignmentEntry) {
  // Lightweight, non-clinical “momentum” signal: average * 20 = 20–100
  const avg = (entry.mental + entry.physical + entry.inner + entry.social) / 4;
  return Math.round(avg * 20);
}

export default function AlignmentPage() {
  const [mental, setMental] = useState<CheckInValue>(3);
  const [physical, setPhysical] = useState<CheckInValue>(3);
  const [inner, setInner] = useState<CheckInValue>(3);
  const [social, setSocial] = useState<CheckInValue>(3);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<AlignmentEntry[]>([]);
  const [savedPulse, setSavedPulse] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AlignmentEntry[];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {
      // ignore
    }
  }, []);

  function persist(next: AlignmentEntry[]) {
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const todayHint = useMemo(() => {
    // Subtle faith sprinkle without religion: “anchor / gratitude / intention”
    const prompts = [
      "What’s one thing you can control in the next 24 hours?",
      "Name one win (even small) that proves you’re moving.",
      "What would ‘aligned’ look like for the next hour?",
      "What thought do you need to release to move forward?",
      "What’s one gratitude that anchors you today?",
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }, []);

  const currentPreviewMomentum = useMemo(() => {
    const e: AlignmentEntry = {
      createdAt: new Date().toISOString(),
      mental,
      physical,
      inner,
      social,
      notes: notes.trim() || undefined,
    };
    return computeMomentum(e);
  }, [mental, physical, inner, social, notes]);

  function save() {
    const entry: AlignmentEntry = {
      createdAt: new Date().toISOString(),
      mental,
      physical,
      inner,
      social,
      notes: notes.trim() || undefined,
    };
    const next = [entry, ...entries].slice(0, 30); // keep last 30 for now
    persist(next);

    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 700);

    // reset notes only (ratings stay, so it feels fast day-to-day)
    setNotes("");
  }

  const latest = entries[0];
  const latestMomentum = latest ? computeMomentum(latest) : null;

  return (
    <main className="page-shell">
      <div className="page-stack">
        <section className="card-surface card-padding dashboard-hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-kicker">STATE &amp; ALIGNMENT</p>
              <h1 className="hero-title">Own the narrative.</h1>
              <p className="hero-subtitle">
                A fast daily check-in that keeps you honest, calm, and moving.
                <br />
                <span className="muted">60 seconds. No clinical vibe. Just clarity.</span>
              </p>

              <div className="hero-actions">
                <button className="btn-primary" onClick={save}>
                  Save check-in
                </button>
                <a className="btn-secondary" href="/community">
                  Interpersonal Corner
                </a>
              </div>

              <p className="muted" style={{ marginTop: 10 }}>
                Prompt: <span style={{ color: "#cbd5e1" }}>{todayHint}</span>
              </p>
            </div>

            <div className="hero-right">
              <div className="hero-chip">
                <div className="hero-chip-label">Momentum</div>
                <div className="hero-chip-value">{currentPreviewMomentum}</div>
                <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                  Preview score
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card-surface card-padding">
          <div className="progress-list-header">
            <div>
              <h2 className="page-title" style={{ fontSize: "1.35rem" }}>
                Today’s check-in
              </h2>
              <p className="muted">Quick, reflective, performance-aware.</p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {savedPulse ? (
                <span className="progress-chip">Saved ✅</span>
              ) : latest ? (
                <span className="progress-status">
                  Last saved: {formatWhen(latest.createdAt)}
                </span>
              ) : (
                <span className="progress-status">No entries yet</span>
              )}
            </div>
          </div>

          <div className="checkin-grid" style={{ marginTop: 14 }}>
            <CheckRow
              label="Mental"
              hint="Focus, mood, stress, clarity."
              value={mental}
              onChange={(v) => setMental(clampToFive(v))}
            />
            <CheckRow
              label="Physical"
              hint="Energy, sleep, movement, hydration."
              value={physical}
              onChange={(v) => setPhysical(clampToFive(v))}
            />
            <CheckRow
              label="Inner"
              hint="Presence, grounding, breath, gratitude."
              value={inner}
              onChange={(v) => setInner(clampToFive(v))}
            />
            <CheckRow
              label="Social"
              hint="Connection, communication, support."
              value={social}
              onChange={(v) => setSocial(clampToFive(v))}
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="muted" style={{ display: "block", marginBottom: 8 }}>
              Notes (optional) — keep it real, keep it short.
            </label>
            <textarea
              className="textarea-field checkin-notes"
              rows={4}
              placeholder="What mattered today? What’s the next right move?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn-primary" onClick={save}>
              Save check-in
            </button>
            <a className="btn-ghost" href="/progress">
              View momentum over time →
            </a>
          </div>
        </section>

        <section className="card-surface card-padding">
          <h2 className="page-title" style={{ fontSize: "1.35rem" }}>
            Recent check-ins
          </h2>
          <p className="muted">Your private log (for now). We’ll add sharing controls later.</p>

          <div className="section-stack" style={{ marginTop: 14 }}>
            {entries.length === 0 ? (
              <div className="focus-item muted">
                No check-ins yet. Save one above — consistency is the product.
              </div>
            ) : (
              entries.slice(0, 6).map((e) => (
                <div key={e.createdAt} className="focus-item">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div className="muted">{formatWhen(e.createdAt)}</div>
                    <div className="progress-chip">Momentum {computeMomentum(e)}</div>
                  </div>
                  <div className="muted" style={{ marginTop: 10 }}>
                    Mental {e.mental} • Physical {e.physical} • Inner {e.inner} • Social {e.social}
                  </div>
                  {e.notes ? (
                    <div style={{ marginTop: 10, color: "#f8fafc", whiteSpace: "pre-wrap" }}>
                      {e.notes}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          {latestMomentum !== null ? (
            <p className="muted" style={{ marginTop: 14 }}>
              Last saved momentum: <span style={{ color: "#bfdbfe", fontWeight: 800 }}>{latestMomentum}</span>
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function CheckRow(props: {
  label: string;
  hint: string;
  value: CheckInValue;
  onChange: (v: number) => void;
}) {
  return (
    <div className="checkin-row">
      <div className="checkin-row-copy">
        <div className="checkin-row-label">{props.label}</div>
        <p className="checkin-row-hint">{props.hint}</p>
      </div>

      <select
        className="select-field checkin-select"
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        aria-label={`${props.label} check-in`}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
    </div>
  );
}
