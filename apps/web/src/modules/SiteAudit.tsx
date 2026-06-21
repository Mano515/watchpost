import { useState, useId, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { useRateLimit } from '../hooks/useRateLimit';
import { downloadJson } from '../utils/downloadJson';
import type { SiteAuditResult, VulnFinding, VulnSeverity, EmailSecurityResult, ReputationResult, CertTransparencyResult } from '@watchpost/shared-types';
import { IconSearch } from '../components/Icons';

function SeverityLegend({ t }: { t: ReturnType<typeof useT>['t'] }) {
  const [open, setOpen] = useState(false);
  const levels: VulnSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
        }}
        aria-expanded={open}
      >
        <svg style={{ width: '0.8rem', height: '0.8rem', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        ℹ️ {t.severityLegendTitle}
      </button>
      {open && (
        <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {levels.map((sev) => (
            <li key={sev} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '4rem', flexShrink: 0,
                fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: SEVERITY_COLOR[sev],
                border: `1px solid ${SEVERITY_BORDER[sev]}`,
                borderRadius: '3px', padding: '0.15rem 0', lineHeight: 1,
              }}>
                {t.vulnSeverity[sev]}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                {t.severityLegend[sev]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const GRADE_COLOR: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)',
  D: 'var(--grade-d)', F: 'var(--grade-f)',
};

const SEVERITY_ORDER: VulnSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

const SEVERITY_COLOR: Record<VulnSeverity, string> = {
  critical: 'var(--critical)',
  high:     'var(--err)',
  medium:   'var(--warn)',
  low:      'var(--accent)',
  info:     'var(--text-muted)',
};

const SEVERITY_BORDER: Record<VulnSeverity, string> = {
  critical: 'var(--critical-border)',
  high:     'var(--err-border)',
  medium:   'var(--warn-bg)',
  low:      'color-mix(in srgb, var(--accent) 25%, transparent)',
  info:     'var(--border)',
};

// ── Sub-components ────────────────────────────────────────────────────────────


const Chevron = ({ open }: { open: boolean }) => (
  <svg
    style={{ width: '0.85rem', height: '0.85rem', flexShrink: 0, color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
    viewBox="0 0 16 16" fill="none" aria-hidden="true"
  >
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function SeverityPill({ sev, label }: { sev: VulnSeverity; label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '4rem', flexShrink: 0,
      fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
      color: SEVERITY_COLOR[sev],
      border: `1px solid ${SEVERITY_BORDER[sev]}`,
      borderRadius: '3px',
      padding: '0.15rem 0',
      lineHeight: 1,
    }}>
      {label}
    </span>
  );
}

function VulnDetail({ findings, t }: { findings: VulnFinding[]; t: ReturnType<typeof useT>['t'] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const sorted = [...findings].sort((a, b) => {
    if (a.passed !== b.passed) return a.passed ? 1 : -1;
    return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* ── Full findings list ── */}
      <ul className="result-list" role="list">
        {sorted.map((f, i) => {
          const check     = t.checks[f.key];
          const label     = check?.label ?? f.label;
          const rec       = check?.rec ?? f.recommendation;
          const why       = check?.why;
          const uid       = `${f.key}-${i}`;
          const isOpen    = openKey === uid;
          const canExpand = !f.passed && (rec || why || f.detail);

          return (
            <li
              key={uid}
              style={{
                display: 'flex', flexDirection: 'column',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${f.passed ? 'var(--ok)' : SEVERITY_COLOR[f.severity]}`,
                padding: '0.55rem 0.8rem',
                gap: 0,
              }}
            >
              {/* Row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: canExpand ? 'pointer' : 'default' }}
                onClick={() => canExpand && setOpenKey(isOpen ? null : uid)}
                role={canExpand ? 'button' : undefined}
                aria-expanded={canExpand ? isOpen : undefined}
              >
                <span aria-hidden="true" style={{
                  flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                  background: f.passed ? 'var(--ok)' : SEVERITY_COLOR[f.severity],
                  color: f.passed ? '#0d1117' : '#fff',
                }}>
                  {f.passed ? '✓' : '✗'}
                </span>
                {f.passed
                  ? <span style={{ width: '4rem', flexShrink: 0 }} aria-hidden="true" />
                  : <SeverityPill sev={f.severity} label={t.vulnSeverity[f.severity]} />
                }
                <p style={{ margin: 0, flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{label}</p>
                {canExpand && <Chevron open={isOpen} />}
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {f.detail && (
                    <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', margin: 0 }}>{f.detail}</p>
                  )}
                  {rec && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ok)', marginBottom: '0.3rem' }}>
                        🔧 {t.howToFix}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.55 }}>{rec}</p>
                    </div>
                  )}
                  {why && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: SEVERITY_COLOR[f.severity], marginBottom: '0.3rem' }}>
                        ⚠️ {t.attackScenario}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.55 }}>{why}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
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

function ReputationDetail({ rep, t }: { rep: ReputationResult; t: ReturnType<typeof useT>['t'] }) {
  const clean = !rep.urlhausListed && rep.dnsblListings.length === 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.6rem 0.9rem',
        borderRadius: 'var(--radius-sm)',
        background: clean ? 'var(--ok-bg, color-mix(in srgb, var(--ok) 10%, transparent))' : 'var(--err-bg)',
        border: `1px solid ${clean ? 'var(--ok)' : 'var(--err-border)'}`,
      }}>
        <span style={{ fontSize: '1.1rem' }}>{clean ? '✅' : '⛔'}</span>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: clean ? 'var(--ok)' : 'var(--err)' }}>
          {clean ? t.reputationClean : t.reputationFlagged}
        </span>
      </div>

      <div className="info-grid">
        <div className="info-cell">
          <div className="info-cell__label">{t.reputationUrlhaus}</div>
          <div className="info-cell__value" style={{ color: rep.urlhausListed ? 'var(--err)' : 'var(--ok)' }}>
            {rep.urlhausListed ? `⛔ ${rep.urlhausUrl ?? 'listed'}` : '✓ clean'}
          </div>
        </div>
        <div className="info-cell">
          <div className="info-cell__label">{t.reputationDnsbl}</div>
          <div className="info-cell__value" style={{ color: rep.dnsblListings.length > 0 ? 'var(--err)' : 'var(--ok)' }}>
            {rep.dnsblListings.length > 0 ? rep.dnsblListings.join(', ') : '✓ clean'}
          </div>
        </div>
      </div>
    </div>
  );
}

function CertTransparencyDetail({ ct, t }: { ct: CertTransparencyResult; t: ReturnType<typeof useT>['t'] }) {
  if (ct.certCount === 0) return <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.ctNoData}</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', margin: 0 }}>
        {t.ctCertCount(ct.certCount)}
      </p>

      {ct.issuers.length > 0 && (
        <div>
          <div className="dns-section__title">{t.ctIssuers}</div>
          {ct.issuers.map((iss, i) => <div key={i} className="dns-record">{iss}</div>)}
        </div>
      )}

      {ct.subdomains.length > 0 && (
        <div>
          <div className="dns-section__title">{t.ctSubdomains} ({ct.subdomains.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
            {ct.subdomains.map((sub, i) => (
              <span key={i} style={{
                fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '3px', padding: '0.15rem 0.4rem',
                color: 'var(--text-2)',
              }}>{sub}</span>
            ))}
          </div>
        </div>
      )}
    </div>
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
    {
      key: 'reputation',
      label: `🚦 ${t.reputationTitle}`,
      score: result.reputation?.score,
      grade: result.reputation?.grade,
      error: result.reputationError,
      content: result.reputation
        ? <ReputationDetail rep={result.reputation} t={t} />
        : <p className="error-msg" style={{ marginBottom: 0 }}>{result.reputationError}</p>,
    },
    {
      key: 'ct',
      label: `📜 ${t.ctTitle}`,
      score: undefined,
      grade: undefined,
      error: result.certTransparencyError,
      content: result.certTransparency
        ? <CertTransparencyDetail ct={result.certTransparency} t={t} />
        : <p className="error-msg" style={{ marginBottom: 0 }}>{result.certTransparencyError}</p>,
    },
  ] : [];

  return (
    <ModuleLayout
      title={t.modules.site.title}
      icon={<IconSearch size={20} />}
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

            {/* Overall score — centré, prominent */}
            <div
              role="status"
              aria-label={t.securityGrade(result.overallGrade, t.grades[result.overallGrade], result.overallScore)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                padding: '1.5rem 1rem',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius)',
                marginBottom: '1.25rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                {t.siteOverallScore}
              </p>
              <div aria-hidden="true" style={{
                width: 80, height: 80, borderRadius: '50%',
                border: `3px solid ${GRADE_COLOR[result.overallGrade]}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: GRADE_COLOR[result.overallGrade],
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{result.overallGrade}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: 500, opacity: 0.85, marginTop: '0.1rem' }}>{result.overallScore}/100</span>
              </div>
              <div aria-hidden="true">
                <div style={{ fontSize: '1rem', fontWeight: 700, color: GRADE_COLOR[result.overallGrade] }}>
                  {t.grades[result.overallGrade]}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {t.gradeLabel(result.overallGrade, result.overallScore)}
                </div>
              </div>
            </div>

            {/* Critical findings banner — all sections */}
            {(() => {
              const criticals = [
                ...(result.vuln?.findings ?? []).filter((f) => !f.passed && f.severity === 'critical'),
                ...(result.headers?.details ?? []).filter((d) => !d.passed && d.severity === 'critical'),
              ];
              if (criticals.length === 0) return null;
              return (
                <div style={{
                  background: 'var(--critical-bg)',
                  border: '1px solid var(--critical-border)',
                  borderLeft: '3px solid var(--critical)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--critical)', marginBottom: '0.5rem' }}>
                    ⛔ {criticals.length} {criticals.length === 1 ? 'vulnérabilité critique' : 'vulnérabilités critiques'} — à corriger immédiatement
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {criticals.map((f, i) => {
                      const label = ('key' in f && f.key) ? (t.checks[f.key]?.label ?? f.label) : f.label;
                      const detail = 'detail' in f ? f.detail : undefined;
                      return (
                        <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-2)', display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--critical)', fontSize: '0.7rem', flexShrink: 0 }}>▸</span>
                          <span>{label}</span>
                          {detail && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>— {detail}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })()}

            {/* Severity legend */}
            <SeverityLegend t={t} />

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
            {sections.map(({ key, label, grade, score, error, content }) => (
              <div key={key} className="site-section">
                <button
                  className="site-section__toggle"
                  aria-expanded={openSection === key}
                  onClick={() => toggle(key)}
                >
                  <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                  {error ? (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>—</span>
                  ) : grade ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{score}/100</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: GRADE_COLOR[grade] }}>{grade}</span>
                    </span>
                  ) : null}
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
