import { useState, useId } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { demoPassword } from '../demo/mockData';
import type { PasswordCheckResult } from '@watchpost/shared-types';

export default function PasswordCheck() {
  const { t } = useT();
  const { push } = useHistory();
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const inputId = useId();
  const errorId = useId();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.checkPassword(password);
      setResult(r);
      push({ type: 'password', input: '••••••••', grade: r.grade });
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  function loadDemo() {
    setResult(demoPassword); setIsDemo(true); setError(null);
  }

  return (
    <ModuleLayout title={t.modules.password.title} icon="🔑" iconLabel="Security tool" explainer={t.modules.password.explainer}>
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">🔒</span>
        <span>{t.passwordNotice}</span>
      </div>

      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.passwordLabel}</label>
          <div className="input-row">
            <input
              id={inputId}
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.placeholderPassword}
              autoComplete="off"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !password} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.analysing : t.analyze}
            </button>
          </div>
        </div>
        <button type="button" className="export-btn" style={{ marginBottom: '0.5rem' }} onClick={loadDemo}>
          {t.tryDemo}
        </button>
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
            {isDemo && (
              <p className="demo-banner" role="status">
                <span aria-hidden="true">⚠</span> {t.demoLabel}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <ScoreBadge score={result.score} grade={result.grade} />
            <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="info-cell">
                <div className="info-cell__label">{t.entropy}</div>
                <div className="info-cell__value">{result.entropy.toFixed(1)} bits</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.crackTime}</div>
                <div className="info-cell__value">{t.formatCrackTime(result.crackTimeSeconds)}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.knownBreaches}</div>
                <div
                  className="info-cell__value"
                  style={{ color: result.pwnedCount > 0 ? 'var(--err)' : 'var(--ok)' }}
                >
                  {result.pwnedCount > 0 ? result.pwnedCount.toLocaleString() : t.noneFound}
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
