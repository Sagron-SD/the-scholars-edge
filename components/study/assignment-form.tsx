"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export function AssignmentForm({
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
        const due_date = String(form.get("due_date") || "").trim() || null;
        const status = String(form.get("status") || "pending");

        if (!title) {
          setLoading(false);
          return setMessage("Assignment title is required.");
        }

        const { error } = await supabase.from("assignments").insert({
          user_id: userId,
          title,
          due_date,
          status,
        });

        setLoading(false);

        if (error) return setMessage(error.message);

        formRef.current?.reset();
        setMessage("Assignment added ✅");
        onCreated?.();
      }}
    >
      <h3 className="font-semibold">Add Assignment</h3>

      <input
        name="title"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        placeholder="Ex: Midterm essay"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="due_date"
          type="date"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
        />

        <select
          name="status"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          defaultValue="pending"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-500 px-4 py-2 font-medium hover:bg-blue-400 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Add Assignment"}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
