"use client";

import { useMemo, useState } from "react";

type Score = 1 | 2 | 3 | 4 | 5;

const scoreOptions: Score[] = [1, 2, 3, 4, 5];

function labelForScore(n: Score) {
  switch (n) {
    case 1:
      return "Very low";
    case 2:
      return "Low";
    case 3:
      return "Neutral";
    case 4:
      return "Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
}

export default function AlignmentPage() {
  const [energy, setEnergy] = useState<Score>(3);
  const [focus, setFocus] = useState<Score>(3);
  const [stress, setStress] = useState<Score>(3);
  const [confidence, setConfidence] = useState<Score>(3);

  // Wellness add-on (non-clinical / coaching lens)
  const [movement, setMovement] = useState<Score>(3);
  const [nourishment, setNourishment] = useState<Score>(3);
  const [presence, setPresence] = useState<Score>(3); // mindfulness / calm
  const [connection, setConnection] = useState<Score>(3); // social connectedness
  const [reflection, setReflection] = useState("");

  // optional: subtle “faith sprinkles” as affirmation framing
  const [affirmation, setAffirmation] = useState("");

  const momentum = useMemo(() => {
    // simple baseline momentum score 0–100, can evolve later
    const avg =
      (energy +
        focus +
        (6 - stress) + // invert stress so lower stress helps momentum
        confidence +
        movement +
        nourishment +
        presence +
        connection) /
      8;

    // avg is 1..5-ish, map to 0..100
    const score = Math.round(((avg - 1) / 4) * 100);
    return Math.max(0, Math.min(100, score));
  }, [energy, focus, stress, confidence, movement, nourishment, presence, connection]);

  function handleSave() {
    // Replace this with your DB write (Supabase / server action / API route)
    // For now it’s a safe “still works” placeholder.
    const payload = {
      createdAt: new Date().toISOString(),
      energy,
      focus,
      stress,
      confidence,
      wellness: {
        movement,
        nourishment,
        presence,
        connection,
      },
      reflection: reflection.trim(),
      affirmation: affirmation.trim(),
      momentum,
    };

    console.log("Alignment check-in saved:", payload);
    alert("Saved ✅ (placeholder). Wire to DB next.");
  }

  return (
    <main className="page-shell">
      <div className="page-stack">
        <header className="page-header">
          <h1 className="page-title">State &amp; Alignment</h1>
          <p className="page-subtitle">
            Quick check-in. Own the narrative. Build momentum.
          </p>
        </header>

        {/* HERO / Momentum */}
        <section className="card-surface card-padding dashboard-hero">
          <div className="dashboard-hero-stack">
            <div>
              <div className="muted" style={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                DAILY COACHING PULSE
              </div>
              <div className="dashboard-hero-title" style={{ marginTop: 10 }}>
                Check in with your current state
              </div>
              <p className="dashboard-hero-copy" style={{ marginTop: 10 }}>
                Your strongest growth systems respond to how you actually feel — then
                translate it into the next right move.
              </p>
            </div>

            <div className="dashboard-summary-grid">
              <div className="dashboard-summary-card dashboard-summary-card-blue">
                <div className="dashboard-summary-label">Momentum score</div>
                <div className="dashboard-summary-value">{momentum}</div>
              </div>

              <div className="dashboard-summary-card dashboard-summary-card-violet">
                <div className="dashboard-summary-label">Today’s mode</div>
                <div className="dashboard-summary-value">
                  {momentum >= 75 ? "Locked in" : momentum >= 50 ? "Steady" : "Rebuild"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core state */}
        <section className="card-surface card-padding">
          <div className="section-stack">
            <div>
              <div className="muted" style={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                CORE STATE
              </div>
              <h2 style={{ marginTop: 8, fontSize: "1.6rem", fontWeight: 900 }}>
                Quick ratings (under 60 seconds)
              </h2>
              <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                No clinical framing — just clarity. Choose what’s true right now.
              </p>
            </div>

            <div className="checkin-grid">
              <CheckRow
                label="Energy"
                hint="How resourced you feel today."
                value={energy}
                onChange={setEnergy}
              />
              <CheckRow
                label="Focus"
                hint="How mentally clear and locked in you are."
                value={focus}
                onChange={setFocus}
              />
              <CheckRow
                label="Stress"
                hint="How much pressure you’re carrying right now."
                value={stress}
                onChange={setStress}
              />
              <CheckRow
                label="Confidence"
                hint="How strongly you believe you can execute."
                value={confidence}
                onChange={setConfidence}
              />
            </div>
          </div>
        </section>

        {/* Wellness (holistic / coaching lens) */}
        <section className="card-surface card-padding">
          <div className="section-stack">
            <div>
              <div className="muted" style={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                WELLNESS BASELINE
              </div>
              <h2 style={{ marginTop: 8, fontSize: "1.6rem", fontWeight: 900 }}>
                Whole-person alignment
              </h2>
              <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Subtle, non-clinical metrics that keep you grounded: body, mind, spirit,
                and connection.
              </p>
            </div>

            <div className="checkin-grid">
              <CheckRow
                label="Movement"
                hint="Did you move your body in a way that serves you?"
                value={movement}
                onChange={setMovement}
              />
              <CheckRow
                label="Nourishment"
                hint="Did you fuel in a supportive way (food + hydration)?"
                value={nourishment}
                onChange={setNourishment}
              />
              <CheckRow
                label="Presence"
                hint="Breathing / mindfulness / calm in the nervous system."
                value={presence}
                onChange={setPresence}
              />
              <CheckRow
                label="Connection"
                hint="How connected you feel to people today."
                value={connection}
                onChange={setConnection}
              />
            </div>
          </div>
        </section>

        {/* Reflection + affirmation */}
        <section className="card-surface card-padding">
          <div className="section-stack">
            <div>
              <div className="muted" style={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                NARRATIVE
              </div>
              <h2 style={{ marginTop: 8, fontSize: "1.6rem", fontWeight: 900 }}>
                Optional reflection
              </h2>
              <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                One sentence is enough: what is shaping your day right now?
              </p>
            </div>

            <textarea
              className="textarea-field checkin-notes"
              placeholder="Optional reflection — what is shaping your day right now?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
            />

            <div>
              <div className="muted" style={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                AFFIRMATION (OPTIONAL)
              </div>
              <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Keep it human. Quiet conviction. (Subtle faith-friendly language is welcome —
                not religious-specific.)
              </p>
            </div>

            <input
              className="field"
              placeholder='Ex: "I move with purpose. I am guided. I do the next right thing."'
              value={affirmation}
              onChange={(e) => setAffirmation(e.target.value)}
            />
          </div>
        </section>

        {/* Save */}
        <section className="card-surface card-padding">
          <div className="btn-row">
            <button className="btn-primary" onClick={handleSave}>
              Save Today&apos;s Check-In
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setEnergy(3);
                setFocus(3);
                setStress(3);
                setConfidence(3);
                setMovement(3);
                setNourishment(3);
                setPresence(3);
                setConnection(3);
                setReflection("");
                setAffirmation("");
              }}
            >
              Reset
            </button>
          </div>
          <p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
            Next: we wire this to DB, add streak logic, and feed a “Momentum Score” trend on
            Progress.
          </p>
        </section>
      </div>
    </main>
  );
}

function CheckRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: Score;
  onChange: (v: Score) => void;
}) {
  return (
    <div className="checkin-row">
      <div className="checkin-row-copy">
        <div className="checkin-row-label">{label}</div>
        <p className="checkin-row-hint">{hint}</p>
      </div>

      <select
        className="select-field checkin-select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Score)}
        aria-label={`${label} score`}
        title={labelForScore(value)}
      >
        {scoreOptions.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
