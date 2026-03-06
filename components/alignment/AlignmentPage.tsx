"use client";

import { useEffect, useMemo, useState } from "react";

type CheckInValue = 1 | 2 | 3 | 4 | 5;

type AlignmentEntry = {
  createdAt: string;
  mental: CheckInValue;
  physical: CheckInValue;
  inner: CheckInValue;
  social: CheckInValue;
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
  const avg =
    (entry.mental + entry.physical + entry.inner + entry.social) / 4;
  return Math.round(avg * 20);
}

function StatusChip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success";
}) {
  const success = tone === "success";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 34,
        padding: "0 12px",
        borderRadius: 999,
        border: success
          ? "1px solid rgba(22, 195, 91, 0.16)"
          : "1px solid rgba(15, 23, 42, 0.08)",
        background: success
          ? "rgba(22, 195, 91, 0.08)"
          : "rgba(15, 23, 42, 0.04)",
        color: success ? "var(--primary-deep)" : "var(--muted)",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </span>
  );
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
    const prompts = [
      "What’s one thing you can control in the next 24 hours?",
      "Name one win, even if it feels small.",
      "What would alignment look like for the next hour?",
      "What thought do you need to release to move forward?",
      "What gratitude keeps you grounded today?",
      "Where do you need more honesty with yourself today?",
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

    const next = [entry, ...entries].slice(0, 30);
    persist(next);

    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 800);
    setNotes("");
  }

  const latest = entries[0];
  const latestMomentum = latest ? computeMomentum(latest) : null;

  return (
    <main className="page-shell">
      <div className="page-stack">
        <section className="card-surface card-padding hero-surface">
          <div className="hero-stack">
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
                <div className="hero-kicker">State &amp; Alignment</div>

                <h1 className="hero-title">Own the narrative.</h1>

                <p className="hero-copy">
                  A fast daily check-in that keeps you grounded, honest, and moving.
                  No clinical framing. Just awareness, alignment, and intentional progress.
                </p>

                <div className="btn-row">
                  <button className="btn-primary" onClick={save}>
                    Save check-in
                  </button>

                  <a className="btn-secondary" href="/community">
                    Interpersonal Corner
                  </a>
                </div>

                <p className="muted" style={{ fontSize: 14 }}>
                  Prompt:{" "}
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    {todayHint}
                  </span>
                </p>
              </div>

              <div
                style={{
                  minWidth: 132,
                  borderRadius: 22,
                  border: "1px solid rgba(22, 195, 91, 0.12)",
                  background: "rgba(255, 255, 255, 0.82)",
                  padding: 18,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    fontWeight: 800,
                  }}
                >
                  Momentum
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-display)",
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    fontWeight: 800,
                    letterSpacing: "-0.06em",
                    color: "var(--text)",
                  }}
                >
                  {currentPreviewMomentum}
                </div>

                <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                  Preview score
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card-surface card-padding">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div className="section-stack" style={{ gap: 6 }}>
              <p className="premium-kicker">Today’s Check-In</p>
              <h2 className="premium-title" style={{ fontSize: "2rem" }}>
                Reflect your current state
              </h2>
              <p className="premium-copy">
                Quick, reflective, and performance-aware.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {savedPulse ? (
                <StatusChip tone="success">Saved ✅</StatusChip>
              ) : latest ? (
                <StatusChip>Last saved: {formatWhen(latest.createdAt)}</StatusChip>
              ) : (
                <StatusChip>No entries yet</StatusChip>
              )}
            </div>
          </div>

          <div className="checkin-grid" style={{ marginTop: 16 }}>
            <CheckRow
              label="Mental"
              hint="Focus, mood, stress, and clarity."
              value={mental}
              onChange={(v) => setMental(clampToFive(v))}
            />
            <CheckRow
              label="Physical"
              hint="Energy, sleep, movement, and hydration."
              value={physical}
              onChange={(v) => setPhysical(clampToFive(v))}
            />
            <CheckRow
              label="Inner"
              hint="Presence, grounding, breath, and gratitude."
              value={inner}
              onChange={(v) => setInner(clampToFive(v))}
            />
            <CheckRow
              label="Social"
              hint="Connection, communication, and support."
              value={social}
              onChange={(v) => setSocial(clampToFive(v))}
            />
          </div>

          <div className="section-stack" style={{ gap: 8, marginTop: 16 }}>
            <label className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              Notes
            </label>
            <textarea
              className="textarea-field"
              rows={4}
              placeholder="What mattered today? What are you carrying? What’s the next right move?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={save}>
              Save check-in
            </button>
            <a className="btn-ghost" href="/progress">
              View momentum over time →
            </a>
          </div>
        </section>

        <section className="card-surface card-padding">
          <div className="section-stack" style={{ gap: 6 }}>
            <p className="premium-kicker">Recent Check-Ins</p>
            <h2 className="premium-title" style={{ fontSize: "2rem" }}>
              Your private reflection log
            </h2>
            <p className="premium-copy">
              For now, this stays private. Sharing controls can come later.
            </p>
          </div>

          <div className="section-stack" style={{ marginTop: 16 }}>
            {entries.length === 0 ? (
              <div className="focus-item">
                <p className="muted">
                  No check-ins yet. Save one above — consistency is the product.
                </p>
              </div>
            ) : (
              entries.slice(0, 6).map((e) => (
                <article key={e.createdAt} className="focus-item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div className="muted">{formatWhen(e.createdAt)}</div>
                    <StatusChip tone="success">
                      Momentum {computeMomentum(e)}
                    </StatusChip>
                  </div>

                  <div className="muted" style={{ marginTop: 10, fontSize: 14 }}>
                    Mental {e.mental} • Physical {e.physical} • Inner {e.inner} • Social{" "}
                    {e.social}
                  </div>

                  {e.notes ? (
                    <div
                      style={{
                        marginTop: 12,
                        color: "var(--text)",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                      }}
                    >
                      {e.notes}
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </div>

          {latestMomentum !== null ? (
            <p className="muted" style={{ marginTop: 16 }}>
              Last saved momentum:{" "}
              <span style={{ color: "var(--text)", fontWeight: 800 }}>
                {latestMomentum}
              </span>
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
