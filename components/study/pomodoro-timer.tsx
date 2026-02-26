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
  const [supabase] = useState(() => createBrowserClient());

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
    <section className="premium-panel premium-panel-padding premium-stack">
      <div className="study-timer-top">
        <div className="section-stack" style={{ gap: 8 }}>
          <p className="premium-kicker">Study Sprint</p>
          <h2 className="premium-title">Focus session timer</h2>
          <p className="premium-copy">
            Create structured deep work and capture each session as visible momentum.
          </p>
        </div>

        <div className="study-timer-display">{display}</div>
      </div>

      <div className="study-mode-row">
        <button
          type="button"
          onClick={() => {
            setMode("pomodoro");
            setMessage(null);
          }}
          className={`study-mode-button ${mode === "pomodoro" ? "study-mode-button-active" : ""}`}
        >
          Pomodoro (25)
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("deep_work");
            setMessage(null);
          }}
          className={`study-mode-button ${mode === "deep_work" ? "study-mode-button-active" : ""}`}
        >
          Deep Work
        </button>
      </div>

      {mode === "deep_work" ? (
        <div className="study-minutes-row">
          <label className="checkin-row-label">Deep work minutes</label>
          <input
            type="number"
            min={15}
            max={180}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="field auth-input study-minutes-input"
          />
        </div>
      ) : null}

      <div className="btn-row">
        <button type="button" onClick={handleStart} className="auth-cta-button">
          Start Session
        </button>

        <button type="button" onClick={handlePause} className="btn-secondary">
          Pause
        </button>

        <button type="button" onClick={handleReset} className="btn-ghost">
          Reset
        </button>

        <button
          type="button"
          onClick={handleLogSession}
          disabled={isLogging}
          className="btn-secondary"
        >
          {isLogging ? "Logging…" : "Log Session"}
        </button>
      </div>

      {message ? <p className="auth-message">{message}</p> : null}
    </section>
  );
}
