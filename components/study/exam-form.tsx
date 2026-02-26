"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function ExamForm({
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
        const exam_date = String(form.get("exam_date") || "").trim() || null;

        if (!title) {
          setLoading(false);
          return setMessage("Exam title is required.");
        }

        const { error } = await supabase.from("exams").insert({
          user_id: userId,
          title,
          exam_date,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Exam added ✅");
        onCreated?.();
      }}
    >
      <h3 className="font-semibold">Add Exam</h3>

      <input
        name="title"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        placeholder="Ex: Biology final"
        required
      />

      <input
        name="exam_date"
        type="date"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Add Exam"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
