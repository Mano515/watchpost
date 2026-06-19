import { useState } from 'react';
import type { ScoreDetail } from '@watchpost/shared-types';
import { useT } from '../i18n/LanguageContext';

interface Props {
  details: ScoreDetail[];
}

export default function ResultPanel({ details }: Props) {
  const { t } = useT();
  const [openWhy, setOpenWhy] = useState<number | null>(null);
  const passedCount = details.filter((d) => d.passed).length;

  return (
    <section aria-label={t.checkResults(passedCount, details.length)}>
      <ul className="result-list" role="list">
        {details.map((d, i) => {
          const check = d.key ? t.checks[d.key] : undefined;
          const label = check?.label ?? d.label;
          const rec   = check?.rec ?? d.recommendation;
          const why   = check?.why;
          const isOpen = openWhy === i;
          return (
            <li
              key={i}
              className={`result-item ${d.passed ? 'result-item--pass' : 'result-item--fail'} animate-in`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span
                className={`result-item__icon ${d.passed ? 'result-item__icon--pass' : 'result-item__icon--fail'}`}
                aria-hidden="true"
              >
                {d.passed ? '✓' : '✗'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <p className="result-item__label">
                    <span className="sr-only">{d.passed ? t.passed : t.failed}: </span>
                    {label}
                  </p>
                  {why && (
                    <button
                      className="check-why-btn"
                      aria-expanded={isOpen}
                      aria-label="Why?"
                      onClick={() => setOpenWhy(isOpen ? null : i)}
                    >
                      ?
                    </button>
                  )}
                </div>
                {!d.passed && rec && <p className="result-item__rec">{rec}</p>}
                {why && isOpen && <p className="check-why">{why}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
