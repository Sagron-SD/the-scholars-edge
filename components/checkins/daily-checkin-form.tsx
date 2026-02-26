"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

function SelectRow({
  label,
  value,
  setValue,
  hint,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  hint?: string;
}) {
  return (
    <div className="checkin-row">
      <div className="checkin-row-copy">
        <label className="checkin-row-label">{label}</label>
        {hint ? <p className="checkin-row-hint">{hint}</p> : null}
      </div>

      <select
        value={String(value)}
        onChange={(e) => setValue(Number(e.target.value))}
        className="select-field checkin-select"
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

export function DailyCheckinForm() {
  const [supabase] = useState(() => createBrowserClient());

  const [userId, setUserId] = useState<string | null>(null);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [stress, setStress] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    let active = true;

    async function loadCheckin() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user || !active) return;

        setUserId(data.user.id);

        const { data: checkin } = await supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("checkin_date", today)
          .maybeSingle();

        if (!active || !checkin) return;

        setEnergy(checkin.energy);
        setFocus(checkin.focus);
        setStress(checkin.stress);
        setConfidence(checkin.confidence);
        setNotes(checkin.notes || "");
        setSavedAt(today);
      } catch {
        if (!active) return;
      }
    }

    loadCheckin();

    return () => {
      active = false;
    };
  }, [supabase, today]);

  async function saveCheckin() {
    if (!userId) {
      setMessage("You must be signed in.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from("daily_checkins").upsert(
        {
          user_id: userId,
          checkin_date: today,
          energy,
          focus,
          stress,
          confidence,
          notes: notes.trim() || null,
        },
        { onConflict: "user_id,checkin_date" }
      );

      if (error) {
        setLoading(false);
        setMessage(error.message);
        return;
      }

      setSavedAt(today);
      setMessage("Check-in saved ✅");
    } catch {
      setMessage("Could not save check-in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="premium-panel premium-panel-padding premium-stack">
      <div className="premium-stack" style={{ gap: 8 }}>
        <p className="premium-kicker">Daily Coaching Pulse</p>
        <h2 className="premium-title">Check in with your current state</h2>
        <p className="premium-copy">
          The strongest growth systems respond to how you actually feel, not just what is on the schedule.
        </p>
      </div>

      <div className="checkin-grid">
        <SelectRow
          label="Energy"
          value={energy}
          setValue={setEnergy}
          hint="How resourced you feel today."
        />
        <SelectRow
          label="Focus"
          value={focus}
          setValue={setFocus}
          hint="How locked in and mentally clear you are."
        />
        <SelectRow
          label="Stress"
          value={stress}
          setValue={setStress}
          hint="How much pressure you’re carrying right now."
        />
        <SelectRow
          label="Confidence"
          value={confidence}
          setValue={setConfidence}
          hint="How strongly you believe in your ability to execute."
        />
      </div>

      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="textarea-field checkin-notes"
        placeholder="Optional reflection — what is shaping your day right now?"
      />

      <div className="btn-row">
        <button
          type="button"
          disabled={loading}
          onClick={saveCheckin}
          className="auth-cta-button"
        >
          {loading ? "Saving…" : "Save Today’s Check-In"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
      {savedAt ? (
        <p className="muted" style={{ fontSize: 14 }}>
          Saved for {savedAt}
        </p>
      ) : null}
    </section>
  );
}
