export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calculateWeeklyEdgeScore(input: {
  checkins: Array<{
    energy: number;
    stress: number;
  }>;
  milestoneProgressValues: number[];
  studyMinutes: number;
}) {
  const milestoneAverage =
    input.milestoneProgressValues.length > 0
      ? input.milestoneProgressValues.reduce((a, b) => a + b, 0) /
        input.milestoneProgressValues.length
      : 0;

  // Execution: milestone progress average, scaled to 40
  const execution = clamp(Math.round((milestoneAverage / 100) * 40), 0, 40);

  // Consistency: number of check-ins this week, max 25
  const consistency = clamp(Math.round((input.checkins.length / 7) * 25), 0, 25);

  // Academic focus: 300 mins/week target for full 20 points
  const academicFocus = clamp(Math.round((input.studyMinutes / 300) * 20), 0, 20);

  // Recovery: average of energy + inverse stress, scaled to 15
  let recovery = 0;
  if (input.checkins.length > 0) {
    const avgRecoveryRaw =
      input.checkins.reduce((sum, c) => {
        const normalized = ((c.energy / 5) * 0.6 + ((6 - c.stress) / 5) * 0.4) * 100;
        return sum + normalized;
      }, 0) / input.checkins.length;

    recovery = clamp(Math.round((avgRecoveryRaw / 100) * 15), 0, 15);
  }

  const total = execution + consistency + academicFocus + recovery;

  return {
    execution,
    consistency,
    academicFocus,
    recovery,
    total,
  };
}
