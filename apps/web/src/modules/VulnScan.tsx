import { useState, useId, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useScanDiff, type ScanDiff } from '../hooks/useScanDiff';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import { demoVuln } from '../demo/mockData';
import type { VulnScanResult, VulnFinding, VulnSeverity } from '@watchpost/shared-types';

const SEVERITY_COLOR: Record<VulnSeverity, string> = {
  critical: 'var(--critical)',
  high:     'var(--err)',
  medium:   'var(--warn)',
  low:      'var(--accent)',
  info:     'var(--text-muted)',
};

const SEVERITY_ORDER: VulnSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

function FindingRow({ finding, t }: { finding: VulnFinding; t: ReturnType<typeof useT>['t'] }) {
  const [open, setOpen] = useState(false);
  const check = t.checks[finding.key];
  const label = check?.label ?? finding.label;
  const rec   = check?.rec ?? finding.recommendation;
  const why   = check?.why;

  return (
    <li
      className={`result-item ${finding.passed ? 'result-item--pass' : 'result-item--fail'} animate-in`}
    >
      <span
        className={`result-item__icon ${finding.passed ? 'result-item__icon--pass' : 'result-item__icon--fail'}`}
        aria-hidden="true"
      >
        {finding.passed ? '✓' : '✗'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <p className="result-item__label" style={{ margin: 0 }}>
            {label}
          </p>
          <span
            style={{
              fontSize: '0.7rem', fontWeight: 700,
              color: SEVERITY_COLOR[finding.severity],
              textTransform: 'uppercase', letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            {t.vulnSeverity[finding.severity]}
          </span>
          {why && (
            <button
              className="check-why-btn"
              aria-expanded={open}
              aria-label="Why?"
              onClick={() => setOpen((o) => !o)}
            >
              ?
            </button>
          )}
        </div>
        {finding.detail && (
          <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {finding.detail}
          </p>
        )}
        {!finding.passed && rec && <p className="result-item__rec">{rec}</p>}
        {why && open && <p className="check-why">{why}</p>}
      </div>
    </li>
  );
}

export default function VulnScan() {
  const { t } = useT();
  const { push } = useHistory();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialUrl = searchParams.get('url') ?? location.state?.input ?? 'https://example.com';
  const [url, setUrl] = useState<string>(initialUrl);
  const [result, setResult] = useState<VulnScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [diff, setDiff] = useState<ScanDiff | null>(null);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const { saveCurrent } = useScanDiff('vuln', url);
  const inputId    = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  async function performScan(targetUrl: string) {
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.scanVulns(targetUrl);
      setResult(r);
      push({ type: 'vuln', input: targetUrl, grade: r.grade });
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

  function loadDemo() { setResult(demoVuln); setIsDemo(true); setError(null); }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const grouped = result
    ? SEVERITY_ORDER.map((sev) => ({
        sev,
        items: result.findings.filter((f) => f.severity === sev),
      })).filter((g) => g.items.length > 0)
    : [];

  const totalFindings = result?.findings.length ?? 0;
  const failCount = result?.findings.filter((f) => !f.passed && f.severity !== 'info').length ?? 0;

  return (
    <ModuleLayout
      title={t.modules.vuln.title}
      icon="🔬"
      iconLabel="Security tool"
      explainer={t.modules.vuln.explainer}
    >
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !url || isRateLimited}
              aria-busy={loading}
            >
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
            {isDemo && (
              <p className="demo-banner" role="status">
                <span aria-hidden="true">⚠</span> {t.demoLabel}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.vulnFindings(totalFindings)}
                {failCount > 0 && (
                  <span style={{ color: 'var(--err)', marginLeft: '0.5rem' }}>
                    · {failCount} {failCount === 1 ? 'issue' : 'issues'}
                  </span>
                )}
              </p>
              <button className="export-btn" onClick={copyLink}>{copied ? t.linkCopied : t.copyLink}</button>
              <button className="export-btn" onClick={() => downloadJson(result, `vuln-${url.replace(/https?:\/\//, '')}`)}>
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

            {grouped.map(({ sev, items }) => (
              <section key={sev} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{
                  fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: SEVERITY_COLOR[sev],
                  marginBottom: '0.6rem',
                }}>
                  {t.vulnSeverity[sev]}
                  {sev === 'info' && (
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0, marginLeft: '0.5rem' }}>
                      — {t.vulnInfoNote}
                    </span>
                  )}
                </h2>
                <ul className="result-list" role="list">
                  {items.map((f, i) => (
                    <FindingRow key={i} finding={f} t={t} />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
