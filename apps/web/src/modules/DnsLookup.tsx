import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import type { DnsLookupResult } from '@watchpost/shared-types';

function RecordGroup({ label, records }: { label: string; records: string[] }) {
  if (!records.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="dns-section__title">{label}</div>
      {records.map((r, i) => <div key={i} className="dns-record">{r}</div>)}
    </div>
  );
}

export default function DnsLookup() {
  const { t } = useT();
  const [domain, setDomain] = useState('example.com');
  const [result, setResult] = useState<DnsLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.dnsLookup(domain)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title={t.modules.dns.title} icon="🌐" iconLabel="Security tool" explainer={t.modules.dns.explainer}>
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
              {loading ? t.lookingUp : t.analyze}
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
            <div className="dns-grid">
              <section aria-label={t.dnsRecords}>
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>{t.dnsRecords}</h2>
                <RecordGroup label="A" records={result.records.A} />
                <RecordGroup label="MX" records={result.records.MX} />
                <RecordGroup label="NS" records={result.records.NS} />
                <RecordGroup label="TXT" records={result.records.TXT} />
                {!result.records.A.length && !result.records.MX.length && !result.records.NS.length && !result.records.TXT.length && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.noRecords}</p>
                )}
              </section>

              {result.whois && (
                <section aria-label={t.whoisTitle}>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>{t.whoisTitle}</h2>
                  <dl>
                    {[
                      { label: t.registrar,   value: result.whois.registrar },
                      { label: t.domainLabel, value: t.domainAge(Math.floor(result.whois.domainAge / 365)) },
                      { label: t.registered,  value: result.whois.createdDate.slice(0, 10) },
                      { label: t.expires,     value: result.whois.expiresDate.slice(0, 10) },
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
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
