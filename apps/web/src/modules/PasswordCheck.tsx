import { useState, useId } from 'react';
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
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try { setResult(await api.checkPassword(password)); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <ModuleLayout title="Password Strength" icon="🔑" iconLabel="Security tool">
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">🔒</span>
        <span>
          Your password is <strong>never stored or logged</strong>. The breach check uses
          k-anonymity — only 5 SHA-1 characters are sent to HaveIBeenPwned.
        </span>
      </div>

      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>Password to analyse</label>
          <div className="input-row">
            <input
              id={inputId}
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              autoComplete="off"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !password}
              aria-busy={loading}
            >
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? 'Analysing…' : 'Analyse'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p id={errorId} className="error-msg" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <>
            <hr className="divider" />
            <ScoreBadge score={result.score} grade={result.grade} />

            <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="info-cell">
                <div className="info-cell__label">Entropy</div>
                <div className="info-cell__value">{result.entropy.toFixed(1)} bits</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">Crack time</div>
                <div className="info-cell__value">{result.crackTimeEstimate}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">Known breaches</div>
                <div
                  className="info-cell__value"
                  style={{ color: result.pwnedCount > 0 ? 'var(--err)' : 'var(--ok)' }}
                >
                  {result.pwnedCount > 0 ? result.pwnedCount.toLocaleString() : 'None found'}
                </div>
              </div>
            </div>

            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
