"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function CourseForm({
  userId,
  onCreated,
}: {
  userId: string;
  onCreated?: () => void;
}) {
  const supabase = createBrowserClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      className="card-surface card-padding space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const form = new FormData(e.currentTarget);
        const title = String(form.get("title") || "").trim();
        const credits = Number(form.get("credits") || 0);
        const current_grade = String(form.get("current_grade") || "").trim().toUpperCase();

        if (!title) {
          setLoading(false);
          return setMessage("Course name is required.");
        }

        const { error } = await supabase.from("courses").insert({
          user_id: userId,
          title,
          credits: credits || null,
          current_grade: current_grade || null,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Course added ✅");
        onCreated?.();
      }}
    >
      <h3 className="font-semibold">Add Course</h3>

      <input
        name="title"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        placeholder="Ex: Biology 101"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="credits"
          type="number"
          min={0}
          step="0.5"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          placeholder="Credits"
        />

        <input
          name="current_grade"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          placeholder="Grade (A, B+, etc.)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Add Course"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
