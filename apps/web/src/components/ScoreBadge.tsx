import type { Grade } from '@watchpost/shared-types';

interface Props {
  score: number;
  grade: Grade;
}

const gradeColor: Record<Grade, string> = {
  A: 'var(--grade-a)',
  B: 'var(--grade-b)',
  C: 'var(--grade-c)',
  D: 'var(--grade-d)',
  F: 'var(--grade-f)',
};

export default function ScoreBadge({ score, grade }: Props) {
  const color = gradeColor[grade];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: `4px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontWeight: 700,
        }}
      >
        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{grade}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{score}/100</span>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Security Grade: {grade}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Score: {score} / 100</div>
      </div>
    </div>
  );
}
