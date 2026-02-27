"use client";

import { AppShell } from "@/components/app-shell";

export default function AlignmentPage() {
  return (
    <AppShell
      title="State & Alignment"
      subtitle="Your internal state drives your external performance. Check in and recalibrate."
      kicker="Daily Reset"
      variant="emerald"
    >
      <section className="card-surface card-padding space-y-4">
        <h3 className="font-semibold text-lg">
          Alignment is coming online.
        </h3>

        <p className="text-sm text-zinc-400">
          Soon you’ll be able to check in on your mental clarity,
          physical vitality, inner alignment, and social grounding —
          all in under 60 seconds.
        </p>

        <p className="text-sm text-zinc-500">
          This will become your daily recalibration ritual.
        </p>
      </section>
    </AppShell>
  );
}
