import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import type { HeaderScanResult } from '@watchpost/shared-types';

export default function HeaderScan() {
  const { t } = useT();
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState<HeaderScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.scanHeaders(url)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title={t.modules.headers.title} icon="🛡️" iconLabel="Security tool" explainer={t.modules.headers.explainer}>
      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.targetUrl}</label>
          <div className="input-row">
            <input
              id={inputId}
              className="input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.placeholderUrl}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !url} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.scanning : t.analyze}
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
            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
