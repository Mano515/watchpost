import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import type { HeaderScanResult } from '@watchpost/shared-types';

export default function HeaderScan() {
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState<HeaderScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.scanHeaders(url)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="HTTP Header Scanner" icon="🛡️">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        <button onClick={run} disabled={loading || !url}>{loading ? 'Scanning…' : 'Scan'}</button>
      </div>
      {error && <p style={{ color: 'var(--grade-f)' }}>{error}</p>}
      {result && (
        <>
          <ScoreBadge score={result.score} grade={result.grade} />
          <ResultPanel details={result.details} />
        </>
      )}
    </ModuleLayout>
  );
}
