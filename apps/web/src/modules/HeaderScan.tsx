import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { demoHeaders } from '../demo/mockData';
import type { HeaderScanResult } from '@watchpost/shared-types';

export default function HeaderScan() {
  const { t } = useT();
  const { push } = useHistory();
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState<HeaderScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.scanHeaders(url);
      setResult(r);
      push({ type: 'headers', input: url, grade: r.grade });
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  function loadDemo() {
    setResult(demoHeaders); setIsDemo(true); setError(null);
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
        <button type="button" className="export-btn" style={{ marginBottom: '0.5rem' }} onClick={loadDemo}>
          {t.tryDemo}
        </button>
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
            {isDemo && (
              <p className="demo-banner" role="status">
                <span aria-hidden="true">⚠</span> {t.demoLabel}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <ScoreBadge score={result.score} grade={result.grade} />
            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
