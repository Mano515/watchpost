import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { api } from '../api/client';
import type { BreachCheckResult } from '@watchpost/shared-types';

export default function BreachCheck() {
  const [email, setEmail] = useState('test@example.com');
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkBreach(email)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="Email Breach Check" icon="📧">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
        <button onClick={run} disabled={loading || !email}>{loading ? 'Checking…' : 'Check'}</button>
      </div>
      {error && <p style={{ color: 'var(--grade-f)' }}>{error}</p>}
      {result && (
        result.breached ? (
          <div>
            <p style={{ color: 'var(--grade-f)', fontWeight: 600, marginBottom: '1rem' }}>
              Found in {result.breaches.length} breach{result.breaches.length > 1 ? 'es' : ''}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {result.breaches.map((b, i) => (
                <li key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
                  <div style={{ fontWeight: 600 }}>{b.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.date} · {b.dataTypes.join(', ')}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ color: 'var(--grade-a)', fontWeight: 600 }}>✓ No breaches found for this email.</p>
        )
      )}
    </ModuleLayout>
  );
}
