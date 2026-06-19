import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import type { SslCheckResult } from '@watchpost/shared-types';

export default function SslCheck() {
  const { t } = useT();
  const [domain, setDomain] = useState('example.com');
  const [result, setResult] = useState<SslCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkSsl(domain)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title={t.modules.ssl.title} icon="🔒" iconLabel="Security tool" explainer={t.modules.ssl.explainer}>
      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.domainLabel}</label>
          <div className="input-row">
            <input
              id={inputId}
              className="input"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t.placeholderDomain}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !domain} aria-busy={loading}>
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
            <ScoreBadge score={result.score} grade={result.grade} />
            <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="info-cell">
                <div className="info-cell__label">{t.issuer}</div>
                <div className="info-cell__value">{result.issuer}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.protocol}</div>
                <div className="info-cell__value">{result.tlsVersion}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.expires}</div>
                <div
                  className="info-cell__value"
                  style={{ color: result.daysUntilExpiry <= 30 ? 'var(--err)' : 'inherit' }}
                >
                  {t.expiresIn(result.daysUntilExpiry)}
                </div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.signature}</div>
                <div className="info-cell__value">{result.signatureAlgorithm}</div>
              </div>
            </div>
            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
