import type { ScoreDetail } from '@watchpost/shared-types';

interface Props {
  details: ScoreDetail[];
}

export default function ResultPanel({ details }: Props) {
  const passed = details.filter((d) => d.passed).length;
  return (
    <section aria-label={`Check results: ${passed} of ${details.length} passed`}>
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
                <span className="sr-only">{d.passed ? 'Passed:' : 'Failed:'} </span>
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
