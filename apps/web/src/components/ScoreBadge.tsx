import type { Grade } from '@watchpost/shared-types';
import { useT } from '../i18n/LanguageContext';

interface Props {
  score: number;
  grade: Grade;
}

const gradeColors: Record<Grade, string> = {
  A: 'var(--grade-a)',
  B: 'var(--grade-b)',
  C: 'var(--grade-c)',
  D: 'var(--grade-d)',
  F: 'var(--grade-f)',
};

export default function ScoreBadge({ score, grade }: Props) {
  const { t } = useT();
  const color = gradeColors[grade];
  const label = t.grades[grade];
  return (
    <div
      className="score-badge"
      role="status"
      aria-label={t.securityGrade(grade, label, score)}
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
        <div className="score-meta__grade" style={{ color }}>{label}</div>
        <div className="score-meta__label">{t.gradeLabel(grade, score)}</div>
      </div>
    </div>
  );
}
