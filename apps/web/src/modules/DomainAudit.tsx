import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import type { DomainAuditResult } from '@watchpost/shared-types';

function RecordGroup({ label, records }: { label: string; records: string[] }) {
  if (!records.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="dns-section__title">{label}</div>
      {records.map((r, i) => <div key={i} className="dns-record">{r}</div>)}
    </div>
  );
}

export default function DomainAudit() {
  const { t } = useT();
  const [domain, setDomain] = useState('example.com');
  const [result, setResult] = useState<DomainAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.auditDomain(domain)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title={t.modules.domain.title} icon="🔍" iconLabel="Security tool" explainer={t.modules.domain.explainer}>
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
              {loading ? t.auditing : t.analyze}
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

            {/* SSL section */}
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

            {/* DNS + WHOIS section */}
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
                        { label: t.registrar,  value: result.dns.whois.registrar },
                        { label: t.domainLabel, value: t.domainAge(Math.floor(result.dns.whois.domainAge / 365)) },
                        { label: t.registered, value: result.dns.whois.createdDate.slice(0, 10) },
                        { label: t.expires,    value: result.dns.whois.expiresDate.slice(0, 10) },
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
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
