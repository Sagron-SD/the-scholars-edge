"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

type Mode = "pomodoro" | "deep_work";

export function PomodoroTimer({
  userId,
  onLogged,
}: {
  userId: string;
  onLogged?: () => void;
}) {
  const supabase = createBrowserClient();

  const [mode, setMode] = useState<Mode>("pomodoro");
  const [minutes, setMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const durationMinutes = useMemo(() => {
    return mode === "pomodoro" ? 25 : minutes;
  }, [mode, minutes]);

  useEffect(() => {
    setSecondsRemaining(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const display = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(
    secondsRemaining % 60
  ).padStart(2, "0")}`;

  function handleStart() {
    setMessage(null);
    if (!startedAt) setStartedAt(new Date().toISOString());
    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleReset() {
    setRunning(false);
    setStartedAt(null);
    setMessage(null);
    setSecondsRemaining(durationMinutes * 60);
  }

  async function handleLogSession() {
    setMessage(null);
    setIsLogging(true);

    const actualMinutes = Math.max(1, Math.round((durationMinutes * 60 - secondsRemaining) / 60));
    const now = new Date().toISOString();

    const { error } = await supabase.from("study_sessions").insert({
      user_id: userId,
      session_type: mode === "pomodoro" ? "pomodoro" : "deep_work",
      started_at: startedAt ?? new Date(Date.now() - actualMinutes * 60000).toISOString(),
      ended_at: now,
      duration_minutes: actualMinutes,
    });

    setIsLogging(false);

    if (error) return setMessage(error.message);

    setMessage("Study session logged ✅");
    setRunning(false);
    setStartedAt(null);
    setSecondsRemaining(durationMinutes * 60);
    onLogged?.();
  }

  return (
    <section className="card-surface card-padding space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">Study Sprint</p>
          <h2 className="text-lg font-semibold">Pomodoro Timer</h2>
        </div>
        <span className="text-3xl font-bold tracking-tight">{display}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("pomodoro");
            setMessage(null);
          }}
          className={`rounded-xl px-3 py-2 text-sm border ${
            mode === "pomodoro"
              ? "border-blue-500 bg-blue-500/10 text-blue-300"
              : "border-zinc-800"
          }`}
        >
          Pomodoro (25)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("deep_work");
            setMessage(null);
          }}
          className={`rounded-xl px-3 py-2 text-sm border ${
            mode === "deep_work"
              ? "border-blue-500 bg-blue-500/10 text-blue-300"
              : "border-zinc-800"
          }`}
        >
          Deep Work
        </button>
      </div>

      {mode === "deep_work" ? (
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-300">Minutes</label>
          <input
            type="number"
            min={15}
            max={180}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-24 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleStart}
          className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          className="rounded-xl bg-zinc-800 px-4 py-2 font-medium hover:bg-zinc-700"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-900"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleLogSession}
          disabled={isLogging}
          className="rounded-xl border border-blue-500 px-4 py-2 font-medium text-blue-300 hover:bg-blue-500/10 disabled:opacity-60"
        >
          {isLogging ? "Logging…" : "Log Session"}
        </button>
      </div>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </section>
  );
}
