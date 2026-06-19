import type { ScoreDetail } from '@watchpost/shared-types';

interface Props {
  details: ScoreDetail[];
}

export default function ResultPanel({ details }: Props) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {details.map((d, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg)',
            borderRadius: 'var(--radius)',
            border: `1px solid ${d.passed ? 'var(--grade-a)' : 'var(--grade-f)'}22`,
          }}
        >
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{d.passed ? '✓' : '✗'}</span>
          <div>
            <div style={{ fontWeight: 500 }}>{d.label}</div>
            {!d.passed && d.recommendation && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {d.recommendation}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
