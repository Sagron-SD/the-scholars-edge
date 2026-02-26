"use client";

type EdgeBreakdown = {
  execution: number;
  consistency: number;
  academicFocus: number;
  recovery: number;
  total: number;
};

export function WeeklyEdgeScore({ score }: { score: EdgeBreakdown }) {
  return (
    <section className="card-surface card-padding space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">Weekly Edge Score</p>
          <h2 className="text-lg font-semibold">Momentum Snapshot</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{score.total}</p>
          <p className="text-xs text-zinc-500">out of 100</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <ScorePill label="Execution" value={score.execution} max={40} />
        <ScorePill label="Consistency" value={score.consistency} max={25} />
        <ScorePill label="Focus" value={score.academicFocus} max={20} />
        <ScorePill label="Recovery" value={score.recovery} max={15} />
      </div>
    </section>
  );
}

function ScorePill({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 p-3">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-xl font-semibold">
        {value}
        <span className="text-sm text-zinc-500">/{max}</span>
      </p>
    </div>
  );
}
