import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import type { BreachCheckResult } from '@watchpost/shared-types';

export default function BreachCheck() {
  const { t } = useT();
  const [email, setEmail] = useState('test@example.com');
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkBreach(email)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title={t.modules.breach.title} icon="📧" iconLabel="Security tool">
      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.emailLabel}</label>
          <div className="input-row">
            <input
              id={inputId}
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholderEmail}
              autoComplete="email"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !email} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.checking : t.analyze}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p id={errorId} className="error-msg" role="alert">
          <span aria-hidden="true">{t.errorPrefix}</span> {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <>
            <hr className="divider" />
            {result.breached ? (
              <>
                <p className="breach-status breach-status--danger" role="status">
                  <span aria-hidden="true">⚠</span>
                  {t.breachStatusDanger(result.breaches.length)}
                </p>
                <ul className="breach-list" role="list" aria-label="Breach details">
                  {result.breaches.map((b, i) => (
                    <li key={i} className="breach-item">
                      <div className="breach-item__name">{b.name}</div>
                      <div className="breach-item__meta">
                        <time dateTime={b.date}>{b.date}</time>
                        {b.dataTypes.length > 0 && <> · {b.dataTypes.join(', ')}</>}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="breach-status breach-status--safe" role="status">
                <span aria-hidden="true">✓</span> {t.breachStatusSafe}
              </p>
            )}
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
