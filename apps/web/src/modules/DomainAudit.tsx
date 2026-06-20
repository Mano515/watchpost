import { useState, useId, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import { demoDomain } from '../demo/mockData';
import type { DomainAuditResult, EmailSecurityResult } from '@watchpost/shared-types';

function RecordGroup({ label, records }: { label: string; records: string[] }) {
  if (!records.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="dns-section__title">{label}</div>
      {records.map((r, i) => <div key={i} className="dns-record">{r}</div>)}
    </div>
  );
}

function DomainResult({ result, t }: { result: DomainAuditResult; t: ReturnType<typeof useT>['t'] }) {
  return (
    <>
      <section aria-label={t.sslTitle} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-2)' }}>
          🔒 {t.sslTitle}
        </h2>
        {result.ssl ? (
          <>
            <ScoreBadge score={result.ssl.score} grade={result.ssl.grade} />
            <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="info-cell">
                <div className="info-cell__label">{t.issuer}</div>
                <div className="info-cell__value">{result.ssl.issuer}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.protocol}</div>
                <div className="info-cell__value">{result.ssl.tlsVersion}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.expires}</div>
                <div
                  className="info-cell__value"
                  style={{ color: result.ssl.daysUntilExpiry <= 30 ? 'var(--err)' : 'inherit' }}
                >
                  {t.expiresIn(result.ssl.daysUntilExpiry)}
                </div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.signature}</div>
                <div className="info-cell__value">{result.ssl.signatureAlgorithm}</div>
              </div>
            </div>
            <ResultPanel details={result.ssl.details} />
          </>
        ) : (
          <p className="error-msg" style={{ marginBottom: 0 }}>
            <span aria-hidden="true">{t.errorPrefix}</span> {result.sslError ?? t.sslUnavailable}
          </p>
        )}
      </section>

      <hr className="divider" />

      <section aria-label={t.dnsTitle}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-2)' }}>
          🌐 {t.dnsTitle}
        </h2>
        <div className="dns-grid">
          <div>
            <RecordGroup label="A"   records={result.dns.records.A} />
            <RecordGroup label="MX"  records={result.dns.records.MX} />
            <RecordGroup label="NS"  records={result.dns.records.NS} />
            <RecordGroup label="TXT" records={result.dns.records.TXT} />
            {!Object.values(result.dns.records).some((r) => r.length) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.noRecords}</p>
            )}
          </div>

          {result.dns.whois && (
            <section aria-label={t.whoisTitle}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t.whoisTitle}</h3>
              <dl>
                {[
                  { label: t.registrar,   value: result.dns.whois.registrar },
                  { label: t.domainLabel, value: t.domainAge(Math.floor(result.dns.whois.domainAge / 365)) },
                  { label: t.registered,  value: result.dns.whois.createdDate.slice(0, 10) },
                  { label: t.expires,     value: result.dns.whois.expiresDate.slice(0, 10) },
                ].map(({ label, value }) => (
                  <div key={label} className="whois-row">
                    <dt className="whois-row__label">{label}</dt>
                    <dd className="whois-row__value">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </section>

      <hr className="divider" />

      <EmailSecuritySection es={result.dns.emailSecurity} t={t} />
    </>
  );
}

function EmailSecuritySection({ es, t }: { es: EmailSecurityResult; t: ReturnType<typeof useT>['t'] }) {
  return (
    <section aria-label={t.emailSecTitle} style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-2)' }}>
        ✉️ {t.emailSecTitle}
      </h2>

      <ScoreBadge score={es.score.score} grade={es.score.grade} />

      <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
        <InfoCell label={t.spfLabel}    value={es.spf    ?? '—'} mono />
        <InfoCell label={t.dmarcLabel}  value={es.dmarc  ?? '—'} mono />
        <InfoCell
          label={t.caaLabel}
          value={es.caa.length ? es.caa.join(', ') : '—'}
          mono
        />
        <InfoCell
          label={t.dnssecLabel}
          value={es.dnssec ? '✓' : '✗'}
          color={es.dnssec ? 'var(--ok)' : 'var(--err)'}
        />
      </div>

      <ResultPanel details={es.score.details} />
    </section>
  );
}

function InfoCell({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div className="info-cell">
      <div className="info-cell__label">{label}</div>
      <div
        className="info-cell__value"
        style={{
          fontFamily: mono ? 'var(--font-mono)' : undefined,
          fontSize: mono ? '0.75rem' : undefined,
          color,
          wordBreak: 'break-all',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DomainAudit() {
  const { t } = useT();
  const { push } = useHistory();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDomain = searchParams.get('domain') ?? location.state?.input ?? 'example.com';
  const [domain, setDomain] = useState<string>(initialDomain);
  const [bulkText, setBulkText] = useState('');
  const [result, setResult] = useState<DomainAuditResult | null>(null);
  const [bulkResults, setBulkResults] = useState<DomainAuditResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [copied, setCopied] = useState(false);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const inputId    = useId();
  const bulkId     = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  async function performScan(targetDomain: string) {
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.auditDomain(targetDomain);
      setResult(r);
      push({ type: 'domain', input: targetDomain, grade: r.ssl?.grade });
      setSearchParams({ domain: targetDomain }, { replace: true });
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  async function runSingle(e: React.FormEvent) {
    e.preventDefault();
    performScan(domain);
  }

  // Auto-run when opened from a shared link (?domain=…)
  useEffect(() => {
    if (searchParams.get('domain') && !hasAutoRun.current) {
      hasAutoRun.current = true;
      performScan(initialDomain);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function runBulk(e: React.FormEvent) {
    e.preventDefault();
    const domains = bulkText.split('\n').map((d) => d.trim()).filter(Boolean);
    if (!domains.length) return;
    setLoading(true); setError(null); setBulkResults(null); setIsDemo(false);
    try {
      const results: DomainAuditResult[] = await Promise.all(domains.map((d) => api.auditDomain(d)));
      setBulkResults(results);
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  function loadDemo() {
    setResult(demoDomain); setIsDemo(true); setError(null); setBulkResults(null);
  }

  return (
    <ModuleLayout title={t.modules.domain.title} icon="🔍" iconLabel="Security tool" explainer={t.modules.domain.explainer}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className={`bulk-toggle ${!isBulk ? 'lang-btn--active' : ''}`}
          onClick={() => setIsBulk(false)}
        >
          {t.singleMode}
        </button>
        <button
          type="button"
          className={`bulk-toggle ${isBulk ? 'lang-btn--active' : ''}`}
          onClick={() => setIsBulk(true)}
        >
          {t.bulkMode}
        </button>
      </div>

      {!isBulk ? (
        <form onSubmit={runSingle} noValidate>
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
              <button type="submit" className="btn btn-primary" disabled={loading || !domain || isRateLimited} aria-busy={loading}>
                {loading && <span className="spinner" aria-hidden="true" />}
                {loading ? t.auditing : t.analyze}
              </button>
            </div>
            <p className="input-hint">{t.hintDomain}</p>
          </div>
          <button type="button" className="export-btn" style={{ marginBottom: '0.5rem' }} onClick={loadDemo}>
            {t.tryDemo}
          </button>
        </form>
      ) : (
        <form onSubmit={runBulk} noValidate>
          <div className="field" style={{ marginBottom: '1.25rem' }}>
            <label className="field-label" htmlFor={bulkId}>{t.bulkMode}</label>
            <textarea
              id={bulkId}
              className="bulk-textarea"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={t.bulkPlaceholder}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !bulkText.trim()} aria-busy={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? t.bulkAuditing : t.bulkAudit}
          </button>
        </form>
      )}

      {isRateLimited && (
        <p className="error-msg" role="alert">{t.rateLimited(countdown)}</p>
      )}
      {error && !isRateLimited && (
        <p id={errorId} className="error-msg" role="alert">
          <span aria-hidden="true">{t.errorPrefix}</span> {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && !isBulk && (
          <>
            <hr className="divider" />
            {isDemo && (
              <p className="demo-banner" role="status">
                <span aria-hidden="true">⚠</span> {t.demoLabel}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={copyLink}>{copied ? t.linkCopied : t.copyLink}</button>
              <button className="export-btn" onClick={() => downloadJson(result, `domain-${domain}`)}>{t.exportJson}</button>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <DomainResult result={result} t={t} />
          </>
        )}

        {bulkResults && (
          <>
            <hr className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>{t.bulkResults(bulkResults.length)}</p>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <div className="bulk-results-grid">
              {bulkResults.map((r, i) => (
                <div key={i} className="bulk-card animate-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <h3>{r.domain}</h3>
                  {r.ssl ? (
                    <ScoreBadge score={r.ssl.score} grade={r.ssl.grade} />
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--err)' }}>{r.sslError ?? t.sslUnavailable}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
