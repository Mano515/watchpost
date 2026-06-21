import { useState, useId, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import { downloadJson } from '../utils/downloadJson';
import ScoreBadge from '../components/ScoreBadge';
import ResultPanel from '../components/ResultPanel';
import { api } from '../api/client';
import { useT } from '../i18n/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { usePageTitle } from '../hooks/usePageTitle';
import { useRateLimit } from '../hooks/useRateLimit';
import { demoPassword } from '../demo/mockData';
import type { PasswordCheckResult } from '@watchpost/shared-types';
import { IconLock } from '../components/Icons';

// ── Password generator ────────────────────────────────────────────────────────

const WORDS = [
  'apple','brave','cloud','delta','eagle','flame','grace','honey','ivory','joker',
  'karma','lemon','maple','nerve','ocean','pixel','quest','radar','solar','tiger',
  'ultra','valve','water','xenon','yacht','zebra','amber','blaze','coral','dance',
  'ember','frost','ghost','haven','indigo','jasper','kiwi','lunar','magic','noble',
  'onyx','pearl','quartz','raven','storm','titan','urban','vivid','willow','xray',
  'yield','zephyr','alpha','brisk','cedar','dusty','earth','fable','glide','haze',
  'iron','jade','knack','loft','manor','night','orbit','prime','quiet','ridge',
  'swift','thorn','unity','vapor','wheat','xenix','young','zinco','arch','bold',
];

function generatePassphrase(): string {
  const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];
  return [pick(), pick(), pick(), pick()].join('-');
}

function generateRandom(): string {
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits  = '0123456789';
  const symbols = '!@#$%^&*-_+=';
  const all = lower + upper + digits + symbols;
  // Guarantee at least one of each type
  const required = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  const rest = Array.from({ length: 12 }, () => all[Math.floor(Math.random() * all.length)]);
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

// ── Strength bar ──────────────────────────────────────────────────────────────

const STRENGTH_COLOR = ['var(--err)', 'var(--err)', 'var(--warn)', 'var(--grade-b)', 'var(--grade-a)'];

function StrengthBar({ score, label }: { score: number; label: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Strength</span>
        <span style={{ color: STRENGTH_COLOR[score], fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: '3px', height: '6px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            flex: 1, borderRadius: '3px',
            background: i <= score ? STRENGTH_COLOR[score] : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Generator panel ───────────────────────────────────────────────────────────

function Generator({ onUse, t }: { onUse: (pwd: string) => void; t: ReturnType<typeof useT>['t'] }) {
  const [mode, setMode]       = useState<'passphrase' | 'random'>('passphrase');
  const [generated, setGen]   = useState('');
  const [copied, setCopied]   = useState(false);

  function generate() {
    const pwd = mode === 'passphrase' ? generatePassphrase() : generateRandom();
    setGen(pwd);
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <details style={{ marginBottom: '1.25rem' }}>
      <summary style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', userSelect: 'none' }}>
        ✨ {t.pwdGenerator}
      </summary>
      <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {(['passphrase', 'random'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setGen(''); }}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '99px',
                border: '1px solid var(--border)',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {m === 'passphrase' ? t.pwdGenPassphrase : t.pwdGenRandom}
            </button>
          ))}
        </div>
        {mode === 'passphrase' && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            4 random words joined with dashes — easy to remember, hard to crack.
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--secondary" onClick={generate} style={{ fontSize: '0.82rem' }}>
            Generate
          </button>
          {generated && (
            <>
              <code style={{ flex: 1, padding: '0.4rem 0.6rem', background: 'var(--surface-2)', borderRadius: '4px', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {generated}
              </code>
              <button type="button" className="btn btn--secondary" onClick={copy} style={{ fontSize: '0.78rem', minWidth: '60px' }}>
                {copied ? t.pwdGenCopied : t.pwdGenCopy}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => onUse(generated)} style={{ fontSize: '0.78rem' }}>
                Test it ↑
              </button>
            </>
          )}
        </div>
      </div>
    </details>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PasswordCheck() {
  const { t } = useT();
  const { push } = useHistory();
  const location = useLocation();
  const initialPwd = (location.state as { pwd?: string } | null)?.pwd ?? '';
  const [password, setPassword] = useState(initialPwd);
  const [result, setResult]     = useState<PasswordCheckResult | null>(null);
  const [loading, setLoading]   = useState(false);
  usePageTitle(result ? `${t.modules.password.title} — ${t.grades[result.grade]}` : t.modules.password.title);
  const [error, setError]       = useState<string | null>(null);
  const [isDemo, setIsDemo]     = useState(false);
  const { countdown, handleError, isRateLimited } = useRateLimit();
  const inputId    = useId();
  const errorId    = useId();
  const hasAutoRun = useRef(false);

  useEffect(() => {
    if (initialPwd && !hasAutoRun.current) {
      hasAutoRun.current = true;
      runPassword(initialPwd);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function runPassword(pwd: string) {
    setLoading(true); setError(null); setResult(null); setIsDemo(false);
    try {
      const r = await api.checkPassword(pwd);
      setResult(r);
      push({ type: 'password', input: '••••••••', grade: r.grade });
    } catch (err) {
      const msg = handleError(err);
      if (msg) setError(msg);
    } finally { setLoading(false); }
  }

  async function run(e: React.FormEvent) {
    e.preventDefault();
    runPassword(password);
  }

  function loadDemo() { setResult(demoPassword); setIsDemo(true); setError(null); }

  const strengthLabel = result?.strengthScore !== undefined ? t.pwdStrength[result.strengthScore as 0|1|2|3|4] : '';

  return (
    <ModuleLayout title={t.modules.password.title} icon={<IconLock size={20} />} iconLabel="Security tool" explainer={t.modules.password.explainer}>
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">🔒</span>
        <span>{t.passwordNotice}</span>
      </div>

      <form onSubmit={run} noValidate>
        <div className="field" style={{ marginBottom: '1.25rem' }}>
          <label className="field-label" htmlFor={inputId}>{t.passwordLabel}</label>
          <div className="input-row">
            <input
              id={inputId} className="input" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={t.placeholderPassword} autoComplete="off"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error} required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !password || isRateLimited} aria-busy={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? t.analysing : t.analyze}
            </button>
          </div>
          <p className="input-hint">{t.hintPassword}</p>
        </div>
        <button type="button" className="export-btn" style={{ marginBottom: '1rem' }} onClick={loadDemo}>
          {t.tryDemo}
        </button>
      </form>

      <Generator onUse={(pwd) => { setPassword(pwd); setResult(null); }} t={t} />

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
            {isDemo && <p className="demo-banner" role="status"><span aria-hidden="true">⚠</span> {t.demoLabel}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button className="export-btn" onClick={() => downloadJson(result, 'password-check')}>{t.exportJson}</button>
              <button className="export-btn" onClick={() => window.print()}>{t.exportPdf}</button>
            </div>
            <ScoreBadge score={result.score} grade={result.grade} />

            {result.strengthScore !== undefined && (
              <StrengthBar score={result.strengthScore} label={strengthLabel} />
            )}

            <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="info-cell">
                <div className="info-cell__label">{t.entropy}</div>
                <div className="info-cell__value">{result.entropy.toFixed(1)} bits</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.crackTime}</div>
                <div className="info-cell__value">{t.formatCrackTime(result.crackTimeSeconds)}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{t.crackTimeNote}</div>
              </div>
              <div className="info-cell">
                <div className="info-cell__label">{t.knownBreaches}</div>
                <div className="info-cell__value" style={{ color: result.pwnedCount > 0 ? 'var(--err)' : 'var(--ok)' }}>
                  {result.pwnedCount > 0 ? result.pwnedCount.toLocaleString() : t.noneFound}
                </div>
              </div>
            </div>

            {/* zxcvbn warning */}
            {result.warning && (
              <div style={{ padding: '0.6rem 0.9rem', background: 'color-mix(in srgb, var(--warn) 12%, transparent)', border: '1px solid var(--warn)', borderRadius: 'var(--radius)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                ⚠ {result.warning}
              </div>
            )}

            {/* zxcvbn suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.pwdSuggestions}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {result.suggestions.map((s, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-2)', display: 'flex', gap: '0.5rem' }}>
                      <span aria-hidden="true">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ResultPanel details={result.details} />
          </>
        )}
      </div>
    </ModuleLayout>
  );
}
