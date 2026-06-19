import type { Grade } from '@watchpost/shared-types';

interface Props {
  score: number;
  grade: Grade;
}

const gradeLabels: Record<Grade, string> = {
  A: 'Excellent',
  B: 'Good',
  C: 'Fair',
  D: 'Poor',
  F: 'Critical',
};

const gradeColors: Record<Grade, string> = {
  A: 'var(--grade-a)',
  B: 'var(--grade-b)',
  C: 'var(--grade-c)',
  D: 'var(--grade-d)',
  F: 'var(--grade-f)',
};

export default function ScoreBadge({ score, grade }: Props) {
  const color = gradeColors[grade];
  const label = gradeLabels[grade];
  return (
    <div
      className="score-badge"
      role="status"
      aria-label={`Security grade: ${grade} — ${label}. Score: ${score} out of 100.`}
    >
      <div
        className="score-circle"
        style={{ '--grade-color': color } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="score-circle__grade">{grade}</span>
        <span className="score-circle__score">{score}/100</span>
      </div>
      <div aria-hidden="true">
        <div className="score-meta__grade" style={{ color }}>
          {label}
        </div>
        <div className="score-meta__label">Security grade {grade} · Score {score}/100</div>
      </div>
    </div>
  );
}
