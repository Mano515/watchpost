import { useState } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import type { PasswordCheckResult } from '@watchpost/shared-types';

export default function PasswordCheck() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkPassword(password)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="Password Strength" icon="🔑">
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Your password is never stored. Breach check uses k-anonymity — only 5 SHA-1 characters are sent to HaveIBeenPwned.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password to analyse"
        />
        <button onClick={run} disabled={loading || !password}>{loading ? 'Checking…' : 'Analyse'}</button>
      </div>
      {error && <p style={{ color: 'var(--grade-f)' }}>{error}</p>}
      {result && (
        <>
          <ScoreBadge score={result.score} grade={result.grade} />
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Entropy: <strong style={{ color: 'var(--text)' }}>{result.entropy.toFixed(1)} bits</strong></span>
            <span>Crack time: <strong style={{ color: 'var(--text)' }}>{result.crackTimeEstimate}</strong></span>
            {result.pwnedCount > 0 && (
              <span style={{ color: 'var(--grade-f)' }}>Found in <strong>{result.pwnedCount.toLocaleString()}</strong> breaches</span>
            )}
          </div>
          <ResultPanel details={result.details} />
        </>
      )}
    </ModuleLayout>
  );
}
