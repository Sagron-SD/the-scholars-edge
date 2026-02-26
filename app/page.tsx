import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  return (
    <AppShell
      title="The Scholars Edge"
      subtitle="Your daily command center for academic momentum and success coaching."
    >
      <section className="card-surface card-padding space-y-3">
        <p className="text-sm text-zinc-400">Today’s Focus</p>
        <h2 className="text-lg font-semibold">3 Priority Moves</h2>

        <ul className="space-y-2 text-sm">
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            ✅ Finish your highest-impact academic task first
          </li>
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            📚 Complete one focused study sprint
          </li>
          <li className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
            🎯 Move one milestone forward by 5–10%
          </li>
        </ul>
      </section>

      <section className="card-surface card-padding space-y-2">
        <h2 className="font-semibold">Weekly Edge Score</h2>
        <p className="text-sm text-zinc-400">
          Coming next: score breakdown from check-ins, study time, habits, and milestone progress.
        </p>
      </section>
    </AppShell>
  );
}
