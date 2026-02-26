"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Checkin = {
  energy: number;
  focus: number;
  stress: number;
  confidence: number;
  notes: string | null;
};

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
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-zinc-300">{label}</label>
      <select
        value={String(value)}
        onChange={(e) => setValue(Number(e.target.value))}
        className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm"
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
  const supabase = createBrowserClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [stress, setStress] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);

      const { data: checkin } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", data.user.id)
        .eq("checkin_date", today)
        .maybeSingle();

      if (checkin) {
        setEnergy(checkin.energy);
        setFocus(checkin.focus);
        setStress(checkin.stress);
        setConfidence(checkin.confidence);
        setNotes(checkin.notes || "");
      }
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

    setLoading(false);

    if (error) return setMessage(error.message);
    setMessage("Check-in saved ✅");
  }

  return (
    <section className="card-surface card-padding space-y-3">
      <h3 className="font-semibold">Coaching Pulse Check</h3>
      <p className="text-sm text-zinc-400">
        Quick daily read on your state so your plan matches your energy.
      </p>

      <div className="space-y-2">
        <SelectRow label="Energy" value={energy} setValue={setEnergy} />
        <SelectRow label="Focus" value={focus} setValue={setFocus} />
        <SelectRow label="Stress" value={stress} setValue={setStress} />
        <SelectRow label="Confidence" value={confidence} setValue={setConfidence} />
      </div>

      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
        placeholder="Optional note — what’s affecting your day?"
      />

      <button
        disabled={loading}
        onClick={saveCheckin}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save Check-In"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </section>
  );
}
