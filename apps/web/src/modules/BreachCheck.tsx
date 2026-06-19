import { useState, useId } from 'react';
import { useLocation } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { demoBreach } from '../demo/mockData';
import type { BreachCheckResult, BreachEntry } from '@watchpost/shared-types';

export default function BreachCheck() {
  const { t } = useT();
  const { push } = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState<string>(location.state?.input ?? 'test@example.com');
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.checkBreach(email);
      setResult(r);
      push({ type: 'breach', input: email });
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  function loadDemo() { setResult(demoBreach); setIsDemo(true); setError(null); }

  return (
    <ModuleLayout title={t.modules.breach.title} icon="📧" iconLabel="Security tool" explainer={t.modules.breach.explainer}>
      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.emailLabel}</label>
          <div className="input-row">
            <input
              id={inputId} className="input" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholderEmail} autoComplete="email"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error} required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !email || isRateLimited} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.checking : t.analyze}
            </button>
          </div>
        </div>
        <button type="button" className="export-btn" style={{ marginBottom: '0.5rem' }} onClick={loadDemo}>
          {t.tryDemo}
        </button>
      </form>

      {isRateLimited && (
        <p className="error-msg" role="alert">{t.rateLimited(countdown)}</p>
      )}
      {error && !isRateLimited && (
        <p id={errorId} className="error-msg" role="alert">
          <span aria-hidden="true">{t.errorPrefix}</span> {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <>
            <hr className="divider" />
            {isDemo && <p className="demo-banner" role="status"><span aria-hidden="true">⚠</span> {t.demoLabel}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            {result.breached ? (
              <>
                <p className="breach-status breach-status--danger" role="status">
                  <span aria-hidden="true">⚠</span>
                  {t.breachStatusDanger(result.breaches.length)}
                </p>
                <ul className="breach-list" role="list" aria-label="Breach details">
                  {result.breaches.map((b: BreachEntry, i: number) => (
                    <li key={i} className="breach-item animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="breach-item__name">{b.name}</div>
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
