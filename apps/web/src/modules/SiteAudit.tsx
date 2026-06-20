import { useState, useId, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import type { SiteAuditResult, VulnFinding, VulnSeverity, EmailSecurityResult } from '@watchpost/shared-types';

const GRADE_COLOR: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)',
  D: 'var(--grade-d)', F: 'var(--grade-f)',
};

const SEVERITY_ORDER: VulnSeverity[] = ['high', 'medium', 'low', 'info'];
const SEVERITY_COLOR: Record<VulnSeverity, string> = {
  high: 'var(--err)', medium: 'var(--warn)', low: 'var(--accent)', info: 'var(--text-muted)',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SubScore({ label, score, grade, error }: { label: string; score?: number; grade?: string; error?: string | null }) {
  if (error) return (
    <div className="site-sub-score site-sub-score--error">
      <span className="site-sub-score__label">{label}</span>
      <span className="site-sub-score__error">—</span>
    </div>
  );
  return (
    <div className="site-sub-score">
      <span className="site-sub-score__label">{label}</span>
      <span className="site-sub-score__grade" style={{ color: GRADE_COLOR[grade ?? 'F'] }}>{grade}</span>
      <span className="site-sub-score__score">{score}/100</span>
    </div>
  );
}

function VulnDetail({ findings, t }: { findings: VulnFinding[]; t: ReturnType<typeof useT>['t'] }) {
  const grouped = SEVERITY_ORDER
    .map((sev) => ({ sev, items: findings.filter((f) => f.severity === sev) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {grouped.map(({ sev, items }) => (
        <section key={sev} style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SEVERITY_COLOR[sev], marginBottom: '0.4rem' }}>
            {t.vulnSeverity[sev]}
          </h3>
          <ul className="result-list" role="list">
            {items.map((f, i) => {
              const check = t.checks[f.key];
              return (
                <li key={i} className={`result-item ${f.passed ? 'result-item--pass' : 'result-item--fail'}`}>
                  <span className={`result-item__icon ${f.passed ? 'result-item__icon--pass' : 'result-item__icon--fail'}`} aria-hidden="true">
                    {f.passed ? '✓' : '✗'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p className="result-item__label" style={{ margin: 0 }}>{check?.label ?? f.label}</p>
                    {f.detail && <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.detail}</p>}
                    {!f.passed && (check?.rec ?? f.recommendation) && (
                      <p className="result-item__rec">{check?.rec ?? f.recommendation}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

function InfoCell({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div className="info-cell">
      <div className="info-cell__label">{label}</div>
      <div className="info-cell__value" style={{ fontFamily: mono ? 'var(--font-mono)' : undefined, fontSize: mono ? '0.75rem' : undefined, color, wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  );
}

function RecordGroup({ label, records }: { label: string; records: string[] }) {
  if (!records.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="dns-section__title">{label}</div>
      {records.map((r, i) => <div key={i} className="dns-record">{r}</div>)}
    </div>
  );
}

function SslDetail({ ssl, sslError, t }: { ssl: SiteAuditResult['domainAudit'] extends null ? never : NonNullable<SiteAuditResult['domainAudit']>['ssl']; sslError?: string | null; t: ReturnType<typeof useT>['t'] }) {
  if (!ssl) return <p className="error-msg" style={{ marginBottom: 0 }}><span aria-hidden="true">{t.errorPrefix}</span> {sslError ?? t.sslUnavailable}</p>;
  return (
    <>
      <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
        <InfoCell label={t.issuer}    value={ssl.issuer} />
        <InfoCell label={t.protocol}  value={ssl.tlsVersion} />
        <InfoCell label={t.expires}   value={t.expiresIn(ssl.daysUntilExpiry)} color={ssl.daysUntilExpiry <= 30 ? 'var(--err)' : undefined} />
        <InfoCell label={t.signature} value={ssl.signatureAlgorithm} />
      </div>
      <ResultPanel details={ssl.details} />
    </>
  );
}

function DnsDetail({ domainAudit, t }: { domainAudit: NonNullable<SiteAuditResult['domainAudit']>; t: ReturnType<typeof useT>['t'] }) {
  const { records, whois } = domainAudit.dns;
  return (
    <div className="dns-grid">
      <div>
        <RecordGroup label="A"   records={records.A} />
        <RecordGroup label="MX"  records={records.MX} />
        <RecordGroup label="NS"  records={records.NS} />
        <RecordGroup label="TXT" records={records.TXT} />
        {!Object.values(records).some((r) => r.length) && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.noRecords}</p>
        )}
      </div>
      {whois && (
        <dl>
          {[
            { label: t.registrar,   value: whois.registrar },
            { label: t.domainLabel, value: t.domainAge(Math.floor(whois.domainAge / 365)) },
            { label: t.registered,  value: whois.createdDate.slice(0, 10) },
            { label: t.expires,     value: whois.expiresDate.slice(0, 10) },
          ].map(({ label, value }) => (
            <div key={label} className="whois-row">
              <dt className="whois-row__label">{label}</dt>
              <dd className="whois-row__value">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function EmailSecurityDetail({ es, t }: { es: EmailSecurityResult; t: ReturnType<typeof useT>['t'] }) {
  return (
    <>
      <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
        <InfoCell label={t.spfLabel}   value={es.spf   ?? '—'} mono />
        <InfoCell label={t.dmarcLabel} value={es.dmarc ?? '—'} mono />
        <InfoCell label={t.caaLabel}   value={es.caa.length ? es.caa.join(', ') : '—'} mono />
        <InfoCell label={t.dnssecLabel} value={es.dnssec ? '✓' : '✗'} color={es.dnssec ? 'var(--ok)' : 'var(--err)'} />
      </div>
      <ResultPanel details={es.score.details} />
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SiteAudit() {
  const { t } = useT();
  const { push } = useHistory();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDomain = searchParams.get('domain') ?? 'example.com';
  const [domain, setDomain] = useState(initialDomain);
  const [result, setResult] = useState<SiteAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const inputId    = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  async function performScan(target: string) {
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await api.auditSite(target);
      setResult(r);
      push({ type: 'site', input: target, grade: r.overallGrade });
      setSearchParams({ domain: target }, { replace: true });
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (searchParams.get('domain') && !hasAutoRun.current) {
      hasAutoRun.current = true;
      performScan(initialDomain);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(section: string) { setOpenSection((s) => s === section ? null : section); }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const da = result?.domainAudit;

  const sections = result ? [
    {
      key: 'headers',
      label: `🛡️ ${t.modules.headers.title}`,
      score: result.headers?.score,
      grade: result.headers?.grade,
      error: result.headersError,
      content: result.headers
        ? <ResultPanel details={result.headers.details} />
        : <p className="error-msg" style={{ marginBottom: 0 }}>{result.headersError}</p>,
    },
    {
      key: 'vuln',
      label: `🔬 ${t.modules.vuln.title}`,
      score: result.vuln?.score,
      grade: result.vuln?.grade,
      error: result.vulnError,
      content: result.vuln ? (
        <>
          {result.vuln.detectedStack && result.vuln.detectedStack.length > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>{t.detectedStack}:</span>{' '}
              {result.vuln.detectedStack.join(', ')}
              {result.vuln.crawledPages && result.vuln.crawledPages > 1
                ? ` · ${t.crawledPages(result.vuln.crawledPages)}`
                : ''}
            </p>
          )}
          <VulnDetail findings={result.vuln.findings} t={t} />
        </>
      ) : <p className="error-msg" style={{ marginBottom: 0 }}>{result.vulnError}</p>,
    },
    {
      key: 'ssl',
      label: `🔒 ${t.sslTitle}`,
      score: da?.ssl?.score,
      grade: da?.ssl?.grade,
      error: result.domainError,
      content: <SslDetail ssl={da?.ssl ?? null} sslError={result.domainError} t={t} />,
    },
    {
      key: 'email',
      label: `✉️ ${t.emailSecTitle}`,
      score: da?.dns?.emailSecurity?.score?.score,
      grade: da?.dns?.emailSecurity?.score?.grade,
      error: result.domainError,
      content: da?.dns?.emailSecurity
        ? <EmailSecurityDetail es={da.dns.emailSecurity} t={t} />
        : <p className="error-msg" style={{ marginBottom: 0 }}>{result.domainError}</p>,
    },
    {
      key: 'dns',
      label: `🌐 ${t.dnsTitle}`,
      score: undefined,
      grade: undefined,
      error: result.domainError,
      content: da
        ? <DnsDetail domainAudit={da} t={t} />
        : <p className="error-msg" style={{ marginBottom: 0 }}>{result.domainError}</p>,
    },
  ] : [];

  return (
    <ModuleLayout
      title={t.modules.site.title}
      icon="🔬"
      iconLabel="Security tool"
      explainer={t.modules.site.explainer}
    >
      <form onSubmit={(e) => { e.preventDefault(); performScan(domain); }} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.domainLabel}</label>
          <div className="input-row">
            <input
              id={inputId} className="input" type="text"
              value={domain} onChange={(e) => setDomain(e.target.value)}
              placeholder={t.placeholderDomain}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error} required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !domain || isRateLimited} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.scanning : t.analyze}
            </button>
          </div>
          <p className="input-hint">{t.hintDomain}</p>
        </div>
      </form>

      {isRateLimited && <p className="error-msg" role="alert">{t.rateLimited(countdown)}</p>}
      {error && !isRateLimited && (
        <p id={errorId} className="error-msg" role="alert">
          <span aria-hidden="true">{t.errorPrefix}</span> {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <>
            <hr className="divider" />

            {/* Overall score */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.siteOverallScore}
              </p>
              <ScoreBadge score={result.overallScore} grade={result.overallGrade} />
            </div>

            {/* Sub-scores */}
            <div className="site-sub-scores">
              <SubScore label={t.modules.headers.title} score={result.headers?.score}          grade={result.headers?.grade}          error={result.headersError} />
              <SubScore label={t.modules.vuln.title}    score={result.vuln?.score}             grade={result.vuln?.grade}             error={result.vulnError} />
              <SubScore label={t.sslTitle}              score={da?.ssl?.score}                 grade={da?.ssl?.grade}                 error={result.domainError} />
              <SubScore label={t.emailSecTitle}         score={da?.dns?.emailSecurity?.score?.score} grade={da?.dns?.emailSecurity?.score?.grade} error={result.domainError} />
            </div>

            {/* Export */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
              <button className="export-btn" onClick={copyLink}>{copied ? t.linkCopied : t.copyLink}</button>
              <button className="export-btn" onClick={() => downloadJson(result, `site-audit-${domain}`)}>{t.exportJson}</button>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {t.scannedAt} {new Date(result.scannedAt).toLocaleString()}
            </p>

            {/* Expandable sections */}
            {sections.map(({ key, label, content }) => (
              <div key={key} className="site-section">
                <button
                  className="site-section__toggle"
                  aria-expanded={openSection === key}
                  onClick={() => toggle(key)}
                >
                  <span>{label}</span>
                  <svg className={`explainer-summary__chevron${openSection === key ? ' explainer-summary__chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openSection === key && <div className="site-section__body">{content}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
