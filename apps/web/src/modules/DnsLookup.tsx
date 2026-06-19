import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { api } from '../api/client';
import type { DnsLookupResult } from '@watchpost/shared-types';

function RecordGroup({ label, records }: { label: string; records: string[] }) {
  if (!records.length) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</div>
      {records.map((r, i) => (
        <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: 'var(--bg)', padding: '0.3rem 0.6rem', borderRadius: 4, marginBottom: 2 }}>{r}</div>
      ))}
    </div>
  );
}

export default function DnsLookup() {
  const [domain, setDomain] = useState('example.com');
  const [result, setResult] = useState<DnsLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.dnsLookup(domain)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="DNS / WHOIS Lookup" icon="🌐">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        <button onClick={run} disabled={loading || !domain}>{loading ? 'Looking up…' : 'Lookup'}</button>
      </div>
      {error && <p style={{ color: 'var(--grade-f)' }}>{error}</p>}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>DNS Records</h3>
            <RecordGroup label="A" records={result.records.A} />
            <RecordGroup label="MX" records={result.records.MX} />
            <RecordGroup label="NS" records={result.records.NS} />
            <RecordGroup label="TXT" records={result.records.TXT} />
          </div>
          {result.whois && (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>WHOIS / RDAP</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registrar <strong style={{ color: 'var(--text)' }}>{result.whois.registrar}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Domain age <strong style={{ color: 'var(--text)' }}>{Math.floor(result.whois.domainAge / 365)} years</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Created <strong style={{ color: 'var(--text)' }}>{result.whois.createdDate.slice(0, 10)}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Expires <strong style={{ color: 'var(--text)' }}>{result.whois.expiresDate.slice(0, 10)}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </ModuleLayout>
  );
}
