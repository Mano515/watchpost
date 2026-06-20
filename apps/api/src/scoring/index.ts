import { Grade, ScoreDetail, SecurityScore, scoreToGrade } from '@watchpost/shared-types';

export function buildScore(details: ScoreDetail[]): SecurityScore {
  const scorable = details.filter((d) => !d.informational);
  const passed   = scorable.filter((d) => d.passed).length;
  const score    = scorable.length > 0 ? Math.round((passed / scorable.length) * 100) : 100;
  const grade: Grade = scoreToGrade(score);
  return { score, grade, details };
}
