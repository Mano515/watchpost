import { Grade, ScoreDetail, SecurityScore, scoreToGrade } from '@watchpost/shared-types';

export function buildScore(details: ScoreDetail[]): SecurityScore {
  const passed = details.filter((d) => d.passed).length;
  const score = Math.round((passed / details.length) * 100);
  const grade: Grade = scoreToGrade(score);
  return { score, grade, details };
}
