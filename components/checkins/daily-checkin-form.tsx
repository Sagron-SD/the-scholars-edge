"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

function SelectRow({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 110px",
        gap: 12,
        alignItems: "center",
      }}
    >
      <label className="muted" style={{ fontSize: 15 }}>
        {label}
      </label>

      <select
        value={String(value)}
        onChange={(e) => setValue(Number(e.target.value))}
        className="select-field"
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

  async function loadTodayCheckin(currentUserId: string) {
    const { data: checkin } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", currentUserId)
      .eq("checkin_date", today)
      .maybeSingle();

    if (checkin) {
      setEnergy(checkin.energy);
      setFocus(checkin.focus);
      setStress(checkin.stress);
      setConfidence(checkin.confidence);
      setNotes(checkin.notes || "");
      setSavedAt(today);
    }
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
      await loadTodayCheckin(data.user.id);
    })();
  }, [supabase, today]);

  async function saveCheckin() {
    if (!userId) return setMessage("You must be signed in.");

    setLoading(true);
    setMessage(null);

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
      return setMessage(error.message);
    }

    await loadTodayCheckin(userId);
    setLoading(false);
    setMessage("Check-in saved ✅");
  }

  return (
    <section className="card-surface card-padding section-stack">
      <div className="section-stack" style={{ gap: 8 }}>
        <h3>Coaching Pulse Check</h3>
        <p className="muted">
          Quick daily read on your state so your plan matches your energy.
        </p>
      </div>

      <div className="section-stack">
        <SelectRow label="Energy" value={energy} setValue={setEnergy} />
        <SelectRow label="Focus" value={focus} setValue={setFocus} />
        <SelectRow label="Stress" value={stress} setValue={setStress} />
        <SelectRow label="Confidence" value={confidence} setValue={setConfidence} />
      </div>

      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="textarea-field"
        placeholder="Optional note — what’s affecting your day?"
      />

      <div className="btn-row">
        <button disabled={loading} onClick={saveCheckin} className="btn-primary">
          {loading ? "Saving…" : "Save Check-In"}
        </button>
      </div>

      {message ? <p className="muted">{message}</p> : null}
      {savedAt ? <p className="muted" style={{ fontSize: 14 }}>Saved for {savedAt}</p> : null}
    </section>
  );
}
