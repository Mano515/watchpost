import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import type { SslCheckResult } from '@watchpost/shared-types';

export default function SslCheck() {
  const [domain, setDomain] = useState('example.com');
  const [result, setResult] = useState<SslCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkSsl(domain)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="SSL/TLS Checker" icon="🔒">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        <button onClick={run} disabled={loading || !domain}>{loading ? 'Checking…' : 'Check'}</button>
      </div>
      {error && <p style={{ color: 'var(--grade-f)' }}>{error}</p>}
      {result && (
        <>
          <ScoreBadge score={result.score} grade={result.grade} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <span>Issuer: <strong style={{ color: 'var(--text)' }}>{result.issuer}</strong></span>
            <span>TLS: <strong style={{ color: 'var(--text)' }}>{result.tlsVersion}</strong></span>
            <span>Expires: <strong style={{ color: result.daysUntilExpiry <= 30 ? 'var(--grade-f)' : 'var(--text)' }}>{result.daysUntilExpiry}d</strong></span>
            <span>Algorithm: <strong style={{ color: 'var(--text)' }}>{result.signatureAlgorithm}</strong></span>
          </div>
          <ResultPanel details={result.details} />
        </>
      )}
    </ModuleLayout>
  );
}
