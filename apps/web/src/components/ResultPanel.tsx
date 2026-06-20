import { useState } from 'react';
import type { ScoreDetail, VulnSeverity } from '@watchpost/shared-types';
import { useT } from '../i18n/LanguageContext';

const SEV_COLOR: Record<VulnSeverity, string> = {
  critical: 'var(--critical)',
  high:     'var(--err)',
  medium:   'var(--warn)',
  low:      'var(--accent)',
  info:     'var(--text-muted)',
};
const SEV_BORDER: Record<VulnSeverity, string> = {
  critical: 'var(--critical-border)',
  high:     'var(--err-border)',
  medium:   'var(--warn-bg)',
  low:      'color-mix(in srgb, var(--accent) 25%, transparent)',
  info:     'var(--border)',
};

const SEV_ORDER: VulnSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

function sevRank(d: ScoreDetail): number {
  if (!d.severity) return SEV_ORDER.length; // no severity → last
  return SEV_ORDER.indexOf(d.severity);
}

interface Props {
  details: ScoreDetail[];
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    style={{ width: '0.85rem', height: '0.85rem', flexShrink: 0, color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
    viewBox="0 0 16 16" fill="none" aria-hidden="true"
  >
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ResultPanel({ details }: Props) {
  const { t } = useT();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const sorted = [...details].sort((a, b) => {
    if (a.passed !== b.passed) return a.passed ? 1 : -1;
    return sevRank(a) - sevRank(b);
  });

  const scorable    = sorted.filter((d) => !d.informational);
  const passedCount = scorable.filter((d) => d.passed).length;
  const failedCount = scorable.length - passedCount;

  return (
    <section aria-label={t.checkResults(passedCount, details.length)}>
      <p className="result-summary" aria-hidden="true">
        <span style={{ color: failedCount === 0 ? 'var(--ok)' : 'var(--text-2)', fontWeight: 600 }}>
          {failedCount === 0 ? '✓' : `${passedCount}/${scorable.length}`}
        </span>
        {' '}{t.resultSummaryLine(passedCount, scorable.length, failedCount)}
      </p>
      <ul className="result-list" role="list">
        {sorted.map((d, i) => {
          const check     = d.key ? t.checks[d.key] : undefined;
          const label     = check?.label ?? d.label;
          const rec       = check?.rec ?? d.recommendation;
          const why       = check?.why;
          const canExpand = !d.passed && !d.informational && (rec || why);
          const isOpen    = openIdx === i;

          const sev        = d.severity;
          const sevColor   = sev ? SEV_COLOR[sev]   : undefined;
          const sevBorder  = sev ? SEV_BORDER[sev]  : undefined;
          const leftBorder = d.informational
            ? '3px solid var(--text-muted)'
            : d.passed
            ? '3px solid var(--ok)'
            : sev ? `3px solid ${sevColor}` : '3px solid var(--err)';

          return (
            <li
              key={i}
              className={`animate-in`}
              style={{
                display: 'flex', flexDirection: 'column',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: leftBorder,
                padding: '0.55rem 0.8rem',
                gap: 0,
                opacity: d.informational ? 0.75 : 1,
                animationDelay: `${i * 40}ms`,
              }}
            >
              {/* Row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: canExpand ? 'pointer' : 'default' }}
                onClick={() => canExpand && setOpenIdx(isOpen ? null : i)}
                role={canExpand ? 'button' : undefined}
                aria-expanded={canExpand ? isOpen : undefined}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700,
                    background: d.informational ? 'var(--text-muted)' : d.passed ? 'var(--ok)' : (sevColor ?? 'var(--err)'),
                    color: d.passed ? '#0d1117' : '#fff',
                  }}
                >
                  {d.informational ? 'ℹ' : d.passed ? '✓' : '✗'}
                </span>
                {/* Severity badge — fixed width so titles align regardless of label length.
                    Passed items get an invisible placeholder of the same width when severity is present. */}
                {!d.informational && sev && (
                  d.passed
                    ? <span style={{ width: '4rem', flexShrink: 0 }} aria-hidden="true" />
                    : <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '4rem', flexShrink: 0,
                        fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                        color: sevColor, border: `1px solid ${sevBorder}`,
                        borderRadius: '3px', padding: '0.15rem 0', lineHeight: 1,
                      }}>
                        {t.vulnSeverity[sev]}
                      </span>
                )}
                <p style={{ margin: 0, flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
                  <span className="sr-only">{d.passed ? t.passed : t.failed}: </span>
                  {label}
                </p>
                {canExpand && <Chevron open={isOpen} />}
              </div>

              {/* Expanded */}
              {isOpen && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {rec && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ok)', marginBottom: '0.3rem' }}>
                        🔧 {t.howToFix}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.55 }}>{rec}</p>
                    </div>
                  )}
                  {why && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--warn)', marginBottom: '0.3rem' }}>
                        ⚠️ {t.attackScenario}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.55 }}>{why}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
