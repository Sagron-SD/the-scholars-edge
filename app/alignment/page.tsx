"use client";

import { AppShell } from "@/components/app-shell";
import { AlignmentCheckin } from "@/components/alignment/alignment-checkin";

export default function AlignmentPage() {
  return (
    <AppShell
      title="State & Alignment"
      subtitle="A fast daily reset that keeps your goals aligned with your real life."
      kicker="Daily Reset"
      variant="emerald"
    >
      <AlignmentCheckin />
    </AppShell>
  );
}
