import { useState, useId, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useScanDiff, type ScanDiff } from '../hooks/useScanDiff';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import { demoHeaders } from '../demo/mockData';
import type { HeaderScanResult } from '@watchpost/shared-types';

export default function HeaderScan() {
  const { t } = useT();
  const { push } = useHistory();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialUrl = searchParams.get('url') ?? location.state?.input ?? 'https://example.com';
  const [url, setUrl] = useState<string>(initialUrl);
  const [result, setResult] = useState<HeaderScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [diff, setDiff] = useState<ScanDiff | null>(null);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const { saveCurrent } = useScanDiff('headers', url);
  const inputId    = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  async function performScan(targetUrl: string) {
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.scanHeaders(targetUrl);
      setResult(r);
      push({ type: 'headers', input: targetUrl, grade: r.grade });
      setSearchParams({ url: targetUrl }, { replace: true });
      setDiff(saveCurrent(r.score, r.grade));
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  async function run(e: React.FormEvent) {
    e.preventDefault();
    performScan(url);
  }

  // Auto-run when opened from a shared link (?url=…)
  useEffect(() => {
    if (searchParams.get('url') && !hasAutoRun.current) {
      hasAutoRun.current = true;
      performScan(initialUrl);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function loadDemo() { setResult(demoHeaders); setIsDemo(true); setError(null); }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ModuleLayout title={t.modules.headers.title} icon="🛡️" iconLabel="Security tool" explainer={t.modules.headers.explainer}>
      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.targetUrl}</label>
          <div className="input-row">
            <input
              id={inputId} className="input" type="url"
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder={t.placeholderUrl}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error} required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !url || isRateLimited} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.scanning : t.analyze}
            </button>
          </div>
          <p className="input-hint">{t.hintUrl}</p>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={copyLink}>{copied ? t.linkCopied : t.copyLink}</button>
              <button className="export-btn" onClick={() => downloadJson(result, `headers-${url.replace(/https?:\/\//, '')}`)}>
                {t.exportJson}
              </button>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <ScoreBadge score={result.score} grade={result.grade} />
            {diff && diff.delta !== 0 && (
              <p className={`scan-diff scan-diff--${diff.delta > 0 ? 'up' : 'down'}`} role="status">
                {diff.delta > 0 ? '↑' : '↓'} {Math.abs(diff.delta)} pts {diff.delta > 0 ? t.diffImproved : t.diffRegressed} ({diff.previousScore} → {result.score})
              </p>
            )}
            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
