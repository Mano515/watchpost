import type { ScoreDetail } from '@watchpost/shared-types';
import { useT } from '../i18n/LanguageContext';

interface Props {
  details: ScoreDetail[];
}

export default function ResultPanel({ details }: Props) {
  const { t } = useT();
  const passedCount = details.filter((d) => d.passed).length;
  return (
    <section aria-label={t.checkResults(passedCount, details.length)}>
      <ul className="result-list" role="list">
        {details.map((d, i) => (
          <li
            key={i}
            className={`result-item ${d.passed ? 'result-item--pass' : 'result-item--fail'}`}
          >
            <span
              className={`result-item__icon ${d.passed ? 'result-item__icon--pass' : 'result-item__icon--fail'}`}
              aria-hidden="true"
            >
              {d.passed ? '✓' : '✗'}
            </span>
            <div>
              <p className="result-item__label">
                <span className="sr-only">{d.passed ? t.passed : t.failed}: </span>
                {d.label}
              </p>
              {!d.passed && d.recommendation && (
                <p className="result-item__rec">{d.recommendation}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
